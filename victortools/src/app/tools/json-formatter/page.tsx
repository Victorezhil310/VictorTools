"use client";

import { useState, useCallback } from "react";
import { Check, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }, [output]);

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, minify, and beautify JSON data instantly."
      category="text"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Input JSON</label>
          <Textarea
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="font-mono text-sm min-h-[200px]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={format} disabled={!input}>
            Format
          </Button>
          <Button onClick={minify} disabled={!input} variant="outline">
            Minify
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-muted-foreground">Indent:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded-md border bg-background px-2 py-1 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
              <option value={"  "}>Tab</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Invalid JSON</p>
              <p className="mt-1 font-mono text-xs">{error}</p>
            </div>
          </div>
        )}

        {output && (
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Output</label>
              <Button onClick={copy} size="sm" variant="ghost">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea
              readOnly
              value={output}
              rows={10}
              className="font-mono text-sm min-h-[200px]"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
