"use client";

import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Check, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function PasswordGeneratorTool() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  // Generate secure password
  const generatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charPool = "";
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (!charPool) {
      setPassword("Please select at least one option");
      return;
    }

    let result = "";
    const poolLength = charPool.length;
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
      result += charPool[randomArray[i] % poolLength];
    }

    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (!password || password.startsWith("Please")) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get password strength
  const getStrength = () => {
    if (!password || password.startsWith("Please")) return { score: 0, text: "N/A", color: "bg-muted" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    
    const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    score += varietyCount;

    if (score <= 3) return { score, text: "Weak", color: "bg-red-500" };
    if (score <= 5) return { score, text: "Medium", color: "bg-amber-500" };
    if (score <= 6) return { score, text: "Strong", color: "bg-emerald-500" };
    return { score, text: "Very Secure", color: "bg-teal-500" };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      
      {/* Display password */}
      <div className="relative flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-muted/30">
        <span className="font-mono text-base sm:text-lg break-all select-all font-semibold pr-20 text-foreground">
          {showPassword ? password : "•".repeat(password.length)}
        </span>
        <div className="absolute right-3 flex items-center gap-1.5">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all"
            title="Toggle visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={generatePassword}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all"
            title="Refresh password"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm hover:bg-primary/95 transition-all"
            title="Copy password"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Strength indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Password Strength:</span>
          <span className="text-foreground">{strength.text}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex gap-0.5">
          <div className={`h-full ${strength.color} transition-all`} style={{ width: `${Math.min(100, (strength.score / 7) * 100)}%` }} />
        </div>
      </div>

      {/* Length selector */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <span>Password Length:</span>
          <span className="text-foreground text-sm font-semibold">{length} characters</span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Checkbox settings */}
      <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
        <label className="flex items-center gap-3 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="font-medium text-foreground">Uppercase (A-Z)</span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="font-medium text-foreground">Lowercase (a-z)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="font-medium text-foreground">Numbers (0-9)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="font-medium text-foreground">Symbols (!@#$)</span>
        </label>
      </div>

    </div>
  );
}
