"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Authentication Error</h1>
        <p className="mt-4 text-muted-foreground">
          Something went wrong during sign-in. Please try again.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
