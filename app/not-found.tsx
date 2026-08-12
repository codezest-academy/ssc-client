"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { useAuthStore } from "@/store/auth";

export default function NotFound() {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const showDashboardNav = isHydrated && user;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground bg-grid-pattern">
      {showDashboardNav ? <FloatingNav /> : <MarketingNav />}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto space-y-6 relative z-10 py-24">
          <div className="relative flex items-center justify-center mb-8">
            <h1 className="text-9xl md:text-[12rem] font-extrabold tracking-tighter text-primary/10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-display">
                Page Not Found
              </h2>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground mt-4 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          
          <div className="pt-8 flex justify-center gap-4">
            <Link href={showDashboardNav ? "/dashboard" : "/"}>
              <Button size="lg" className="rounded-full px-8 font-semibold shadow-xl shadow-primary/20">
                {showDashboardNav ? "Return to Dashboard" : "Return Home"}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold bg-background/50 backdrop-blur-sm">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
