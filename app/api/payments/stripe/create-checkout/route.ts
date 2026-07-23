import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { PRICING, BRAND } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe key configuration is missing on the server." },
        { status: 501 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.accredited" as any, // fallback or safe load
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://victormedia.net";

    // Create Subscription Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${BRAND.name} Pro Plan`,
              description: "Unlimited daily access, higher file sizes, no watermark.",
            },
            unit_amount: Math.round(PRICING.monthly.usd * 100), // in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Stripe Checkout Error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to create Stripe Checkout session" },
      { status: 500 }
    );
  }
}
