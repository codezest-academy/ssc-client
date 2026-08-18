"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, KeyRound, Lock, CheckCircle2, Circle } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  onSuccess?: () => void;
}

export default function PasswordForm({ onSuccess }: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      await api.patch("/users/me/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      form.reset();
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const newPasswordValue = form.watch("newPassword");

  const requirements = [
    { label: "At least 8 characters", met: newPasswordValue?.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPasswordValue || "") },
    { label: "One number", met: /[0-9]/.test(newPasswordValue || "") },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex-1 max-w-md">

        <div className="space-y-2.5">
          <Label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="currentPassword"
              type="password"
              {...form.register("currentPassword")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
          {form.formState.errors.currentPassword && (
            <p className="text-[10px] text-destructive font-bold">{form.formState.errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type="password"
              {...form.register("newPassword")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
          {form.formState.errors.newPassword && (
            <p className="text-[10px] text-destructive font-bold">{form.formState.errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              {...form.register("confirmPassword")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-[10px] text-destructive font-bold">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl h-11 font-bold px-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Password
          </Button>
        </div>
      </form>

      {/* Requirements Checklist */}
      <div className="lg:w-64 shrink-0">
        <div className="bg-muted/30 rounded-[2rem] p-6 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">Password Requirements</h3>
          <ul className="space-y-3">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-center gap-3">
                {req.met ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                )}
                <span className={`text-sm ${req.met ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
