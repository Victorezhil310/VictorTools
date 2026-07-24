/**
 * VictorTools - Production Worker Script (Cloudflare Workers / Vercel Edge / Service Worker)
 * UPI ID: arasu9629hf@okhdfcbank
 * Contact: arasu9629hf@gmail.com
 */

const CONFIG = {
  name: "VictorTools",
  domain: "victormedia.net",
  upiId: "arasu9629hf@okhdfcbank",
  contactEmail: "arasu9629hf@gmail.com",
  defaultLocale: "en",
  supportedLocales: ["en", "es"],
};

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: SECURITY_HEADERS,
      });
    }

    // API Endpoint: /api/pay or /api/donate (Generates direct UPI payment link)
    if (pathname === "/api/pay" || pathname === "/api/donate") {
      const amount = url.searchParams.get("amount") || "49";
      const currency = url.searchParams.get("currency") || "INR";
      
      const upiUrl = `upi://pay?pa=${CONFIG.upiId}&pn=VictorTools&am=${amount}&cu=${currency}&tn=VictorTools%20Support`;
      
      // If client requests JSON
      if (request.headers.get("accept")?.includes("application/json")) {
        return new Response(
          JSON.stringify({
            success: true,
            upiId: CONFIG.upiId,
            amount: parseFloat(amount),
            currency,
            upiUrl,
            payUrl: upiUrl,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...SECURITY_HEADERS,
            },
          }
        );
      }

      // Direct Redirect to UPI App
      return Response.redirect(upiUrl, 302);
    }

    // API Endpoint: /api/info or /api/contact
    if (pathname === "/api/info" || pathname === "/api/contact") {
      return new Response(
        JSON.stringify({
          name: CONFIG.name,
          domain: CONFIG.domain,
          contactEmail: CONFIG.contactEmail,
          upiId: CONFIG.upiId,
          status: "online",
          version: "1.0.0",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...SECURITY_HEADERS,
          },
        }
      );
    }

    // Health Check Endpoint
    if (pathname === "/api/health") {
      return new Response(
        JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }),
        {
          headers: {
            "Content-Type": "application/json",
            ...SECURITY_HEADERS,
          },
        }
      );
    }

    // Default fetch handler for static assets / origin
    try {
      const response = await fetch(request);
      const newHeaders = new Headers(response.headers);
      
      // Inject security headers into all responses
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response("VictorTools Worker Error: " + err.message, {
        status: 500,
        headers: SECURITY_HEADERS,
      });
    }
  },
};
