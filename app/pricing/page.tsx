"use client";

import { PricingCards } from "@/components/pricing/PricingCards";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export default function PricingPage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/dashboard/upgrade");
    }
  }, [user, isHydrated, router]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground bg-grid-pattern">
      <MarketingNav />
      <main className="flex-1 relative flex flex-col">
        <div className="flex-1 py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
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
      </main>
      <MarketingFooter />
    </div>
  );
}
