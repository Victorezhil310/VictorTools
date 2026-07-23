"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QrCode, FileText, Image, Code, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/constants";
import { Suspense } from "react";

const categoryIcons = {
  qr: QrCode,
  pdf: FileText,
  image: Image,
  text: Code,
};

function ToolsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const filteredTools = category
    ? TOOLS.filter((t) => t.category === category)
    : TOOLS;

  const grouped = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: filteredTools.filter((t) => t.category === cat.id),
  })).filter((g) => g.tools.length > 0);

  const activeCategory = TOOL_CATEGORIES.find((c) => c.id === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {activeCategory ? activeCategory.name : "All Tools"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {activeCategory
            ? activeCategory.description
            : "Browse our complete collection of free online tools."}
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/tools"
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !category
              ? "bg-brand text-brand-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All Tools
        </Link>
        {TOOL_CATEGORIES.map((cat) => {
          const Icon = categoryIcons[cat.id as keyof typeof categoryIcons];
          return (
            <Link
              key={cat.id}
              href={`/tools?category=${cat.id}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === cat.id
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Tool grid */}
      {grouped.map((group) => {
        const Icon = categoryIcons[group.id as keyof typeof categoryIcons];
        return (
          <div key={group.id} className="mb-12">
            {!category && (
              <div className="mb-6 flex items-center gap-2">
                <Icon className="h-6 w-6 text-brand" />
                <h2 className="text-2xl font-bold">{group.name}</h2>
                <Badge variant="secondary">{group.tools.length}</Badge>
              </div>
            )}
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
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">Loading...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
