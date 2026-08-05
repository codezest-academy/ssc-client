"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import Link from "next/link";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/verify-email", { email, otp });
      toast.success("Email verified successfully! You can now log in.");
      router.push("/login");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card text-card-foreground border shadow-xl rounded-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold tracking-tight">Verify Your Email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-foreground">{email || "your email"}</span>
          </p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6 flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button type="submit" className="w-full h-12 text-base font-bold rounded-lg mt-4" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-400 mt-8">
        Back to{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
