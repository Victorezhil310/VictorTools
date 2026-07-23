import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const supabase = createServiceClient();

  if (event.event === "subscription.activated" || event.event === "payment.captured") {
    const payload = event.payload;
    const customerId = payload?.payment?.entity?.customer_id || payload?.subscription?.entity?.customer_id;

    if (customerId) {
      // Update user plan in Supabase
      await supabase
        .from("profiles")
        .update({ plan: "pro", plan_updated_at: new Date().toISOString() })
        .eq("razorpay_customer_id", customerId);
    }
  }

  if (event.event === "subscription.cancelled") {
    const payload = event.payload;
    const customerId = payload?.subscription?.entity?.customer_id;

    if (customerId) {
      await supabase
        .from("profiles")
        .update({ plan: "free", plan_updated_at: new Date().toISOString() })
        .eq("razorpay_customer_id", customerId);
    }
  }

  return NextResponse.json({ received: true });
}
