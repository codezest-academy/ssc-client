"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { FeedbackWidget } from "@/components/ui/feedback-widget";

export default function ProfileLayout({
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
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans p-4 md:p-6 lg:p-8 gap-6">
      <FloatingNav />
      
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <FeedbackWidget />
    </div>
  );
}
