"use client";

import { useState, useCallback, useMemo } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ToolLayout } from "@/components/tool-layout";
import { toast } from "react-hot-toast";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback((): string => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) return "";

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const password = Array.from(array, (x) => chars[x % chars.length]).join("");
    return password;
  }, [length, uppercase, lowercase, numbers, symbols]);

  const [password, setPassword] = useState(() => generate());

  const strength = useMemo(() => {
    let score = 0;
    if (length >= 8) score += 20;
    if (length >= 12) score += 20;
    if (length >= 16) score += 20;
    if (uppercase && lowercase) score += 15;
    if (numbers) score += 15;
    if (symbols) score += 10;
    return score;
  }, [length, uppercase, lowercase, numbers, symbols]);

  const strengthLabel = strength < 40 ? "Weak" : strength < 70 ? "Fair" : strength < 90 ? "Strong" : "Very Strong";
  const strengthColor = strength < 40 ? "bg-red-500" : strength < 70 ? "bg-yellow-500" : strength < 90 ? "bg-blue-500" : "bg-green-500";

  const refresh = useCallback(() => {
    const pw = generate();
    setPassword(pw);
    setHistory((prev) => [pw, ...prev].slice(0, 10));
  }, [generate]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Password copied!");
  }, [password]);

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate secure random passwords with customizable options."
      category="text"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Generated Password</Label>
            <span className="text-xs text-muted-foreground">{length} characters</span>
          </div>
          <div className="flex gap-2">
            <Input readOnly value={password} className="font-mono text-lg" />
            <Button onClick={copy} size="icon" variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button onClick={refresh} size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Strength: {strengthLabel}</span>
            </div>
            <Progress value={strength} className={`h-2 [&>div]:${strengthColor}`} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label>Length: {length}</Label>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6</span>
              <span>64</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Uppercase (A-Z)", checked: uppercase, onChange: setUppercase },
              { label: "Lowercase (a-z)", checked: lowercase, onChange: setLowercase },
              { label: "Numbers (0-9)", checked: numbers, onChange: setNumbers },
              { label: "Symbols (!@#$)", checked: symbols, onChange: setSymbols },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.onChange(e.target.checked)}
                  className="rounded"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div>
            <Label className="text-muted-foreground text-xs">Recent Passwords</Label>
            <div className="mt-2 space-y-1">
              {history.map((pw, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-muted/50 px-3 py-1.5 font-mono text-xs">
                  <span className="truncate flex-1">{pw}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pw);
                      toast.success("Copied!");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
