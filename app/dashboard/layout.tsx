"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      logout();
      router.push("/login");
    }
  };

  if (!isHydrated || !user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-primary">Code Zest Academy</h1>
            <span className="text-slate-300">|</span>
            <span className="font-medium text-slate-600">SSC</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <a href="/dashboard" className="text-slate-600 hover:text-primary transition-colors">Curriculum</a>
            <a href="/dashboard/practice-sets" className="text-slate-600 hover:text-primary transition-colors">Practice Sets</a>
            <a href="/dashboard/mock-tests" className="text-slate-600 hover:text-primary transition-colors">Mock Tests</a>
            <a href="/dashboard/analytics" className="text-slate-600 hover:text-primary transition-colors">Analytics</a>
            <a href="/dashboard/leaderboard" className="text-slate-600 hover:text-primary transition-colors">Leaderboard</a>
            <a href="/pricing" className="text-slate-600 hover:text-primary transition-colors font-semibold text-primary">Upgrade</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="/dashboard/purchases" className="text-sm text-slate-600 hover:text-primary font-medium hidden sm:block">My Purchases</a>
          <div className="text-sm hidden sm:block">
            <span className="text-slate-500">Welcome, </span>
            <span className="font-medium text-slate-900">{user.name}</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              {user.subscriptionTier}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-bold shadow-sm">
            🔥 <span>{user.streakDays || 0}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
