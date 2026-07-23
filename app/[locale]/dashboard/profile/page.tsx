"use client";

import React from "react";
import { User, Mail, CreditCard, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-foreground">Your Profile</h1>
        <p className="text-sm text-muted-foreground font-medium">Manage your personal information and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-background shadow-md flex items-center justify-center text-primary">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">User Name</h2>
              <p className="text-xs font-semibold text-muted-foreground">Pro Member</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4 px-6 flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">Contact Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-2">
                  <input type="email" disabled value="user@example.com" className="h-10 w-full rounded-lg border border-border bg-muted/30 px-3 text-sm text-muted-foreground outline-none" />
                  <button className="h-10 px-4 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">Edit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4 px-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">Security</h3>
            </div>
            <div className="p-6 space-y-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-foreground">Password</h4>
                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <button className="h-10 px-4 rounded-lg border border-border bg-card text-foreground text-xs font-bold hover:bg-muted transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
