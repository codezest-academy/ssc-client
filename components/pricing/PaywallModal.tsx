import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Lock } from "lucide-react";
import Link from "next/link";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export function PaywallModal({ isOpen, onClose, featureName }: PaywallModalProps) {
  const features = [
    "Unlimited Premium Mock Tests",
    "Detailed Performance Analytics",
    "Personalized Study Plans",
    "Video Solutions for Hard Questions",
    "Ad-free Experience"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden bg-card rounded-2xl">
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6">
          <DialogHeader className="pt-4 space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl text-center font-bold tracking-tight">
              Unlock {featureName}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              You've discovered a Pro feature! Upgrade your account to get unlimited access and supercharge your prep.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-success" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md font-bold h-12 rounded-xl text-md">
              <Link href="/dashboard/upgrade">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro Now
              </Link>
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full font-medium h-12 rounded-xl">
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
