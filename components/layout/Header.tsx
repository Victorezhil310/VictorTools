"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { BRAND, TOOLS, CATEGORIES } from "@/lib/constants"; // Note: BRAND is in constants, but TOOLS and CATEGORIES are in tools-registry
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Let's import tools-registry properly
import { TOOLS as registryTools, CATEGORIES as registryCategories } from "@/lib/tools-registry";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    // Check current auth status
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Get profile info
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) setProfile(data);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (data) setProfile(data);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Find the first tool matching query or redirect to search results
      const query = searchQuery.toLowerCase().trim();
      const match = registryTools.find(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
      if (match) {
        router.push(`/tools/${match.slug}`);
      }
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Categories Dropdown */}
          <div className="relative hidden md:block">
            <button 
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
            >
              Tools
              <ChevronDown className="h-4 w-4" />
            </button>

            {toolsDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setToolsDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 z-20 w-[480px] origin-top-left rounded-xl border border-border bg-card p-4 shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(registryCategories).map(([key, cat]) => (
                      <div key={key} className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {cat.name}
                        </h4>
                        <ul className="space-y-1">
                          {registryTools
                            .filter(t => t.category === key)
                            .slice(0, 4) // Show top 4
                            .map(tool => (
                              <li key={tool.slug}>
                                <Link 
                                  href={`/tools/${tool.slug}`}
                                  className="block rounded-lg px-2 py-1 text-sm text-foreground transition-colors hover:bg-muted"
                                  onClick={() => setToolsDropdownOpen(false)}
                                >
                                  {tool.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search bar, theme switcher, and auth */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="h-9 w-40 sm:w-60 rounded-full border border-border bg-muted/50 px-4 py-1 text-sm outline-none focus:border-primary focus:bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button" 
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-muted/30 p-1 pr-3 hover:bg-muted/50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden text-sm font-medium sm:block">
                  {profile?.plan === "pro" ? (
                    <span className="flex items-center gap-1 text-primary">
                      Pro <Sparkles className="h-3 w-3 fill-current" />
                    </span>
                  ) : "Free"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 z-20 w-48 origin-top-right rounded-xl border border-border bg-card p-1 shadow-lg">
                    <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border/50">
                      Logged in as <br/>
                      <span className="font-semibold text-foreground">{user.email}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Link 
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Link 
                href="/pricing"
                className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/95"
              >
                Go Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <div className="space-y-1 px-4 pb-6 pt-4">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</h3>
            {Object.entries(registryCategories).map(([key, cat]) => (
              <div key={key} className="space-y-1 py-2">
                <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-muted-foreground">
                  {cat.name}
                </div>
                <div className="grid grid-cols-2 gap-2 pl-6">
                  {registryTools
                    .filter(t => t.category === key)
                    .map(tool => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="block rounded-lg py-1.5 text-sm text-foreground hover:bg-muted"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {tool.name}
                      </Link>
                    ))}
                </div>
              </div>
            ))}

            <div className="border-t border-border/50 pt-4 mt-4 space-y-2">
              {!user && (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/pricing"
                    className="block w-full text-center rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/95"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go Pro
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
