"use client";

import { useAccess } from "@/lib/useAccess";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

interface AccessGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  accessTier: "FREE" | "PRO" | "EXCLUSIVE";
  itemId: string; // The ID of the mock test, practice set, etc.
}

export function AccessGate({ children, fallback, accessTier, itemId }: AccessGateProps) {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { canAccess, isLoading } = useAccess();

  if (!isHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const hasAccess = canAccess(accessTier, itemId);

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
        <h3 className="text-xl font-bold mb-2">Content Locked</h3>
        <p className="text-sm text-slate-600 mb-6 max-w-sm">
          {accessTier === "PRO" 
            ? "You need an active PRO subscription to access this content."
            : "This is exclusive content. You need to purchase it to access."}
        </p>
        <Button asChild>
          {accessTier === "PRO" ? (
            <Link href="/pricing">Upgrade to PRO</Link>
          ) : (
            <Link href={`/checkout?item=${itemId}`}>Purchase Now</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
