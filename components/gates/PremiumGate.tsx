"use client";

import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) return null;

  const hasAccess =
    user?.subscriptionTier === "PRO" || user?.subscriptionTier === "ELITE";

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative group">
      {/* Blurred out content */}
      <div className="filter blur-sm opacity-50 pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 rounded-xl z-10 p-6 text-center">
        <Lock className="w-12 h-12 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold mb-2">Premium Content</h3>
        <p className="text-sm text-slate-600 mb-6 max-w-sm">
          You need an active subscription to access this mock test and view detailed analytics.
        </p>
        <Button asChild>
          <Link href="/pricing">View Plans</Link>
        </Button>
      </div>
    </div>
  );
}
