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
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export function ReportIssueButton({ questionId }: { questionId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post("/feedback", { 
        type: "ISSUE", 
        message, 
        questionId 
      });
      toast.success("Issue reported. Thank you!");
      setOpen(false);
      setMessage("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to report issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-destructive text-xs">
          <Flag className="w-3 h-3 mr-1" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Question Issue</DialogTitle>
          <DialogDescription>
            Is there a typo, incorrect option, or misleading explanation? Let us know.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Textarea
            placeholder="e.g. The correct answer should be C, not B because..."
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
            rows={4}
            className="resize-none"
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !message.trim()} variant="destructive">
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
