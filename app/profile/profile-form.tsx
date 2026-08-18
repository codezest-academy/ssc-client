"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, User as UserIcon2, Mail, Phone, MapPin, Calendar, Briefcase, UserRound } from "lucide-react";
import type { User } from "@/store/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  phone: z.string().max(15).optional(),
  city: z.string().max(100).optional(),
  age: z.coerce.number().int().min(15).max(45).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  occupation: z.string().max(100).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  onSuccess?: () => void;
}

export default function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      city: user.city || "",
      age: user.age || undefined,
      gender: user.gender || undefined,
      occupation: user.occupation || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.patch("/users/me", data);
      // API may return { data: { user: {...} } } or { data: {...user fields...} }
      const updatedUser: User = response.data.data?.user ?? response.data.data;
      if (updatedUser?.id) {
        setUser(updatedUser);
      }
      toast.success("Profile updated successfully!");
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

        {/* Full Name */}
        <div className="space-y-2.5">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
          <div className="relative">
            <UserIcon2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              {...form.register("name")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-[10px] text-destructive font-bold">{form.formState.errors.name.message}</p>
          )}
        </div>

        {/* Email (Disabled) */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
            <Input
              id="email"
              value={user.email}
              disabled
              className="rounded-2xl pl-10 bg-muted/20 border-transparent text-muted-foreground h-12"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2.5">
          <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              {...form.register("phone")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-2.5">
          <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</Label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="city"
              {...form.register("city")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
        </div>

        {/* Age */}
        <div className="space-y-2.5">
          <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age</Label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="age"
              type="number"
              {...form.register("age")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2.5">
          <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender</Label>
          <div className="relative">
            <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
            <Select
              value={form.watch("gender")}
              onValueChange={(val) => form.setValue("gender", val as "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY")}
            >
              <SelectTrigger className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Occupation */}
        <div className="space-y-2.5 md:col-span-2">
          <Label htmlFor="occupation" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Occupation</Label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="occupation"
              {...form.register("occupation")}
              className="rounded-2xl pl-10 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all h-12"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-2xl h-11 font-bold px-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
