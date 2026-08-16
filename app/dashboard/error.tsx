"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <ErrorState
        title="Something went wrong!"
        description="We encountered an unexpected error while trying to load this page."
        onRetry={() => reset()}
      >
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </ErrorState>
    </div>
  );
}
