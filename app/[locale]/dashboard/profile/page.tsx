"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Save, Check, Sparkles, Building, Briefcase, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Victor Member");
  const [email, setEmail] = useState("victor@example.com");
  const [jobTitle, setJobTitle] = useState("Pro Developer / Designer");
  const [company, setCompany] = useState("Victor Tools User");
  const [bio, setBio] = useState("Utilizing high-speed web utility tools for daily workflow.");
  const [plan, setPlan] = useState("pro");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // Load profile from localStorage & Supabase
  useEffect(() => {
    const localData = localStorage.getItem("victor_user_profile");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.company) setCompany(parsed.company);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.plan) setPlan(parsed.plan);
      } catch (e) {
        console.error(e);
      }
    }

    if (supabase) {
      supabase.auth.getUser().then((res: any) => {
        if (res?.data?.user) {
          if (res.data.user.email) setEmail(res.data.user.email);
        }
      });
    }
  }, [supabase]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      fullName,
      email,
      jobTitle,
      company,
      bio,
      plan,
      updatedAt: new Date().toISOString(),
    };

    // Save locally so login is never lost
    localStorage.setItem("victor_user_profile", JSON.stringify(profileData));

    // Try saving to Supabase if authenticated
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });
      }
    }

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            User Profile <Sparkles className="h-6 w-6 text-amber-500 fill-amber-500/20" />
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Your persistent user profile is saved locally and synced automatically.
          </p>
        </div>
        
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-500 shadow-sm animate-in zoom-in duration-200">
            <Check className="h-4 w-4" /> Profile Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-indigo-600 border-4 border-background shadow-xl flex items-center justify-center text-white text-3xl font-black">
                {fullName ? fullName.charAt(0).toUpperCase() : "V"}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer">
                <Camera className="h-6 w-6" />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-foreground">{fullName || "User"}</h2>
              <p className="text-xs font-semibold text-primary flex items-center justify-center gap-1 mt-0.5">
                {plan === "pro" ? <><Sparkles className="h-3.5 w-3.5 fill-current" /> Pro Member</> : "Free Account"}
              </p>
            </div>

            <div className="w-full border-t border-border pt-4 text-xs space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="font-bold text-emerald-500">Active & Saved</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Sync:</span>
                <span className="font-bold text-foreground">Local + Cloud</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Fields */}
        <div className="md:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold border-b border-border pb-3 text-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Job Title / Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Developer / Student"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Victor Tools User"
                  className="h-11 w-full rounded-xl border border-border bg-muted/20 px-3.5 text-sm font-semibold outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Bio / Notes</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full rounded-xl border border-border bg-muted/20 p-3.5 text-sm font-medium outline-none focus:border-primary focus:bg-background transition-all"
              />
            </div>

            <div className="border-t border-border pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save Profile Details
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
