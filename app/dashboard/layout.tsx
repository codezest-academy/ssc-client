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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <FloatingNav />
      
      {/* 
        The top padding accounts for the fixed floating nav pill.
        pt-28 gives ample breathing room above the content.
      */}
      <main className="flex-1 pt-28 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <FeedbackWidget />
    </div>
  );
}
