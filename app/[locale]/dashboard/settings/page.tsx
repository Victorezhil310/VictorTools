"use client";

import React from "react";
import { Settings2, Palette, Globe, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.replace(`/${newLocale}/dashboard/settings`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
          <Settings2 className="h-8 w-8 text-primary" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground font-medium">Manage application preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4 px-6 flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">Appearance</h3>
          </div>
          <div className="p-6 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-foreground">Theme Preference</h4>
              <p className="text-xs text-muted-foreground">Choose your preferred visual style</p>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm font-semibold outline-none focus:border-primary"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4 px-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">Language & Region</h3>
          </div>
          <div className="p-6 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-foreground">Application Language</h4>
              <p className="text-xs text-muted-foreground">Select your preferred language</p>
            </div>
            <select 
              value={locale}
              onChange={handleLanguageChange}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm font-semibold outline-none focus:border-primary"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (ES)</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4 px-6 flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-foreground">Email Updates</h4>
                <p className="text-xs text-muted-foreground">Receive news and product updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
