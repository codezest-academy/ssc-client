"use client";

import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Zap, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export default function UpgradePage() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: "PRO" | "ELITE") => {
    setLoadingTier(tier);
    // Mocking a checkout flow. In a real app, this would redirect to Stripe Checkout.
    try {
      // Simulate API call to update user tier
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (user) {
        // Update local auth store so the UI updates immediately
        setAuth({
          ...user,
          subscriptionTier: tier,
        }, "mock-token-kept");
        toast.success(`Successfully upgraded to ${tier}!`);
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="py-10 max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Supercharge Your SSC Preparation
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose the plan that fits your goals. Unlock premium mock tests, advanced analytics, and expert-curated lessons to secure your dream rank.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Free Plan */}
        <Card className="border-border shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">Basic</CardTitle>
            <CardDescription>Perfect for getting started.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-slate-900">₹0</span>
              <span className="text-slate-500 font-medium">/ forever</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 mt-4">
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                Access to all free lessons
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                Limited practice sets
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                Basic performance analytics
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-8">
            <Button className="w-full" variant="outline" disabled>
              {user?.subscriptionTier === "FREE" ? "Current Plan" : "Included"}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-primary shadow-lg relative transform md:-translate-y-4 flex flex-col bg-slate-900 text-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Pro
            </CardTitle>
            <CardDescription className="text-slate-400">Unlock your true potential.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-white">₹499</span>
              <span className="text-slate-400 font-medium">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 mt-4">
            <ul className="space-y-3 text-sm text-slate-300 font-medium">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-white">Everything in Basic</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                All Premium Video Lessons & PDFs
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                50+ Full-Length Mock Tests
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                Advanced Analytics & AI insights
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                Doubt solving within 24 hours
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-8">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => handleSubscribe("PRO")}
              disabled={loadingTier !== null || user?.subscriptionTier === "PRO" || user?.subscriptionTier === "ELITE"}
            >
              {loadingTier === "PRO" ? "Processing..." : user?.subscriptionTier === "PRO" ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </CardFooter>
        </Card>

        {/* Elite Plan */}
        <Card className="border-amber-200 shadow-md flex flex-col bg-gradient-to-b from-amber-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Elite
            </CardTitle>
            <CardDescription className="text-amber-700/80">For guaranteed selection.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-amber-900">₹999</span>
              <span className="text-amber-700 font-medium">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 mt-4">
            <ul className="space-y-3 text-sm text-slate-700 font-medium">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-amber-950 font-bold">Everything in Pro</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                1-on-1 Mentorship sessions
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                Live doubt solving instantly
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                Printed study material delivery
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-8">
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              onClick={() => handleSubscribe("ELITE")}
              disabled={loadingTier !== null || user?.subscriptionTier === "ELITE"}
            >
              {loadingTier === "ELITE" ? "Processing..." : user?.subscriptionTier === "ELITE" ? "Current Plan" : "Upgrade to Elite"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
