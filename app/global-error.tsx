"use client";

import { ErrorState } from "@/components/ui/error-state";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error("Global crash caught:", error);
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
