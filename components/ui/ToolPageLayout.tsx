"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Tool, CATEGORIES } from "@/lib/tools-registry";
import { ArrowLeft, ShieldCheck, Clock, CheckCircle, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRateLimit } from "@/hooks/useRateLimit";

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const categoryMeta = CATEGORIES[tool.category];
  const { checkLimit, limitExceeded, limitDetails, checking } = useRateLimit(tool.slug);

  useEffect(() => {
    checkLimit();
  }, [tool.slug]);

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Back button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-muted-foreground/60">{categoryMeta?.name}</span>
            <span>/</span>
            <span className="text-foreground">{tool.name}</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Heading Section */}
        <div className="space-y-2 border-b border-border/40 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {tool.name}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {tool.description}
          </p>
        </div>

        {/* Tool Content Container */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm min-h-[300px] flex flex-col justify-center">
          {checking ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm font-semibold text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              Verifying conversion limit permissions...
            </div>
          ) : limitExceeded ? (
            /* Block Overlay */
            <div className="max-w-md mx-auto text-center py-8 space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mx-auto">
                <AlertTriangle className="h-7 w-7" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">Daily Limit Reached</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You have reached your daily free conversion limit ({limitDetails?.limit || 5} files/day) for <span className="font-semibold text-foreground">{tool.name}</span>.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs text-left space-y-3.5">
                <p className="font-bold text-foreground flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-primary fill-current" /> Why upgrade to VictorTools Pro?
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Unlimited daily conversions for all tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Higher file size caps up to 100MB
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> All output watermark branding removed
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/pricing"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all"
                >
                  Upgrade to Pro
                </Link>
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground hover:bg-muted transition-all"
                >
                  Sign In / Register
                </Link>
              </div>
            </div>
          ) : (
            /* Normal Tool View */
            children
          )}
        </div>

        {/* Informative / SEO section explaining privacy and workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="rounded-xl border border-border/50 bg-muted/10 p-5 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Secure Browser Processing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We process this tool inside your browser. No files are uploaded to our servers, ensuring absolute privacy.
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/10 p-5 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Instant Processing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Skip queue times. Browser execution completes operations locally in a matter of split seconds.
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/10 p-5 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Clean Outputs</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Export in high-fidelity formats. Free tier includes small watermark, Pro members enjoy unlimited clean exports.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
