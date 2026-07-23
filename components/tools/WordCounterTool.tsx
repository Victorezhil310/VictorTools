"use client";

import React, { useState } from "react";
import { Copy, Trash2, Check, FileText, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Statistics calculations
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;
  
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];
  const sentenceCount = sentences.length;
  
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0) : [];
  const paragraphCount = paragraphs.length;

  const readingTime = Math.ceil(wordCount / 200); // Average 200 WPM

  // Word Density calculation
  const getWordDensity = () => {
    if (words.length === 0) return [];
    const counts: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      if (clean && clean.length > 2) { // Only count words longer than 2 characters
        counts[clean] = (counts[clean] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 words
  };

  const wordDensity = getWordDensity();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="relative">
        <textarea
          rows={10}
          placeholder="Paste or type your text here to analyze..."
          className="w-full rounded-xl border border-border bg-muted/20 p-4 text-sm outline-none focus:border-primary focus:bg-background transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {text && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-card border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => setText("")}
                className="flex items-center gap-1 rounded-lg bg-card border border-border px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Words</span>
          <p className="text-2xl font-black text-foreground">{wordCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Characters</span>
          <p className="text-2xl font-black text-foreground">{charCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Sentences</span>
          <p className="text-2xl font-black text-foreground">{sentenceCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Paragraphs</span>
          <p className="text-2xl font-black text-foreground">{paragraphCount}</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold border-b border-border pb-2">
            <FileText className="h-4.5 w-4.5 text-primary" /> Analysis Details
          </div>
          <ul className="text-xs space-y-2">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Characters (no spaces)</span>
              <span className="font-bold text-foreground">{charNoSpaces}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Average Reading Time</span>
              <span className="font-bold text-foreground">{readingTime} min</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold border-b border-border pb-2">
            <Activity className="h-4.5 w-4.5 text-emerald-500" /> Word Density (Keywords)
          </div>
          {wordDensity.length > 0 ? (
            <ul className="text-xs space-y-2">
              {wordDensity.map(([word, count]) => {
                const percentage = ((count / words.length) * 100).toFixed(1);
                return (
                  <li key={word} className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium capitalize">{word}</span>
                    <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded-full">
                      {count} ({percentage}%)
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground py-2">
              Start typing to view word density analytics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
