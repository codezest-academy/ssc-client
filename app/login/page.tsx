"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { DotPattern } from "@/components/ui/pattern";

export default function LoginPage() {
  const [email, setEmail] = useState("student.free@gmail.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data.user.role !== "STUDENT") {
        toast.error("Admins must use the admin portal.");
        return;
      }

      setAuth(response.data.user, response.data.token);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left side: Premium Branding Environment */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0b1016] p-12 text-white relative overflow-hidden border-r border-border/10">
        {/* Abstract Glows & Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-80" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <DotPattern />

        {/* Top left Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-2xl shadow-primary/20">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Code Zest Academy</span>
        </div>

        {/* Bottom left Text */}
        <div className="max-w-md mt-auto relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight text-white">
            Master the <span className="text-primary">SSC Exams.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            Join thousands of students preparing with our premium mock tests, structured video courses, and detailed analytics.
          </p>
        </div>
      </div>

      {/* Right side: Form (Dark Mode / Theme Aware) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Code Zest Academy</span>
          </div>

          <div className="bg-card text-card-foreground border rounded-2xl p-8 sm:p-10 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Log In</h2>
              <p className="text-sm text-muted-foreground mt-2">Sign in to your student account to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.free@gmail.com"
                  required
                  className="h-12 bg-background/50 border-input"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Password</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-background/50 border-input"
                  disabled={loading}
                />
              </div>
              
              <Button type="submit" className="w-full h-12 text-base font-bold rounded-lg" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
