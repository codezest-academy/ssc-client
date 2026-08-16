import Link from "next/link";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block text-foreground">
            Code Zest Academy
          </span>
        </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <Link
              href="/#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="font-semibold text-sm hidden sm:flex h-9 px-4"
              >
                <LogIn className="w-4 h-4 mr-2" /> Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-bold text-sm h-9 px-5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                Get Started
              </Button>
            </Link>
          </div>
      </div>
    </header>
  );
}
