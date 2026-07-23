import { createAdminClient } from "@/lib/supabase/server";
import { LIMITS } from "./constants";

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  plan: "free" | "pro";
}

export async function checkRateLimit(
  userId: string | null,
  ipAddress: string,
  toolSlug: string
): Promise<RateLimitResult> {
  const supabaseAdmin = await createAdminClient();
  
  // 1. Get user plan details
  let plan: "free" | "pro" = "free";
  if (userId) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .single();
    if (profile?.plan === "pro") {
      plan = "pro";
    }
  }

  const limit = LIMITS[plan].dailyLimit;

  // 2. Identify client (user id or IP)
  const identifier = userId || ipAddress;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 3. Query limits counter for current day
  const { data: countData } = await supabaseAdmin
    .from("rate_limits")
    .select("count")
    .eq("identifier", identifier)
    .eq("tool_slug", toolSlug)
    .eq("window_start", today)
    .single();

  const currentCount = countData?.count || 0;

  if (currentCount >= limit) {
    return {
      allowed: false,
      count: currentCount,
      limit,
      plan,
    };
  }

  return {
    allowed: true,
    count: currentCount,
    limit,
    plan,
  };
}

export async function incrementRateLimit(
  userId: string | null,
  ipAddress: string,
  toolSlug: string
) {
  const supabaseAdmin = await createAdminClient();
  const identifier = userId || ipAddress;
  const today = new Date().toISOString().split("T")[0];

  // Upsert increment rate limits counter
  const { data } = await supabaseAdmin
    .from("rate_limits")
    .select("id, count")
    .eq("identifier", identifier)
    .eq("tool_slug", toolSlug)
    .eq("window_start", today)
    .single();

  if (data) {
    await supabaseAdmin
      .from("rate_limits")
      .update({ count: data.count + 1 })
      .eq("id", data.id);
  } else {
    await supabaseAdmin.from("rate_limits").insert({
      identifier,
      tool_slug: toolSlug,
      count: 1,
      window_start: today,
    });
  }
}
