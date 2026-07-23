"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setMessage({ type: "error", text: errorParam });
    }
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage({ type: "error", text: "Authentication is unavailable because Supabase credentials are not configured." });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Registration successful! Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Authentication failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    if (!supabase) {
      setMessage({ type: "error", text: "Google sign-in is unavailable because Supabase credentials are not configured." });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Failed to initiate Google sign in" });
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />

      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border/80 bg-card p-8 shadow-sm">
        
        {/* Header brand details */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            {BRAND.name}
          </Link>
          <h2 className="text-xl font-bold text-foreground">
            {isSignUp ? "Create a free account" : "Sign in to your account"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Access pro features, processing history, and custom presets
          </p>
        </div>

        {message && (
          <div
            className={`rounded-xl border p-4 text-xs font-semibold leading-relaxed ${
              message.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="h-11 w-full rounded-xl border border-border bg-muted/20 pl-10 pr-4 text-sm font-semibold outline-none focus:border-primary focus:bg-background"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-border bg-muted/20 pl-10 pr-4 text-sm font-semibold outline-none focus:border-primary focus:bg-background"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary h-11 text-sm font-bold text-white shadow-md hover:bg-primary/95 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card h-11 text-sm font-bold text-foreground hover:bg-muted transition-all"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Toggle */}
        <div className="text-center pt-2 text-xs">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-primary hover:underline"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
}
