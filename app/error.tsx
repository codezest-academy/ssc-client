"use client";

import { ErrorState } from "@/components/ui/error-state";
import { useEffect } from "react";
import { reportClientError } from "@/lib/error-reporter";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error caught:", error);
    reportClientError({
      message: error.message,
      stack: error.stack,
      errorBoundary: "page",
      severity: "HIGH",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorState
        title="Page Error"
        description="Something went wrong while rendering this page."
        onRetry={() => reset()}
        fullPage
      />
    </div>
  );
}
