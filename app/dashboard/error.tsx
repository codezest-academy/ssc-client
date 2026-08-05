"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
          Something went wrong!
        </h2>
        <p className="mb-8 text-sm text-slate-500">
          We encountered an unexpected error while trying to load this page.
          {error.message && (
            <span className="block mt-2 font-mono text-xs text-red-400">
              {error.message}
            </span>
          )}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
