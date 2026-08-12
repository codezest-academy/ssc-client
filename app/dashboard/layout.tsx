"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { FeedbackWidget } from "@/components/ui/feedback-widget";

export default function DashboardLayout({
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
    <div className="client-shell-outer font-sans">
      <FloatingNav />
      
      {/* 
        The main dashboard content floats inside its own bordered, rounded canvas.
        The top padding accounts for the fixed floating nav pill inside the canvas.
      */}
      <main className="client-shell-inner scroll-smooth">
        <div className="max-w-7xl mx-auto pt-28 pb-12 px-4 md:px-8">
          {children}
        </div>
      </main>
      <FeedbackWidget />
    </div>
  );
}
