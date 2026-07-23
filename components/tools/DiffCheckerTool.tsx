"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightLeft, FileDiff, Trash2, Check } from "lucide-react";
import { diffWordsWithSpace, diffLines, Change } from "diff";
import { cn } from "@/lib/utils";

export default function DiffCheckerTool() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [diffMode, setDiffMode] = useState<"words" | "lines">("words");

  useEffect(() => {
    if (!originalText && !modifiedText) {
      setDiffResult([]);
      return;
    }

    const computeDiff = () => {
      try {
        if (diffMode === "words") {
          setDiffResult(diffWordsWithSpace(originalText, modifiedText));
        } else {
          setDiffResult(diffLines(originalText, modifiedText));
        }
      } catch (e) {
        console.error("Diff computation failed", e);
      }
    };

    const timer = setTimeout(computeDiff, 300);
    return () => clearTimeout(timer);
  }, [originalText, modifiedText, diffMode]);

  return (
    <div className="space-y-6">
      {/* Input Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
            Original Text
            <button 
              onClick={() => setOriginalText("")}
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </label>
          <textarea
            rows={10}
            placeholder="Paste your original text here..."
            className="w-full rounded-xl border border-border bg-muted/20 p-4 text-sm outline-none focus:border-primary focus:bg-background transition-all font-mono"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
            Modified Text
            <button 
              onClick={() => setModifiedText("")}
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </label>
          <textarea
            rows={10}
            placeholder="Paste your modified text here..."
            className="w-full rounded-xl border border-border bg-muted/20 p-4 text-sm outline-none focus:border-primary focus:bg-background transition-all font-mono"
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-y border-border py-4">
        <div className="flex gap-2 bg-muted/40 p-1 rounded-xl">
          <button
            onClick={() => setDiffMode("words")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              diffMode === "words" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Word Diff
          </button>
          <button
            onClick={() => setDiffMode("lines")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              diffMode === "lines" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Line Diff
          </button>
        </div>

        <div className="text-xs font-semibold text-muted-foreground flex gap-4">
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-destructive/20 border border-destructive/50"></div> Removed</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/50"></div> Added</span>
        </div>
      </div>

      {/* Result Display */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FileDiff className="h-4 w-4" /> Difference Output
        </label>
        <div className="min-h-[200px] w-full rounded-xl border border-border bg-card p-4 text-sm font-mono whitespace-pre-wrap shadow-sm">
          {diffResult.length > 0 ? (
            diffResult.map((part, index) => (
              <span
                key={index}
                className={cn(
                  part.added ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium px-0.5 rounded-sm" :
                  part.removed ? "bg-destructive/20 text-destructive font-medium px-0.5 rounded-sm line-through opacity-70" :
                  "text-foreground/80"
                )}
              >
                {part.value}
              </span>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground py-12">
              Enter text in both fields to see the differences
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
