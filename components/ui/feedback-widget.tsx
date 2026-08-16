"use client";

import * as React from "react";
import { useState } from "react";
import { MessageCircleQuestion, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { api } from "@/lib/axios";

type FeedbackType = "ISSUE" | "FEATURE_REQUEST" | "TESTIMONIAL";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("ISSUE");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post("/feedback", {
        type,
        message,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSuccess(false);
          setMessage("");
          setType("ISSUE");
        }, 300);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      // fallback handling here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label="Help and Feedback"
      >
        <MessageCircleQuestion className="h-6 w-6" />
      </button>

      {/* Popover Form */}
      <div
        className={cn(
          "absolute bottom-0 right-0 w-[320px] origin-bottom-right rounded-3xl border border-border bg-card p-5 shadow-2xl transition-all duration-300",
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Feedback & Support</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="mb-3 h-10 w-10 text-success" />
            <p className="font-medium text-foreground">Thank You!</p>
            <p className="text-sm text-muted-foreground">
              Your feedback helps us improve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackType)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="ISSUE">Report an Issue</option>
                <option value="FEATURE_REQUEST">Suggest a Feature</option>
                <option value="TESTIMONIAL">Share Feedback</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Message
              </label>
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[100px] resize-none text-sm bg-background"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
