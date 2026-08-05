import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PaywallGateProps {
  title?: string;
  description?: string;
  contentType?: "Lesson" | "Mock Test" | "Practice Set" | "Feature";
}

export function PaywallGate({
  title = "Premium Content Locked",
  description,
  contentType = "Feature",
}: PaywallGateProps) {
  return (
    <Card className="max-w-xl mx-auto mt-8 border-amber-200 shadow-md bg-gradient-to-b from-amber-50 to-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Crown className="w-32 h-32 text-amber-500" />
      </div>
      <CardContent className="pt-12 pb-12 px-8 flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-sm border border-amber-200">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-8 max-w-sm">
          {description || `Upgrade to a PRO or ELITE plan to unlock this exclusive ${contentType} and accelerate your preparation.`}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
            <Link href="/dashboard/upgrade">
              <Star className="w-4 h-4 mr-2 fill-current" />
              View Premium Plans
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
