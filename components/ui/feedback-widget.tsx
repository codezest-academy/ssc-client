"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"FEATURE_REQUEST" | "TESTIMONIAL">("FEATURE_REQUEST");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post("/feedback", { type, message });
      toast.success("Thank you for your feedback!");
      setOpen(false);
      setMessage("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquarePlus className="h-6 w-6 text-primary" />
          <span className="sr-only">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Code Zest SSC, or let us know what you love!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === "FEATURE_REQUEST" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("FEATURE_REQUEST")}
            >
              Suggestion
            </Button>
            <Button
              type="button"
              variant={type === "TESTIMONIAL" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setType("TESTIMONIAL")}
            >
              Testimonial
            </Button>
          </div>
          <Textarea
            placeholder={
              type === "FEATURE_REQUEST"
                ? "I wish the platform had..."
                : "Code Zest SSC really helped me with..."
            }
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
            rows={5}
            className="resize-none"
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !message.trim()}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
