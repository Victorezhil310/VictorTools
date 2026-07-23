"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  User, 
  Sparkles, 
  History, 
  Settings, 
  ShieldCheck, 
  Calendar,
  FileCheck,
  CreditCard,
  LogOut,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

interface LogEntry {
  id: string;
  tool_slug: string;
  file_size_bytes: number | null;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Get current auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // 2. Get profile details
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // 3. Get usage logs
      const { data: logsData } = await supabase
        .from("usage_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (logsData) setLogs(logsData || []);

      setLoading(false);
    };

    fetchDashboardData();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const formatBytes = (bytes: number | null, decimals = 2) => {
    if (!bytes) return "N/A";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 text-sm font-semibold text-muted-foreground">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Welcome Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        {/* Decorative highlight */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl -z-10" />

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Account Dashboard</span>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">
            Welcome back, {profile?.full_name || user.email?.split("@")[0]}
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your credentials, subscription tiers, and audit history.
          </p>
        </div>

        <div className="flex gap-2">
          {profile?.plan === "pro" ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4.5 py-2.5 text-xs font-bold text-white shadow-md">
              <Sparkles className="h-4 w-4 fill-current" /> Pro Member
            </div>
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/95 transition-all"
            >
              Upgrade to Pro
            </Link>
          )}

          <button
            onClick={handleSignOut}
            className="flex items-center justify-center p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-destructive transition-all"
            title="Sign Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tier Details Card */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border pb-3">
            <CreditCard className="h-4.5 w-4.5 text-primary" /> Plan & Billing
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-muted/40 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Current Tier</span>
              <p className="text-lg font-black text-foreground capitalize">
                {profile?.plan || "Free"} Plan
              </p>
            </div>

            <ul className="text-xs space-y-2.5">
              <li className="flex justify-between items-center text-muted-foreground">
                <span>Verification State</span>
                <span className="flex items-center gap-1 font-bold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Active Session
                </span>
              </li>
              
              {profile?.plan === "pro" && (
                <li className="flex justify-between items-center text-muted-foreground">
                  <span>Expiration Date</span>
                  <span className="flex items-center gap-1 font-bold text-foreground">
                    <Calendar className="h-4 w-4" />
                    {profile.plan_expires_at 
                      ? new Date(profile.plan_expires_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* History table card */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <History className="h-4.5 w-4.5 text-emerald-500" /> Recent Processing History
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Last 10 Logs
            </span>
          </div>

          {logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="text-muted-foreground border-b border-border/40 pb-2">
                    <th className="pb-2 font-bold uppercase tracking-wider">Tool Used</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">File Size</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Date</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {logs.map((log) => (
                    <tr key={log.id} className="text-foreground/90 hover:bg-muted/10 transition-colors">
                      <td className="py-3.5 capitalize font-bold text-foreground">
                        {log.tool_slug.replace("-", " ")}
                      </td>
                      <td className="py-3.5 font-medium text-muted-foreground">
                        {formatBytes(log.file_size_bytes)}
                      </td>
                      <td className="py-3.5 font-medium text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <FileCheck className="h-10 w-10 text-muted-foreground/50 mx-auto" />
              <p className="text-xs text-muted-foreground font-semibold">
                You haven't processed any files yet.
              </p>
              <Link href="/" className="text-xs font-bold text-primary hover:underline block">
                Go to tools library <ChevronRight className="h-3.5 w-3.5 inline" />
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

function LoaderComponent() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>Loading dashboard settings...</span>
    </div>
  );
}
