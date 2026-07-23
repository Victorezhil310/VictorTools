"use client";

import Link from "next/link";
import { useState } from "react";
import {
  QrCode, FileText, Image, Code, Search, ArrowRight, Zap, Shield, Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, TOOL_CATEGORIES, TOOLS } from "@/lib/constants";

const categoryIcons = {
  qr: QrCode,
  pdf: FileText,
  image: Image,
  text: Code,
};

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Most tools run directly in your browser — no upload wait times." },
  { icon: Shield, title: "Privacy First", desc: "Your files never leave your device. Processing happens locally." },
  { icon: Globe, title: "No Sign-up Required", desc: "Use all basic tools instantly. Create an account for Pro features." },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    : TOOLS;

  const grouped = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: filtered.filter((t) => t.category === cat.id),
  })).filter((g) => g.tools.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Free &amp; Open — No Ads
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your All-in-One
            <br />
            <span className="text-brand">Online Toolbox</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            QR codes, PDF editing, image compression, and developer utilities — fast, free, and
            privacy-first. Your files never leave your browser.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border bg-background pl-10 pr-4 text-base shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {search ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Search results for &ldquo;{search}&rdquo;
            </h2>
            <p className="mt-1 text-muted-foreground">
              {filtered.length} tool{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        ) : null}

        {!search &&
          grouped.map((group) => {
            const Icon = categoryIcons[group.id as keyof typeof categoryIcons];
            return (
              <div key={group.id} className="mb-12">
                <div className="mb-6 flex items-center gap-2">
                  <Icon className="h-6 w-6 text-brand" />
                  <h2 className="text-2xl font-bold">{group.name}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.tools.map((tool) => (
                    <Link key={tool.id} href={tool.href}>
                      <Card className="group h-full transition-all hover:border-brand/50 hover:shadow-md hover:shadow-brand/5">
                        <CardContent className="flex items-start justify-between p-5">
                          <div>
                            <h3 className="font-semibold group-hover:text-brand transition-colors">
                              {tool.name}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {tool.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

        {search && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">
              No tools found matching &ldquo;{search}&rdquo;
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready for more?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Upgrade to {APP_NAME} Pro for unlimited usage, batch processing, no watermarks, and
            priority queue.
          </p>
          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center rounded-lg bg-brand px-6 text-sm font-medium text-brand-foreground transition-colors hover:opacity-90"
            >
              View Pro Plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
