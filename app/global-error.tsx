"use client";

import { ErrorState } from "@/components/ui/error-state";
import { useEffect } from "react";
import { reportClientError } from "@/lib/error-reporter";
import { api } from "@/lib/axios";

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

  const handleSubmitTicket = async (userMessage: string) => {
    const fullMessage = `[GLOBAL CRASH] User Context: ${userMessage}\n\nCrash Route: ${window.location.pathname}\nError: ${error.message}\nDigest: ${error.digest || 'N/A'}`;
    await api.post("/feedback", {
      type: "ISSUE",
      message: fullMessage,
    });
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="flex min-h-screen items-center justify-center p-4">
          <ErrorState
            title="Fatal Error"
            description="The application crashed. We've been notified."
            onRetry={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/dashboard";
              } else {
                reset();
              }
            }}
            fullPage
            allowFeedback={true}
            onSubmitTicket={handleSubmitTicket}
          />
        </main>
      </body>
    </html>
  );
}
