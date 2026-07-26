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
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left side: Branding/Image */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-foreground p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl opacity-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black rounded-full blur-3xl opacity-20" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Master the SSC Exams</h2>
          <p className="text-lg opacity-90">
            Join thousands of students preparing with our premium mock tests, structured video courses, and detailed analytics.
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Code Zest Academy</h1>
            <p className="text-muted-foreground font-medium">SSC (Staff Selection Commission) Portal</p>
          </div>
          
          <div className="bg-card text-card-foreground border rounded-xl p-8 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  required
                  className="h-11 bg-background"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-background"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
