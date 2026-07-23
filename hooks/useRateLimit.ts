import { useState } from "react";

export function useRateLimit(toolSlug: string) {
  const [checking, setChecking] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [limitDetails, setLimitDetails] = useState<{ limit: number; count: number; plan: string } | null>(null);

  const checkLimit = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/process/check-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug }),
      });
      const data = await res.json();
      
      setLimitDetails({
        limit: data.limit,
        count: data.count,
        plan: data.plan,
      });

      if (data.allowed === false) {
        setLimitExceeded(true);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Failed to check rate limit:", e);
      return true; // Fail open to keep app usable if server issues occur
    } finally {
      setChecking(false);
    }
  };

  const logUsage = async (fileSize?: number) => {
    try {
      await fetch("/api/process/log-usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug, fileSize }),
      });
    } catch (e) {
      console.error("Failed to log usage:", e);
    }
  };

  return { checkLimit, logUsage, limitExceeded, limitDetails, checking };
}
