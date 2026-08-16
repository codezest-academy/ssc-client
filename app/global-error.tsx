"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    try {
      setSubmitting(true);
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
      setSubmitted(true);
    } catch (e) {
      console.error("Failed to submit feedback", e);
      // Even if feedback fails, we show thanks to avoid double frustration
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <html>
      <body>
        <div className="flex h-screen w-full items-center justify-center bg-background p-4 text-foreground">
          <div className="w-full max-w-lg space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-destructive">Something went wrong!</h2>
              <p className="text-muted-foreground">
                We've encountered a fatal error. Our team has been notified, but your context helps us fix it faster.
              </p>
            </div>

            {!submitted ? (
              <div className="space-y-4 rounded-xl bg-muted/50 p-4">
                <label className="text-sm font-semibold">
                  Help us fix this. What were you doing right before the crash?
                </label>
                <Textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g., I clicked the submit button on the math practice test..."
                  className="min-h-[100px] resize-none bg-background"
                />
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitting || !feedback.trim()}
                  className="w-full font-bold"
                >
                  {submitting ? "Submitting..." : "Send Report"}
                </Button>
              </div>
            ) : (
              <div className="rounded-xl bg-success/10 p-4 text-success font-semibold text-center border border-success/20">
                Thank you! Your report has been submitted.
              </div>
            )}

            <Button
              onClick={() => reset()}
              variant="outline"
              className="w-full"
            >
              Try recovering
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
