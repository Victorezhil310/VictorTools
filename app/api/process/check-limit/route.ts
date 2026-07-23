import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { toolSlug } = await req.json();

    if (!toolSlug) {
      return NextResponse.json({ error: "Missing toolSlug parameter" }, { status: 400 });
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userId = user ? user.id : null;

    const limitResult = await checkRateLimit(userId, ipAddress, toolSlug);

    return NextResponse.json(limitResult);
  } catch (e: any) {
    console.error("Check rate limit error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to check limits" },
      { status: 500 }
    );
  }
}
