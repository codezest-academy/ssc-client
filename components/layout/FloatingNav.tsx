"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";

export function FloatingNav() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();

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

  const navLinks = [
    { name: "Curriculum", href: "/dashboard" },
    { name: "Practice Sets", href: "/dashboard/practice-sets" },
    { name: "Mock Tests", href: "/dashboard/mock-tests" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Leaderboard", href: "/dashboard/leaderboard" },
  ];

  if (!user) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 md:px-6 md:pt-6 pointer-events-none">
      <div className="mx-auto max-w-7xl">
        <header className="pointer-events-auto flex items-center justify-between h-16 px-4 md:px-6 rounded-2xl bg-card/95 backdrop-blur-md shadow-floating border border-border transition-all duration-300">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">
                Code Zest <span className="text-primary">SSC</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                      isActive 
                        ? "bg-slate-100 text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Tools & Profile */}
          <div className="flex items-center gap-4">
            <Link 
              href="/pricing" 
              className="hidden md:block text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Upgrade
            </Link>
            
            <div className="h-4 w-px bg-border hidden sm:block" />
            
            <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full font-bold shadow-sm">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span className="text-sm">{user.streakDays || 0}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold leading-none">{user.name}</span>
                <span className="text-xs text-muted-foreground mt-1 capitalize">{user.subscriptionTier?.toLowerCase() || 'Free'}</span>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground" title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>
      </div>
    </div>
  );
}
