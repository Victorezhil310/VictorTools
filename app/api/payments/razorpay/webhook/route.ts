import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret configuration missing" }, { status: 501 });
    }

    const signature = req.headers.get("x-razorpay-signature");
    const rawBody = await req.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    
    // Audit log insertion
    const supabaseAdmin = await createAdminClient();

    // Handle Subscription events
    if (eventType === "subscription.charged" || eventType === "subscription.activated") {
      const subscriptionEntity = event.payload?.subscription?.entity;
      const subscriptionId = subscriptionEntity?.id;
      const userId = subscriptionEntity?.notes?.user_id;

      if (userId && subscriptionId) {
        // Upgrade user plan in profiles table
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 31); // 31-day billing window

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            plan_expires_at: expiresAt.toISOString(),
            razorpay_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        
        // Log payment audit event
        await supabaseAdmin.from("payment_events").insert({
          user_id: userId,
          provider: "razorpay",
          event_type: eventType,
          event_id: event.id || subscriptionId,
          payload: event,
        });
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (e: any) {
    console.error("Razorpay Webhook Error:", e);
    return NextResponse.json(
      { error: e.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
