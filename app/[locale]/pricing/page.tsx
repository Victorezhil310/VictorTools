"use client";

import React, { useState } from "react";
import { PRICING, BRAND } from "@/lib/constants";
import { Check, Sparkles, ShieldCheck, Heart, Zap, Award, Gift, Copy, Mail } from "lucide-react";
import DonateModal from "@/components/ui/DonateModal";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(49);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSelectPlan = (amountInr: number, amountUsd: number) => {
    const selectedAmount = currency === "INR" ? amountInr : amountUsd;
    setSelectedPlanAmount(selectedAmount);
    setDonateModalOpen(true);
  };

  const handleCopy = (text: string, setFn: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="flex-grow py-16 sm:py-24 relative overflow-hidden flex flex-col justify-center animate-in fade-in duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl opacity-50 dark:opacity-30" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl opacity-50 dark:opacity-20" />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5 fill-current text-amber-500" /> Instant Activation via UPI / Cards
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
            Simple, Transparent Subscription Plans.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Get unlimited access to high-speed file conversions, bulk processing, and zero-ad utility tools. Direct instant UPI payments to <span className="font-bold text-foreground font-mono">arasu9629hf@okhdfcbank</span>.
          </p>
        </div>

        {/* Support Banner & Quick UPI / Email copy */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Direct Contact & Support</span>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Need Help or Custom Enterprise Plan? <Mail className="h-4 w-4 text-primary" />
              </h2>
              <p className="text-xs text-muted-foreground">
                Email us at <a href="mailto:arasu9629hf@gmail.com" className="font-bold text-primary underline">arasu9629hf@gmail.com</a> or pay directly via UPI <span className="font-mono text-foreground font-bold">arasu9629hf@okhdfcbank</span>.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => handleCopy("arasu9629hf@okhdfcbank", setCopiedUpi)} 
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all"
              >
                <Gift className="h-3.5 w-3.5 text-pink-500" /> {copiedUpi ? "Copied UPI!" : "Copy UPI ID"}
              </button>
              <button
                onClick={() => handleCopy("arasu9629hf@gmail.com", setCopiedEmail)} 
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all"
              >
                <Mail className="h-3.5 w-3.5 text-primary" /> {copiedEmail ? "Copied Email!" : "Copy Contact Email"}
              </button>
            </div>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex justify-center">
          <div className="flex bg-muted/40 rounded-xl p-1 gap-1 border border-border/50">
            <button
              onClick={() => setCurrency("INR")}
              className={`rounded-lg px-5 py-2 text-xs font-bold transition-all ${
                currency === "INR" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              INR (UPI / GPay / PhonePe / Cards)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`rounded-lg px-5 py-2 text-xs font-bold transition-all ${
                currency === "USD" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              USD (International Payments)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (4 Plans) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Plan 1: Free Tier */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-6 relative shadow-sm hover:border-border/80 transition-all">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Free Tier</span>
                <p className="text-3xl font-black text-foreground">Free</p>
                <p className="text-xs text-muted-foreground">Standard daily processing</p>
              </div>

              <ul className="text-xs space-y-3 pt-2">
                <li className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> 5 Tasks / day
                </li>
                <li className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Up to 10MB Files
                </li>
                <li className="flex items-center gap-2 text-muted-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> All 20+ Basic Tools
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full rounded-xl border border-border h-11 text-xs font-bold text-muted-foreground uppercase cursor-not-allowed bg-muted/20"
            >
              Current Active Plan
            </button>
          </div>

          {/* Plan 2: Starter Plan */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-6 relative shadow-sm hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-current" /> Starter Plan
                </span>
                <p className="text-3xl font-black text-foreground">
                  {currency === "INR" ? `₹${PRICING.starter.inr}` : `$${PRICING.starter.usd}`}
                  <span className="text-xs font-normal text-muted-foreground">/month</span>
                </p>
                <p className="text-xs text-muted-foreground">For students & light creators</p>
              </div>

              <ul className="text-xs space-y-3 pt-2">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> 100 Tasks / day
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Up to 50MB Files
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Faster Conversion Speed
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> No Ad Watermarks
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(PRICING.starter.inr, PRICING.starter.usd)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-muted hover:bg-primary hover:text-white h-11 text-xs font-bold text-foreground shadow-sm transition-all uppercase tracking-wider"
            >
              Select Starter ({currency === "INR" ? `₹${PRICING.starter.inr}` : `$${PRICING.starter.usd}`})
            </button>
          </div>

          {/* Plan 3: Pro Plan (Featured) */}
          <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col justify-between space-y-6 relative shadow-xl dark:shadow-primary/10 scale-105 z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3 fill-current" /> Most Popular
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
                  <Award className="h-3 w-3 fill-current text-primary" /> Pro Plan
                </span>
                <p className="text-3xl font-black text-foreground">
                  {currency === "INR" ? `₹${PRICING.pro.inr}` : `$${PRICING.pro.usd}`}
                  <span className="text-xs font-normal text-muted-foreground">/month</span>
                </p>
                <p className="text-xs text-muted-foreground">For power users & professionals</p>
              </div>

              <ul className="text-xs space-y-3 pt-2">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Uncapped Daily Usage
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Up to 100MB File Sizes
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Maximum Speed Queue
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Premium PDF & Resume Builder
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(PRICING.pro.inr, PRICING.pro.usd)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary h-11 text-xs font-bold text-white shadow-md hover:bg-primary/95 transition-all uppercase tracking-wider"
            >
              Get Pro Now ({currency === "INR" ? `₹${PRICING.pro.inr}` : `$${PRICING.pro.usd}`})
            </button>
          </div>

          {/* Plan 4: Enterprise Plan */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-6 relative shadow-sm hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Enterprise Plan</span>
                <p className="text-3xl font-black text-foreground">
                  {currency === "INR" ? `₹${PRICING.enterprise.inr}` : `$${PRICING.enterprise.usd}`}
                  <span className="text-xs font-normal text-muted-foreground">/month</span>
                </p>
                <p className="text-xs text-muted-foreground">For teams & custom integrations</p>
              </div>

              <ul className="text-xs space-y-3 pt-2">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Unlimited Team Accounts
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Up to 500MB Large Files
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Dedicated Email Support
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Custom API Access
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(PRICING.enterprise.inr, PRICING.enterprise.usd)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-muted hover:bg-primary hover:text-white h-11 text-xs font-bold text-foreground shadow-sm transition-all uppercase tracking-wider"
            >
              Get Enterprise ({currency === "INR" ? `₹${PRICING.enterprise.inr}` : `$${PRICING.enterprise.usd}`})
            </button>
          </div>

        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-semibold pt-4">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Instant direct UPI transfer to <span className="font-mono text-foreground font-bold">arasu9629hf@okhdfcbank</span>. Contact <a href="mailto:arasu9629hf@gmail.com" className="text-primary underline font-bold">arasu9629hf@gmail.com</a> anytime.
        </div>

      </div>

      {/* Instant Payment Modal for Selected Plan */}
      <DonateModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
      />
    </div>
  );
}
