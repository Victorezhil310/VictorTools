"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PRICING, BRAND } from "@/lib/constants";
import { Check, Loader2, Sparkles, Shield, CreditCard, ExternalLink, Gift, Share2 } from "lucide-react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Load Razorpay Checkout Script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    checkSession();

    return () => {
      document.body.removeChild(script);
    };
  }, [supabase]);

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoading(true);

    try {
      if (currency === "INR") {
        // --- RAZORPAY PAYMENT WORKFLOW ---
        const response = await fetch("/api/payments/razorpay/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to create Razorpay subscription session");
        }

        const data = await response.json();

        // Trigger Razorpay Checkout Modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
          subscription_id: data.subscriptionId,
          name: BRAND.name,
          description: "Monthly Pro Subscription",
          handler: async function (checkoutResponse: any) {
            // Verify payment on callback
            alert("Checkout complete in test mode! We are updating your profile via backend webhook events.");
            router.push("/dashboard");
            router.refresh();
          },
          prefill: {
            email: user.email,
          },
          theme: {
            color: BRAND.accentColor,
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // --- STRIPE PAYMENT WORKFLOW ---
        const response = await fetch("/api/payments/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to create Stripe Checkout session");
        }

        const data = await response.json();
        // Redirect to Stripe Hosted Checkout
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("Stripe Redirect URL was not provided");
        }
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "An error occurred while creating subscription session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow py-16 sm:py-24 relative overflow-hidden flex flex-col justify-center">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl opacity-50 dark:opacity-30" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Pricing Plans</span>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground">
            Simple, Transparent Pricing.
          </h1>
          <p className="text-sm text-muted-foreground">
            Get unlimited access to high-fidelity conversions and browser-side speed optimization. Cancel anytime.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Support & Growth</p>
              <h2 className="text-xl font-bold text-foreground">Donate, share, or subscribe for an ad-free experience.</h2>
              <p className="text-sm text-muted-foreground">Use the UPI address arasu9629hf@okhdfcbank for donations, share your referral code, or upgrade to Pro for the best experience.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigator.clipboard.writeText("arasu9629hf@okhdfcbank")} 
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
              >
                <Gift className="h-4 w-4" /> Copy Donation UPI
              </button>
              <button
                onClick={() => navigator.clipboard.writeText("ARASU10")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
              >
                <Share2 className="h-4 w-4" /> Copy Referral Code
              </button>
            </div>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex justify-center">
          <div className="flex bg-muted/40 rounded-xl p-1 gap-1 border border-border/50">
            <button
              onClick={() => setCurrency("INR")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                currency === "INR" ? "bg-primary text-white" : "text-muted-foreground"
              }`}
            >
              INR (UPI/Domestic Cards)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                currency === "USD" ? "bg-primary text-white" : "text-muted-foreground"
              }`}
            >
              USD (International Cards)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-8 relative">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Free Tier</span>
                <p className="text-3xl font-black text-foreground">Free</p>
                <p className="text-xs text-muted-foreground">For simple, daily processing needs.</p>
              </div>

              <ul className="text-xs space-y-3.5">
                <li className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Check className="h-4.5 w-4.5 text-primary" /> Daily caps: 5 tasks/day
                </li>
                <li className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Check className="h-4.5 w-4.5 text-primary" /> File Size Limits: Up to 10MB
                </li>
                <li className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Check className="h-4.5 w-4.5 text-primary" /> Small branding watermark on PDFs
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full rounded-xl border border-border h-11 text-xs font-bold text-muted-foreground uppercase cursor-not-allowed"
            >
              Current Default Tier
            </button>
          </div>

          {/* Pro Subscription Card */}
          <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col justify-between space-y-8 relative shadow-lg dark:shadow-primary/5">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3 fill-current" /> Best Value
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Pro Tier</span>
                <p className="text-3xl font-black text-foreground">
                  {currency === "INR" 
                    ? `₹${PRICING.monthly.inr}` 
                    : `$${PRICING.monthly.usd}`}
                  <span className="text-xs font-normal text-muted-foreground">/month</span>
                </p>
                <p className="text-xs text-muted-foreground">For power users and document professionals.</p>
              </div>

              <ul className="text-xs space-y-3.5">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4.5 w-4.5 text-primary" /> Uncapped daily usage limits
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4.5 w-4.5 text-primary" /> High File Sizes: Up to 100MB
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4.5 w-4.5 text-primary" /> Watermarks fully removed
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4.5 w-4.5 text-primary" /> Priority queue conversions
                </li>
              </ul>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading || profile?.plan === "pro"}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary h-11 text-xs font-bold text-white shadow-md hover:bg-primary/95 disabled:opacity-50 transition-all uppercase tracking-wider"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : profile?.plan === "pro" ? (
                "You are Pro"
              ) : (
                "Upgrade to Pro"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
