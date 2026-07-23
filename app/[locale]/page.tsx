"use client";

import React, { useState } from "react";
import { TOOLS, CATEGORIES, Tool } from "@/lib/tools-registry";
import ToolCard from "@/components/ui/ToolCard";
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(tool.description.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative isolate overflow-hidden min-h-screen py-16 sm:py-24">
      {/* Dynamic background highlights */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl opacity-50 dark:opacity-30" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl opacity-50 dark:opacity-20" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3 fill-current" /> Fast · Private · Ad-Light
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Universal Web Utilities. <br/>
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Speed & Privacy Combined.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Fast, client-side tools to merge PDFs, generate custom QR codes, convert image formats, and format JSON. Files never leave your browser.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="max-w-xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/85" />
            <input
              type="text"
              placeholder="Search from 20+ utilities..."
              className="h-12 w-full rounded-2xl border border-border bg-card/60 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs & Content Grid */}
        <div className="space-y-8">
          
          {/* Category Tabs */}
          <div className="flex items-center justify-center border-b border-border/40 pb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all",
                  activeCategory === "all"
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                All Tools
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs sm:text-sm font-bold tracking-wide transition-all",
                    activeCategory === key
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <p className="text-base text-muted-foreground font-semibold">
                No tools match your query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-sm font-bold text-primary hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
