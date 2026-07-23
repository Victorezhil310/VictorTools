import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook signature (simplified - in production use stripe.webhooks.constructEvent)
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event;
  try {
    const parts = signature.split(",");
    const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
    const sig = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

    const signedPayload = `${timestamp}.${body}`;
    const expectedSig = crypto
      .createHmac("sha256", endpointSecret)
      .update(signedPayload)
      .digest("hex");

    if (sig !== expectedSig) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 401 });
  }

  const supabase = createServiceClient();

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const status = subscription.status;

    if (status === "active") {
      await supabase
        .from("profiles")
        .update({ plan: "pro", plan_updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId);
    } else {
      await supabase
        .from("profiles")
        .update({ plan: "free", plan_updated_at: new Date().toISOString() })
        .eq("stripe_customer_id", customerId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    await supabase
      .from("profiles")
      .update({ plan: "free", plan_updated_at: new Date().toISOString() })
      .eq("stripe_customer_id", subscription.customer);
  }

  return NextResponse.json({ received: true });
}
