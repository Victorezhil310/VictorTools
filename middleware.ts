import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, apply next-intl routing
  const intlResponse = intlMiddleware(request);

  // Then, apply Supabase auth and pass the intl response
  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/`, `/en`, `/es` etc.
    '/',
    '/(en|es)/:path*'
  ]
};
