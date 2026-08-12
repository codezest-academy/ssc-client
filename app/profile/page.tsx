"use client";

import { useAuthStore } from "@/store/auth";
import { User, BookOpen, Shield, Crown, Camera, Sparkles } from "lucide-react";
import ProfileForm from "./profile-form";
import StudyPreferencesForm from "./study-preferences-form";
import PasswordForm from "./password-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10">
      {/* Hero Header */}
      <div className="relative bg-card rounded-[2.5rem] shadow-sm border border-primary/10 overflow-hidden">
        
        {/* Cover Photo Area */}
        <div className="h-40 md:h-48 w-full relative overflow-hidden bg-muted">
          <img 
            src={user.subscriptionTier === "PRO" 
              ? "/pro-banner.png" 
              : "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop"
            } 
            alt="Cover Banner" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Profile Content */}
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Avatar & Info */}
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
              <div className="relative group -mt-16 md:-mt-20 shrink-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-card shadow-lg bg-card text-4xl">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.name ?? "")}`}
                    alt={user.name ?? "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 p-2.5 bg-background border shadow-sm rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="pt-2 md:pt-4 mb-2 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black tracking-tight text-foreground leading-none">{user.name}</h1>
                </div>
                <p className="text-muted-foreground font-medium pl-1">{user.email}</p>
              </div>
            </div>

            {/* Right Side: Badge & Upgrade CTA */}
            <div className="shrink-0 md:pt-4 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3">
              {user.subscriptionTier !== "FREE" ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary uppercase tracking-widest border border-primary/20">
                  <Sparkles className="w-4 h-4" /> PRO PLAN
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-muted text-muted-foreground uppercase tracking-widest border border-border">
                    FREE PLAN
                  </span>
                  <Link href="/pricing" className="w-full sm:w-auto">
                    <Button className="w-full rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all h-12 px-6">
                      <Crown className="w-4 h-4 mr-2" /> Upgrade to Pro
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Section 1: Personal Info */}
        <section className="bg-card/50 backdrop-blur-sm border border-primary/5 rounded-[2.5rem] shadow-xs p-6 md:p-10 relative overflow-hidden transition-all hover:shadow-md hover:border-primary/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Your basic identity and contact details</p>
              </div>
            </div>
            <ProfileForm user={user} />
          </div>
        </section>

        {/* Section 2: Study Prefs */}
        <section className="bg-card/50 backdrop-blur-sm border border-emerald-500/5 rounded-[2.5rem] shadow-xs p-6 md:p-10 relative overflow-hidden transition-all hover:shadow-md hover:border-emerald-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Study Preferences</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Tailor your curriculum and daily goals</p>
              </div>
            </div>
            <StudyPreferencesForm user={user} />
          </div>
        </section>

        {/* Section 3: Security */}
        <section className="bg-card/50 backdrop-blur-sm border border-rose-500/5 rounded-[2.5rem] shadow-xs p-6 md:p-10 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-border/40 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Security & Password</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Keep your account safe and secure</p>
              </div>
            </div>
            <PasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
