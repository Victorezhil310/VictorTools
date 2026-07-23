"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, QrCode, FileText, Image, Code, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_NAME, TOOL_CATEGORIES, TOOLS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categoryIcons = {
  qr: QrCode,
  pdf: FileText,
  image: Image,
  text: Code,
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = searchQuery
    ? TOOLS.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            V
          </div>
          <span>{APP_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {TOOL_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id as keyof typeof categoryIcons];
            return (
              <Link
                key={cat.id}
                href={`/tools?category=${cat.id}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  pathname.includes(`/tools?category=${cat.id}`) && "bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-48 rounded-md border bg-muted/50 pl-8 pr-3 text-sm outline-none focus:w-64 transition-all focus:border-brand"
            />
            {searchQuery && filteredTools.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-md border bg-popover p-1 shadow-lg">
                {filteredTools.slice(0, 5).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={() => setSearchQuery("")}
                    className="block rounded-sm px-3 py-2 text-sm hover:bg-accent"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col gap-2 mt-8">
                {TOOL_CATEGORIES.map((cat) => {
                  const Icon = categoryIcons[cat.id as keyof typeof categoryIcons];
                  return (
                    <div key={cat.id}>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        {cat.name}
                      </div>
                      {TOOLS.filter((t) => t.category === cat.id).map((tool) => (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "block rounded-md px-6 py-2 text-sm transition-colors hover:bg-accent",
                            pathname === tool.href && "bg-accent font-medium"
                          )}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
