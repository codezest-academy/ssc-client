"use client";

import { PricingCards } from "@/components/pricing/PricingCards";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PricingPage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/dashboard/upgrade");
    }
  }, [user, isHydrated, router]);

  return (
    <div className="min-h-screen bg-grid-pattern bg-background font-sans">
      <div className="container max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Unlock Premium Learning
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the right plan or combo package to accelerate your SSC exam preparation.
          </p>
        </div>

        <PricingCards />
      </div>
    </div>
  );
}
