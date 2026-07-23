import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { incrementRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { toolSlug, fileSize, status = "completed" } = await req.json();

    if (!toolSlug) {
      return NextResponse.json({ error: "Missing toolSlug parameter" }, { status: 400 });
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userId = user ? user.id : null;

    // 1. Increment rate limit counter in database
    await incrementRateLimit(userId, ipAddress, toolSlug);

    // 2. Insert trace record into usage_logs table using admin client (bypasses RLS blocks)
    const supabaseAdmin = await createAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json({ status: "logged-without-db" });
    }
    await supabaseAdmin.from("usage_logs").insert({
      user_id: userId,
      ip_address: ipAddress,
      tool_slug: toolSlug,
      file_size_bytes: fileSize || null,
      status,
    });

    return NextResponse.json({ status: "logged" });
  } catch (e: any) {
    console.error("Log usage error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to log usage entry" },
      { status: 500 }
    );
  }
}
