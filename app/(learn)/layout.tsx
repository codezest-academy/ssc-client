"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { FeedbackWidget } from "@/components/ui/feedback-widget";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        router.replace("/login");
      } else if (!user.onboardingComplete) {
        router.replace("/onboarding");
      }
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return null;
  }

  return (
    <div className="bg-slate-50/80 font-sans min-h-screen flex flex-col">
      <div className="p-2 sm:p-3 md:p-4 sticky top-0 z-50 bg-slate-50/90 backdrop-blur-xl border-b border-transparent">
        <FloatingNav />
      </div>
      {/* Full bleed, scrollable content */}
      <main className="w-full flex-1">
        {children}
      </main>
      <FeedbackWidget />
    </div>
  );
}
