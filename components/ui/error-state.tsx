import * as React from "react"
import { useState } from "react"
import { LucideIcon, ServerCrash, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Textarea } from "./textarea"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
  onRetry?: () => void
  retry?: () => void
  fullPage?: boolean
  allowFeedback?: boolean
  onSubmitTicket?: (message: string) => Promise<void>
}

export function ErrorState({
  icon: Icon = ServerCrash,
  title = "Something went wrong",
  description = "Please check your connection and try again.",
  onRetry,
  retry,
  fullPage,
  allowFeedback,
  onSubmitTicket,
  className,
  ...props
}: ErrorStateProps) {
  const handleRetry = onRetry || retry;
  
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmitTicket) return;

    setIsSubmitting(true);
    try {
      await onSubmitTicket(message);
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to submit ticket:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-3xl bg-destructive/5 p-8 text-center animate-in fade-in-50",
        fullPage ? "min-h-[60vh]" : "min-h-[300px]",
        className
      )}
      {...props}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-10 w-10 text-destructive" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>

      {allowFeedback && (
        <div className="mb-8 w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-5 text-left shadow-sm">
          {isSuccess ? (
            <div className="flex flex-col items-center py-4 text-center animate-in zoom-in-95">
              <CheckCircle2 className="mb-2 h-8 w-8 text-success" />
              <p className="font-semibold text-foreground">Issue Reported</p>
              <p className="text-sm text-muted-foreground">Our engineering team has been notified.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <p className="text-sm font-medium text-foreground text-center mb-1">
                Help us fix this by sending an error report.
              </p>
              <Textarea
                placeholder="Optional: What were you doing right before the crash?"
                className="min-h-[80px] text-sm resize-none bg-background/50 focus-visible:ring-destructive/30"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Report
              </Button>
            </form>
          )}
        </div>
      )}

      {handleRetry && (
        <button
          onClick={handleRetry}
          className="rounded-full bg-destructive px-6 py-2.5 text-sm font-medium text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-95"
        >
          {isSuccess ? "Return to Dashboard" : "Try Again"}
        </button>
      )}
    </div>
  )
}
