import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey || !webhookSecret) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 501 });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.accredited" as any,
    });

    const signature = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature header" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Stripe Webhook Signature Verification Failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const supabaseAdmin = await createAdminClient();
    const eventType = event.type;

    // Handle completed checkout session
    if (eventType === "checkout.session.completed" || eventType === "invoice.payment_succeeded") {
      const session = event.data.object as any;
      const subscriptionId = session.subscription;
      const userId = session.metadata?.user_id;

      if (userId && subscriptionId) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 31); // 31-day billing window

        // Update profile
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            plan_expires_at: expiresAt.toISOString(),
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        // Audit Trail entry
        await supabaseAdmin.from("payment_events").insert({
          user_id: userId,
          provider: "stripe",
          event_type: eventType,
          event_id: event.id || subscriptionId,
          payload: session,
        });
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (e: any) {
    console.error("Stripe Webhook Error:", e);
    return NextResponse.json(
      { error: e.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
