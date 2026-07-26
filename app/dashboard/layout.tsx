"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
    if (isHydrated && !user) {
      router.replace("/login");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-xl text-primary">Code Zest Academy</h1>
          <span className="text-slate-300">|</span>
          <span className="font-medium text-slate-600">SSC (Staff Selection Commission)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-slate-500">Welcome, </span>
            <span className="font-medium text-slate-900">{user.name}</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              {user.subscriptionTier}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => logout()}>
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
