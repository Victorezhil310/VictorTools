import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Razorpay from "razorpay";
import { PRICING } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are not configured on the server." },
        { status: 501 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // 1. Create plan dynamically in test mode
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "VictorTools Pro Plan",
        amount: PRICING.monthly.inr * 100, // in paise
        currency: "INR",
      },
    });

    // 2. Create subscription linked to the authenticated user
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      total_count: 12, // 1 year duration cycles
      quantity: 1,
      customer_notify: 1,
      notes: {
        user_id: user.id,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      planId: plan.id,
    });
  } catch (e: any) {
    console.error("Razorpay subscription session error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to create subscription session" },
      { status: 500 }
    );
  }
}
