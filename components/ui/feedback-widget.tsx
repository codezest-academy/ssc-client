"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, Star, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export function FeedbackWidget() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<"FEATURE_REQUEST" | "TESTIMONIAL" | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !modalOpen) return;

    setIsSubmitting(true);
    try {
      await api.post("/feedback", { type: modalOpen, message });
      toast.success(
        modalOpen === "FEATURE_REQUEST" 
          ? "Thanks for your suggestion!" 
          : "Thanks for your kind words!"
      );
      setModalOpen(null);
      setMessage("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (type: "FEATURE_REQUEST" | "TESTIMONIAL") => {
    setModalOpen(type);
    setMenuOpen(false);
    setMessage("");
  };

  return (
    <>
      {/* Floating Action Button (FAB) Menu */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {/* Expanded Options */}
        <div 
          className={`flex flex-col items-end gap-3 transition-all duration-300 ease-in-out ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 text-white border-0"
                  onClick={() => handleOpenModal("TESTIMONIAL")}
                >
                  <Star className="h-5 w-5 fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium bg-background text-foreground border shadow-sm">
                <p>Share Love</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                  onClick={() => handleOpenModal("FEATURE_REQUEST")}
                >
                  <MessageSquarePlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium bg-background text-foreground border shadow-sm">
                <p>Suggest Feature</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Toggle Button */}
        <Button
          variant="default"
          size="icon"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${
            menuOpen ? "bg-muted text-foreground rotate-180 border border-border" : "bg-primary text-primary-foreground hover:bg-primary/90 rotate-0"
          }`}
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle Feedback Menu</span>
        </Button>
      </div>

      {/* Suggestion Modal */}
      <Dialog 
        open={modalOpen === "FEATURE_REQUEST"} 
        onOpenChange={(isOpen) => !isOpen && setModalOpen(null)}
      >
        <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border border-border shadow-2xl rounded-2xl bg-card">
          <div className="bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6">
            <DialogHeader className="mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <MessageSquarePlus className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-display">Suggest a Feature</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground pt-1">
                Help us improve Code Zest SSC. What's missing from your prep journey?
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="I wish the platform had..."
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
                rows={5}
                className="resize-none bg-background/50 backdrop-blur-sm focus-visible:ring-primary/50 text-base p-4 rounded-xl shadow-inner border border-input"
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !message.trim()} className="px-6 rounded-full font-semibold">
                  {isSubmitting ? "Sending..." : "Submit Suggestion"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Testimonial Modal */}
      <Dialog 
        open={modalOpen === "TESTIMONIAL"} 
        onOpenChange={(isOpen) => !isOpen && setModalOpen(null)}
      >
        <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border border-border shadow-2xl rounded-2xl bg-card">
          <div className="bg-gradient-to-br from-amber-500/10 via-transparent to-transparent p-6">
            <DialogHeader className="mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <DialogTitle className="text-2xl font-display">Share Some Love</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground pt-1">
                How has Code Zest SSC helped your preparation? We love hearing your success stories!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Code Zest really helped me with..."
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
                rows={5}
                className="resize-none bg-background/50 backdrop-blur-sm focus-visible:ring-amber-500/50 text-base p-4 rounded-xl shadow-inner border border-input"
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(null)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !message.trim()} 
                  className="px-6 rounded-full font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 border-0"
                >
                  {isSubmitting ? "Sending..." : "Send Testimonial"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
