"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/store/auth";
import { User as UserIcon, BookOpen, Shield, Crown, Pencil, Sparkles, MapPin, Phone, Briefcase, Calendar, Clock, CheckCircle2 } from "lucide-react";
import ProfileForm from "./profile-form";
import StudyPreferencesForm from "./study-preferences-form";
import PasswordForm from "./password-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground truncate">
        {value ?? <span className="text-muted-foreground font-normal italic">Not set</span>}
      </span>
    </div>
  );
}

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const STUDY_TIME_LABELS: Record<string, string> = {
  LESS_THAN_2_HOURS: "< 2 hours / day",
  TWO_TO_FOUR_HOURS: "2–4 hours / day",
  MORE_THAN_4_HOURS: "> 4 hours / day",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user) as User | null;

  const [profileOpen, setProfileOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  const targetExams = Array.isArray(user.targetExam)
    ? user.targetExam
    : user.targetExam
    ? [user.targetExam]
    : [];

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-10">

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div className="relative bg-card rounded-[2.5rem] shadow-sm border border-primary/10 overflow-hidden">

        {/* Cover Photo */}
        <div className="h-40 md:h-48 w-full relative overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              user.subscriptionTier === "PRO"
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
              <div className="relative -mt-16 md:-mt-20 shrink-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-card shadow-lg bg-card text-4xl">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.name ?? "")}`}
                    alt={user.name ?? "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
              </div>

              <div className="pt-2 md:pt-4 mb-2 md:mb-0">
                <h1 className="text-3xl font-black tracking-tight text-foreground leading-none mb-1">{user.name}</h1>
                <p className="text-muted-foreground font-medium">{user.email}</p>
                {user.city && (
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {user.city}
                  </p>
                )}
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
                    <Button className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all h-11 px-6">
                      <Crown className="w-4 h-4 mr-2" /> Upgrade to Pro
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sections ─────────────────────────────────────────────────────── */}
      <div className="space-y-8">

        {/* Section 1: Personal Info */}
        <section className="bg-card border border-border/60 rounded-[2.5rem] shadow-xs p-6 md:p-10 relative overflow-hidden transition-all hover:shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Your basic identity and contact details</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProfileOpen(true)}
                className="rounded-xl gap-2 font-semibold h-9 px-4"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
            </div>

            {/* Read-only Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
              <InfoRow label="Full Name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone ?? null} />
              <InfoRow label="City" value={user.city ?? null} />
              <InfoRow label="Age" value={user.age ?? null} />
              <InfoRow label="Gender" value={user.gender ? GENDER_LABELS[user.gender] : null} />
              <div className="col-span-2 md:col-span-3">
                <InfoRow label="Occupation" value={user.occupation ?? null} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Study Preferences */}
        <section className="bg-card border border-border/60 rounded-[2.5rem] shadow-xs p-6 md:p-10 relative overflow-hidden transition-all hover:shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-success/10 flex items-center justify-center text-success shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Study Preferences</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Tailored curriculum and daily goals</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudyOpen(true)}
                className="rounded-xl gap-2 font-semibold h-9 px-4"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
            </div>

            {/* Read-only content */}
            <div className="space-y-5">
              {/* Target Exams */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-3">Target Exams</span>
                {targetExams.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {targetExams.map((exam) => (
                      <span key={exam} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {exam.replace("SSC_", "SSC ")}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">No exams selected</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <InfoRow label="Target Year" value={user.examYear ?? null} />
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <InfoRow label="Daily Study Time" value={user.dailyStudyTime ? STUDY_TIME_LABELS[user.dailyStudyTime] : null} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Security */}
        <section className="bg-card border border-border/60 rounded-[2.5rem] shadow-xs p-6 md:p-10 relative overflow-hidden transition-all hover:shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Security & Password</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Keep your account safe and secure</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPasswordOpen(true)}
                className="rounded-xl gap-2 font-semibold h-9 px-4"
              >
                <Pencil className="w-3.5 h-3.5" /> Change Password
              </Button>
            </div>

            {/* Read-only security info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label="Account Email" value={user.email} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</span>
                <span className="text-sm font-semibold text-foreground tracking-widest">••••••••••</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────────── */}

      {/* Personal Info Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black">Edit Personal Information</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update your name, contact details, and other personal info.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm user={user} onSuccess={() => setProfileOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Study Preferences Dialog */}
      <Dialog open={studyOpen} onOpenChange={setStudyOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black">Edit Study Preferences</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update your target exams, exam year, and daily study time.
            </DialogDescription>
          </DialogHeader>
          <StudyPreferencesForm user={user} onSuccess={() => setStudyOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black">Change Password</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <PasswordForm onSuccess={() => setPasswordOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
