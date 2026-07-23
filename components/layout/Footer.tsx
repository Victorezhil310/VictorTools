import React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Shield, Clock, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-card py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Safe file banner */}
        <div className="mb-10 rounded-2xl border border-border/60 bg-muted/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Your privacy is our priority</h4>
              <p className="text-sm text-muted-foreground">All files are processed securely in your browser or deleted automatically within 1 hour.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full self-start md:self-auto">
            <Clock className="h-4 w-4" />
            1-Hour Auto-Delete Guarantee
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {BRAND.name}
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fast, private, and ad-light alternative to heavy utility platforms. Get work done in seconds right inside your browser.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tools/qr-generator" className="text-muted-foreground hover:text-foreground">QR suite</Link></li>
              <li><Link href="/tools/merge-pdf" className="text-muted-foreground hover:text-foreground">PDF suite</Link></li>
              <li><Link href="/tools/compress-image" className="text-muted-foreground hover:text-foreground">Image suite</Link></li>
              <li><Link href="/tools/json-formatter" className="text-muted-foreground hover:text-foreground">Dev utilities</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Pricing & Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing Plans</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Account Dashboard</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Support & Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@victormedia.net" className="text-muted-foreground hover:text-foreground">support@victormedia.net</a></li>
              <li className="text-xs text-muted-foreground mt-4 leading-normal">
                Owned & operated by {BRAND.company}.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            &copy; {currentYear} {BRAND.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-rose-500/80 text-rose-500/80" /> for the modern web.
          </div>
        </div>

      </div>
    </footer>
  );
}
