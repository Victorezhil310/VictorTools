import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function isSupabaseConfigured(url?: string, key?: string) {
  return Boolean(url && key && !url.includes("placeholder") && !key.includes("placeholder"));
}

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isSupabaseConfigured(supabaseUrl, supabaseAnonKey)) {
    return null as any;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          // Can be ignored if middleware handles session refreshes.
        }
      },
    },
  });
}

// Service role client bypasses RLS and can write to restricted tables (e.g., rate limits, profiles, usage logs).
// Never expose this client on the browser/client-side!
export async function createAdminClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !isSupabaseConfigured(supabaseUrl, serviceRoleKey)) {
    return null as any;
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          // Ignore if server component can't write cookies.
        }
      },
    },
  });
}

export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !isSupabaseConfigured(supabaseUrl, serviceRoleKey)) {
    return null as any;
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No-op for server-side webhook usage.
      },
    },
  });
}
