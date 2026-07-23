"use client";

import React, { useState } from "react";
import { Copy, Trash2, Check, Braces, Code, AlertCircle } from "lucide-react";

export default function JSONFormatterTool() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = (spaces = 2) => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, spaces);
      setJsonInput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax");
    }
  };

  const minifyJSON = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax");
    }
  };

  const validateJSON = () => {
    if (!jsonInput.trim()) {
      setError(null);
      return;
    }
    try {
      JSON.parse(jsonInput);
      setError(null);
      alert("Valid JSON structure! No syntax issues found.");
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax");
    }
  };

  const handleCopy = () => {
    if (!jsonInput) return;
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setJsonInput("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => formatJSON(2)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/95 transition-all"
          >
            <Braces className="h-4 w-4" /> Format (2 Spaces)
          </button>
          <button
            onClick={() => formatJSON(4)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            <Braces className="h-4 w-4" /> Format (4 Spaces)
          </button>
          <button
            onClick={minifyJSON}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            <Code className="h-4 w-4" /> Minify
          </button>
          <button
            onClick={validateJSON}
            className="rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            Validate JSON
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!jsonInput}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-50 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={clearAll}
            disabled={!jsonInput}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-all"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {/* Editor & output */}
      <div className="relative">
        <textarea
          rows={14}
          placeholder='Enter your JSON string here (e.g. {"name": "VictorTools", "active": true})...'
          className="w-full rounded-xl border border-border bg-muted/20 p-4 font-mono text-xs outline-none focus:border-primary focus:bg-background transition-all"
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            if (error) setError(null);
          }}
        />

        {/* Error panel */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Parsing Error:</span> {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
