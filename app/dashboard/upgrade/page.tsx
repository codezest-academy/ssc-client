"use client";

import { PricingCards } from "@/components/pricing/PricingCards";

export default function UpgradePage() {
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

      <PricingCards />
    </div>
  );
}
