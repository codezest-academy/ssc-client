"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { api } from "@/lib/axios";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Root ErrorBoundary caught error:", error);
  }, [error]);

  const submitFeedback = async (feedback: string) => {
    await api.post("/feedback", {
      type: "CRASH",
      content: feedback,
      metadata: {
        errorMessage: error.message,
        stackTrace: error.stack,
        digest: error.digest,
        url: typeof window !== "undefined" ? window.location.href : "unknown",
      }
    });
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-lg">
        <ErrorState
          title="Something went wrong!"
          description="We've encountered a fatal error rendering this section. Our team has been notified, but your context helps us fix it faster."
          onRetry={() => reset()}
          allowFeedback={true}
          onSubmitTicket={submitFeedback}
        />
      </div>
    </div>
  );
}
