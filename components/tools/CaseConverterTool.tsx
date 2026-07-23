"use client";

import React, { useState } from "react";
import { Copy, Trash2, Check, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CaseConverterTool() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const convertCase = (type: string) => {
    if (!text) return;

    let newText = text;
    switch (type) {
      case "upper":
        newText = text.toUpperCase();
        break;
      case "lower":
        newText = text.toLowerCase();
        break;
      case "title":
        newText = text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case "camel":
        newText = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "");
        break;
      case "pascal":
        newText = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
            return word.toUpperCase();
          })
          .replace(/\s+/g, "");
        break;
      case "snake":
        newText = text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join("_");
        break;
      case "kebab":
        newText = text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join("-");
        break;
      case "alternating":
        newText = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      default:
        break;
    }
    setText(newText);
  };

  const actions = [
    { label: "UPPERCASE", type: "upper" },
    { label: "lowercase", type: "lower" },
    { label: "Title Case", type: "title" },
    { label: "camelCase", type: "camel" },
    { label: "PascalCase", type: "pascal" },
    { label: "snake_case", type: "snake" },
    { label: "kebab-case", type: "kebab" },
    { label: "aLtErNaTiNg", type: "alternating" },
  ];

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="relative">
        <textarea
          rows={12}
          placeholder="Type or paste your text here to convert its case..."
          className="w-full rounded-xl border border-border bg-muted/20 p-4 text-sm outline-none focus:border-primary focus:bg-background transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {text && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-card border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => setText("")}
                className="flex items-center gap-1 rounded-lg bg-card border border-border px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-all shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold mb-4 text-muted-foreground">
          <ArrowDownUp className="h-4.5 w-4.5 text-primary" /> Select Conversion Type
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map(({ label, type }) => (
            <button
              key={type}
              onClick={() => convertCase(type)}
              disabled={!text}
              className="flex items-center justify-center rounded-xl border border-border bg-muted/30 py-2.5 px-2 text-xs font-bold text-foreground hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:hover:bg-muted/30 disabled:hover:text-foreground disabled:hover:border-border transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
