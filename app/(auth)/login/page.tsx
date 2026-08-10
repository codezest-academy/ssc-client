"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password, rememberMe });
      const { user, accessToken } = response.data.data;
      
      if (user.role !== "STUDENT") {
        toast.error("Admins must use the admin portal.");
        return;
      }

      setAuth(user, accessToken);
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
    <>
      {/* The Solid Card */}
      <div className="bg-card text-card-foreground border shadow-xl rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold tracking-tight">Log In</h2>
          <p className="text-sm text-muted-foreground mt-2">Sign in to your student account</p>
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
              className="h-12 bg-background/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-10 bg-background/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
            />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keep me logged in
            </Label>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-bold rounded-lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-400 mt-8">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline">
          Register here
        </Link>
      </p>
    </>
  );
}
