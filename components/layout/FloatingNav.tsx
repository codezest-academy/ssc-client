"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LogOut, Flame, Sparkles, User, ChevronDown, BookOpen, Target, PenTool, BarChart3, Trophy, Map, Bell, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // All 7 links — shown in the desktop horizontal pill nav
  const navLinks = [
    { name: "Curriculum", href: "/dashboard", icon: BookOpen },
    { name: "Syllabus", href: "/dashboard/syllabus", icon: Map },
    { name: "Practice", href: "/dashboard/practice-sets", icon: Target },
    { name: "PYQs", href: "/dashboard/pyq", icon: FileQuestion },
    { name: "Tests", href: "/dashboard/mock-tests", icon: PenTool },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { name: "Alerts", href: "/alerts", icon: Bell },
  ];

  // 5 core tabs — shown in the mobile fixed bottom bar
  // Syllabus and Alerts are secondary features (low daily usage) — desktop only
  const mobileNavLinks = [
    { name: "Home", href: "/dashboard", icon: BookOpen },
    { name: "Practice", href: "/dashboard/practice-sets", icon: Target },
    { name: "PYQs", href: "/dashboard/pyq", icon: FileQuestion },
    { name: "Tests", href: "/dashboard/mock-tests", icon: PenTool },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  ];

  const isToday = (dateString: string | null | undefined) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };
  const hasCompletedToday = isToday(user?.lastActiveDate);
  const streakDays = user?.streakDays || 0;

  if (!user) return null;

  return (
    <div className="relative z-50 w-full flex-shrink-0">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between h-16 px-4 md:px-6 rounded-2xl md:rounded-3xl bg-card border border-border/80 shadow-sm transition-all duration-300">
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
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
            {(!user.subscriptionTier || user.subscriptionTier === 'FREE') && (
              <>
                <Button asChild variant="default" size="sm" className="hidden md:flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-sm border-0 font-semibold h-8 rounded-full px-4">
                  <Link href="/dashboard/upgrade">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Upgrade to Pro
                  </Link>
                </Button>
                <div className="h-4 w-px bg-border hidden md:block" />
              </>
            )}

            
            {/* Streak Indicator */}
            <div className={cn(
              "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-muted/50",
              hasCompletedToday ? "text-orange-500 border-orange-500/20 bg-orange-500/10" : "text-muted-foreground border-border"
            )}>
              <Flame className={cn("w-4 h-4", hasCompletedToday && "fill-orange-500")} />
              <span className="text-sm font-bold">{streakDays}</span>
            </div>

            <ModeToggle />

            {/* Streak counter — uses semantic warning tokens, never raw orange */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-full font-bold shadow-sm">
              <Flame className="w-4 h-4 fill-warning/50" />
              <span className="text-sm">{user.streakDays || 0}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 pl-1.5 pr-3 rounded-full border border-border bg-muted/50 hover:bg-muted flex items-center gap-2">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-2">
                      {user.subscriptionTier || 'Free'} Plan
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                {(!user.subscriptionTier || user.subscriptionTier === 'FREE') && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/upgrade" className="cursor-pointer text-primary font-medium">
                      Upgrade Plan
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>

      {/* Mobile Bottom Navigation — 5 core tabs only (Syllabus & Alerts are desktop-only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-t border-border flex items-center justify-around pb-4 pt-2 px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {mobileNavLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 w-full text-[10px] font-semibold transition-colors rounded-xl",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "fill-primary/20" : "")} />
              <span className="tracking-tight">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
