"use client";

import * as React from "react";
import { useState } from "react";
import { MessageCircleQuestion, X, Loader2, CheckCircle2, Bug, MessageSquare, Star, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { api } from "@/lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

type FeedbackType = "ISSUE" | "FEATURE_REQUEST" | "TESTIMONIAL";

interface ActionDef {
  type: FeedbackType;
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
  placeholder: string;
  colorClass: string;
  tooltipClass: string;
}

const ACTIONS: ActionDef[] = [
  { type: "ISSUE", icon: Bug, label: "Report Issue", title: "Report an Issue", description: "Found a bug or glitch? Let us know so we can squash it quickly.", placeholder: "Please describe the bug or issue...", colorClass: "text-destructive bg-destructive/10 border-destructive/20 hover:border-destructive/50 hover:bg-destructive/20", tooltipClass: "bg-destructive text-destructive-foreground border-destructive" },
  { type: "TESTIMONIAL", icon: MessageSquare, label: "Share Feedback", title: "Share Feedback", description: "We're always looking to improve. What are your thoughts on the platform?", placeholder: "What's on your mind?", colorClass: "text-primary bg-primary/10 border-primary/20 hover:border-primary/50 hover:bg-primary/20", tooltipClass: "bg-primary text-primary-foreground border-primary" },
  { type: "TESTIMONIAL", icon: Star, label: "Testimonial", title: "Share a Testimonial", description: "Loving Code Zest? We'd love to hear your success story!", placeholder: "What do you love about Code Zest?", colorClass: "text-warning bg-warning/10 border-warning/20 hover:border-warning/50 hover:bg-warning/20", tooltipClass: "bg-warning text-warning-foreground border-warning" },
  { type: "FEATURE_REQUEST", icon: Lightbulb, label: "Feature Addition", title: "Suggest a Feature", description: "Have an idea that would make your prep easier? Tell us about it.", placeholder: "What feature would you like to see?", colorClass: "text-success bg-success/10 border-success/20 hover:border-success/50 hover:bg-success/20", tooltipClass: "bg-success text-success-foreground border-success" },
];

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActionDef | null>(null);
  
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeModal) return;

    setIsSubmitting(true);
    try {
      await api.post("/feedback", {
        type: activeModal.type,
        message,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setActiveModal(null);
        setTimeout(() => {
          setIsSuccess(false);
          setMessage("");
        }, 300);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (action: ActionDef) => {
    setIsOpen(false);
    setActiveModal(action);
    setMessage("");
    setIsSuccess(false);
  };

  return (
    <>
      {/* Floating Speed Dial */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* Speed Dial Actions */}
        <TooltipProvider>
          <div
            className={cn(
              "flex flex-col gap-3 transition-all duration-300",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
            )}
          >
            {ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <Tooltip key={i} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleOpenModal(action)}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border shadow-md transition-all hover:scale-110 active:scale-95",
                        action.colorClass
                      )}
                      aria-label={action.label}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={10} className={cn("border-none", action.tooltipClass)}>
                    <p className="font-medium">{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all hover:scale-105 active:scale-95",
            isOpen ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
          )}
          aria-label="Toggle Feedback Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircleQuestion className="h-6 w-6" />}
        </button>
      </div>

      {/* Modal Dialog */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden bg-card rounded-2xl shadow-2xl">
          {activeModal && (
            <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6">
              <DialogHeader className="pt-2 space-y-3">
                <div className={cn("mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-1", activeModal.colorClass.split(' ').slice(0, 2).join(' '))}>
                  <activeModal.icon className="w-6 h-6" />
                </div>
                <DialogTitle className="text-xl text-center font-bold tracking-tight">
                  {activeModal.title}
                </DialogTitle>
                <DialogDescription className="text-center text-sm">
                  {activeModal.description}
                </DialogDescription>
              </DialogHeader>
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="mb-3 h-10 w-10 text-success" />
                  <p className="text-lg font-medium text-foreground">Thank You!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your feedback helps us improve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                  <Textarea
                    placeholder={activeModal.placeholder}
                    className="min-h-[120px] resize-none bg-background focus-visible:ring-primary/20 rounded-xl"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    autoFocus
                  />
                  <div className="flex justify-end gap-3 mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveModal(null)}
                      disabled={isSubmitting}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className="min-w-[120px] rounded-xl font-semibold shadow-md"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
