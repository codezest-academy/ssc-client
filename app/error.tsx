"use client";

import { ErrorState } from "@/components/ui/error-state";
import { useEffect } from "react";
import { reportClientError } from "@/lib/error-reporter";
import { api } from "@/lib/axios";

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

  const handleSubmitTicket = async (userMessage: string) => {
    const fullMessage = `User Context: ${userMessage}\n\nCrash Route: ${window.location.pathname}\nError: ${error.message}\nDigest: ${error.digest || 'N/A'}`;
    await api.post("/feedback", {
      type: "ISSUE",
      message: fullMessage,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorState
        title="Page Error"
        description="Something went wrong while rendering this page."
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
    </div>
  );
}
