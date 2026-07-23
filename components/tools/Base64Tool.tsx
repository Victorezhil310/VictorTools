"use client";

import React, { useState } from "react";
import { Copy, Trash2, Check, ArrowRightLeft } from "lucide-react";

export default function Base64Tool() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    
    try {
      if (activeTab === "encode") {
        // UTF-8 friendly encoding
        const b64 = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        setOutput(b64);
      } else {
        // UTF-8 friendly decoding
        const decoded = decodeURIComponent(atob(input).split("").map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        setOutput(decoded);
      }
    } catch (e: any) {
      setError(e.message || "Invalid input for encoding/decoding. Check your character sets.");
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Selector Tabs */}
      <div className="flex border-b border-border/40 pb-4 justify-between items-center">
        <div className="flex bg-muted/40 rounded-xl p-1 gap-1">
          <button
            onClick={() => {
              setActiveTab("encode");
              clearAll();
            }}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "encode" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Encode Text
          </button>
          <button
            onClick={() => {
              setActiveTab("decode");
              clearAll();
            }}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "decode" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Decode Base64
          </button>
        </div>

        <button
          onClick={clearAll}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-all"
        >
          <Trash2 className="h-4 w-4" /> Clear All
        </button>
      </div>

      {/* Editor grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            {activeTab === "encode" ? "Source Text" : "Base64 String"}
          </label>
          <textarea
            rows={10}
            placeholder={
              activeTab === "encode" 
                ? "Enter the plain text you want to encode..." 
                : "Enter the base64 string you want to decode..."
            }
            className="w-full rounded-xl border border-border bg-muted/20 p-4 text-sm font-mono outline-none focus:border-primary focus:bg-background transition-all"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
          />
        </div>

        {/* Output box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              {activeTab === "encode" ? "Base64 Output" : "Plain Text Output"}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Output"}
              </button>
            )}
          </div>
          <textarea
            rows={10}
            readOnly
            placeholder={activeTab === "encode" ? "Base64 encoding output..." : "Plain text decoded output..."}
            className="w-full rounded-xl border border-border bg-muted/30 p-4 text-sm font-mono outline-none select-all"
            value={output}
          />
        </div>

      </div>

      {/* Action button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleProcess}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all w-full sm:w-auto"
        >
          <ArrowRightLeft className="h-4.5 w-4.5" /> 
          {activeTab === "encode" ? "Encode Source Text" : "Decode Base64 Output"}
        </button>

        {error && (
          <p className="text-xs font-semibold text-destructive">
            {error}
          </p>
        )}
      </div>

    </div>
  );
}
