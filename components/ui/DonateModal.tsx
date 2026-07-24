"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Heart, Copy, Check, Sparkles, QrCode, CreditCard, ShieldCheck, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Currency = "INR" | "USD" | "EUR" | "GBP";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const PRESET_AMOUNTS: Record<Currency, number[]> = {
  INR: [49, 99, 199, 499, 999],
  USD: [1, 5, 10, 25, 50],
  EUR: [1, 5, 10, 25, 50],
  GBP: [1, 5, 10, 25, 50],
};

const MIN_AMOUNTS: Record<Currency, number> = {
  INR: 49,
  USD: 1,
  EUR: 1,
  GBP: 1,
};

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [amount, setAmount] = useState<number>(49);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [upiId] = useState("arasu9629hf@okhdfcbank");
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<any>(null);

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const isMinimumValid = activeAmount >= (MIN_AMOUNTS[currency] || 1);

  // Generates Payment URI / URL
  const getPaymentPayload = () => {
    if (currency === "INR") {
      const formattedAmount = Math.max(activeAmount, 49);
      return `upi://pay?pa=${upiId}&pn=VictorTools&am=${formattedAmount}&cu=INR&tn=Support%20VictorTools`;
    }
    // Generic donation link or payload for USD/EUR/GBP
    return `https://victormedia.net/donate?amount=${activeAmount}&currency=${currency}`;
  };

  const handleLaunchPay = () => {
    const payload = getPaymentPayload();
    window.location.href = payload;
  };

  // Render QR Code
  useEffect(() => {
    if (!isOpen || typeof window === "undefined" || !qrRef.current) return;

    qrRef.current.innerHTML = "";
    const payload = getPaymentPayload();

    try {
      const QRCodeStyling = require("qr-code-styling");
      qrInstance.current = new QRCodeStyling({
        width: 210,
        height: 210,
        type: "svg",
        data: payload,
        dotsOptions: {
          color: "#4f46e5",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#312e81",
        },
      });
      qrInstance.current.append(qrRef.current);
    } catch (err) {
      console.error("Failed to render QR Code in modal:", err);
    }
  }, [isOpen, currency, activeAmount, upiId]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/80 bg-card p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-border/50 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 shadow-inner">
            <Heart className="h-6 w-6 fill-pink-500/20" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
              Support VictorTools <Sparkles className="h-4 w-4 text-amber-500" />
            </h2>
            <p className="text-xs text-muted-foreground">Keep our free privacy tools fast & ad-light.</p>
          </div>
        </div>

        {/* Currency & Amount Selection */}
        <div className="space-y-4 pt-4">
          {/* Currency Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Currency</span>
            <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
              {(["INR", "USD", "EUR", "GBP"] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    setAmount(PRESET_AMOUNTS[curr][0]);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-bold transition-all",
                    currency === curr ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {curr} ({CURRENCY_SYMBOLS[curr]})
                </button>
              ))}
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Amount (Min {CURRENCY_SYMBOLS[currency]}{MIN_AMOUNTS[currency]})
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_AMOUNTS[currency].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-xl border py-2.5 text-xs font-bold transition-all",
                    amount === val && !customAmount
                      ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary"
                      : "border-border bg-muted/20 text-foreground hover:border-border/80 hover:bg-muted/50"
                  )}
                >
                  {CURRENCY_SYMBOLS[currency]}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Or Enter Custom Amount (Unlimited)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-bold text-muted-foreground">{CURRENCY_SYMBOLS[currency]}</span>
              <input
                type="number"
                min={MIN_AMOUNTS[currency]}
                placeholder={`Min ${MIN_AMOUNTS[currency]}`}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(0);
                }}
                className="h-10 w-full rounded-xl border border-border bg-muted/20 pl-8 pr-3 text-sm font-bold text-foreground outline-none focus:border-primary focus:bg-background transition-all"
              />
            </div>
            {!isMinimumValid && (
              <p className="text-[11px] font-semibold text-destructive">
                Minimum donation for {currency} is {CURRENCY_SYMBOLS[currency]}{MIN_AMOUNTS[currency]}.
              </p>
            )}
          </div>

          {/* Direct Pay Action Button */}
          <button
            onClick={handleLaunchPay}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 hover:opacity-95 active:scale-98 transition-all"
          >
            <CreditCard className="h-4 w-4" /> Tap to Open GPay / PhonePe / Paytm ({CURRENCY_SYMBOLS[currency]}{activeAmount})
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <QrCode className="h-4 w-4 text-primary" /> Scan or Tap QR Code ({CURRENCY_SYMBOLS[currency]}{activeAmount})
            </div>

            {/* Clickable QR Render Canvas */}
            <div 
              onClick={handleLaunchPay}
              title="Tap to open payment app directly"
              className="rounded-xl border border-border bg-white p-3 shadow-md flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all group"
            >
              <div ref={qrRef} className="h-[210px] w-[210px] flex items-center justify-center" />
              <span className="text-[11px] font-bold text-primary mt-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Tap QR to open GPay / PhonePe
              </span>
            </div>

            {/* UPI ID copy field */}
            {currency === "INR" && (
              <div className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card p-2 px-3">
                <div className="text-xs font-mono font-medium text-muted-foreground truncate">
                  UPI: <span className="font-bold text-foreground">{upiId}</span>
                </div>
                <button
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition-colors shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>

          {/* Security guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Secure & Direct Instant Transfer
          </div>
        </div>
      </div>
    </div>
  );
}
