"use client";

import { ErrorState } from "@/components/ui/error-state";
import { useEffect } from "react";
import { reportClientError } from "@/lib/error-reporter";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash caught:", error);
    reportClientError({
      message: error.message,
      stack: error.stack,
      errorBoundary: "global",
      severity: "CRITICAL",
    });
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="flex min-h-screen items-center justify-center p-4">
          <ErrorState
            title="Fatal Error"
            description="The application crashed. We've been notified."
            onRetry={() => reset()}
            fullPage
          />
        </main>
      </body>
    </html>
  );
}
