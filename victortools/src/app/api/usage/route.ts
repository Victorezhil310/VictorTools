import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_DAILY_LIMIT } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const { toolId } = await request.json();

  if (!toolId) {
    return NextResponse.json({ error: "toolId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get IP for anonymous rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const identifier = user?.id || `anon_${ip}`;

  // Check usage today
  const today = new Date().toISOString().split("T")[0];

  const { data: usage } = await supabase
    .from("usage")
    .select("*")
    .eq("identifier", identifier)
    .eq("tool_id", toolId)
    .eq("date", today)
    .single();

  if (usage && usage.count >= FREE_DAILY_LIMIT && !user) {
    return NextResponse.json(
      { error: "Daily limit reached. Sign up for more usage.", limit: FREE_DAILY_LIMIT },
      { status: 429 }
    );
  }

  // Increment usage
  if (usage) {
    await supabase
      .from("usage")
      .update({ count: usage.count + 1 })
      .eq("id", usage.id);
  } else {
    await supabase.from("usage").insert({
      identifier,
      tool_id: toolId,
      date: today,
      count: 1,
    });
  }

  return NextResponse.json({ success: true, count: (usage?.count || 0) + 1 });
}
