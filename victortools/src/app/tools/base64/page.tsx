"use client";

import { useState, useCallback } from "react";
import { Check, Copy, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const process = useCallback(() => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (e) {
      toast.error(mode === "decode" ? "Invalid Base64 string" : "Encoding failed");
    }
  }, [input, mode]);

  const swap = useCallback(() => {
    setInput(output);
    setOutput("");
  }, [output]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }, [output]);

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 strings back to text."
      category="text"
    >
      <div className="space-y-4">
        <Tabs value={mode} onValueChange={(v) => v && setMode(v as typeof mode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {mode === "encode" ? "Plain Text" : "Base64 String"}
          </label>
          <Textarea
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={process} disabled={!input}>
            {mode === "encode" ? "Encode" : "Decode"}
          </Button>
          <Button onClick={swap} variant="outline" disabled={!output}>
            <ArrowDownUp className="h-4 w-4 mr-1" />
            Swap
          </Button>
        </div>

        {output && (
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Result</label>
              <Button onClick={copy} size="sm" variant="ghost">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea readOnly value={output} rows={6} className="font-mono text-sm" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
