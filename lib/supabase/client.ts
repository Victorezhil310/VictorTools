import { createBrowserClient } from "@supabase/ssr";

function isSupabaseConfigured(url?: string, key?: string) {
  return Boolean(url && key && !url.includes("placeholder") && !key.includes("placeholder"));
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isSupabaseConfigured(supabaseUrl, supabaseAnonKey)) {
    return null as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
