"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  RefreshCw,
  Zap,
  BookOpen,
  Clock,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudyPersona, DailyStudyTime } from "@/store/auth";

// ─── Constants ───────────────────────────────────────────────────────────────

const EXAMS = [
  { id: "SSC_CGL", name: "SSC CGL", description: "Combined Graduate Level" },
  { id: "SSC_CHSL", name: "SSC CHSL", description: "Combined Higher Secondary Level" },
  { id: "SSC_MTS", name: "SSC MTS", description: "Multi Tasking Staff" },
  { id: "SSC_CPO", name: "SSC CPO", description: "Central Police Organization" },
  { id: "SSC_GD", name: "SSC GD", description: "General Duty Constable" },
];

const EXAM_YEARS = ["2025", "2026", "2027", "2028", "Not sure yet"];

const SITUATIONS = [
  {
    id: "student",
    label: "Full-time student",
    description: "Preparing is my main focus right now.",
    icon: GraduationCap,
    occupation: "Student",
    hasAttemptedBefore: false,
  },
  {
    id: "working",
    label: "Working & preparing",
    description: "I study alongside my job.",
    icon: Briefcase,
    occupation: "Working Professional",
    hasAttemptedBefore: false,
  },
  {
    id: "repeat",
    label: "I've attempted before",
    description: "This isn't my first attempt — I want to improve my score.",
    icon: RefreshCw,
    occupation: "",
    hasAttemptedBefore: true,
  },
];

const DAILY_TIMES: { id: DailyStudyTime; label: string; description: string; icon: typeof Zap }[] = [
  {
    id: "LESS_THAN_2_HOURS",
    label: "Less than 2 hours",
    description: "I have limited time — keep it focused.",
    icon: Zap,
  },
  {
    id: "TWO_TO_FOUR_HOURS",
    label: "2–4 hours",
    description: "A solid daily commitment.",
    icon: BookOpen,
  },
  {
    id: "MORE_THAN_4_HOURS",
    label: "More than 4 hours",
    description: "I'm fully dedicated to this.",
    icon: Clock,
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  targetExam: string[];
  examYear: string | null;
  situationId: string | null;
  occupation: string;
  hasAttemptedBefore: boolean;
  dailyStudyTime: DailyStudyTime | null;
  // Optional demographics
  age: string;
  gender: string;
  city: string;
  educationLevel: string;
  incomeRange: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Step {step} of {total}
        </span>
        <span className="text-xs text-slate-500">{Math.round((step / total) * 100)}% complete</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function SelectionCard({
  isSelected,
  onClick,
  children,
}: {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-start gap-4 text-left p-5 rounded-xl border-2 transition-all duration-200 w-full min-h-[44px]",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/8"
      )}
    >
      {isSelected && (
        <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary shrink-0" />
      )}
      {children}
    </button>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { user, isHydrated, accessToken, setAuth, setUser } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    targetExam: [],
    examYear: null,
    situationId: null,
    occupation: "",
    hasAttemptedBefore: false,
    dailyStudyTime: null,
    age: "",
    gender: "",
    city: "",
    educationLevel: "",
    incomeRange: "",
  });

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        router.replace("/login");
      } else if (user.onboardingComplete) {
        router.replace("/dashboard");
      }
    }
  }, [user, isHydrated, router]);

  const canProceedStep1 = form.targetExam.length > 0 && form.examYear !== null;
  const canProceedStep2 = form.situationId !== null;
  const canProceedStep3 = form.dailyStudyTime !== null;

  const handleSituationSelect = (situation: (typeof SITUATIONS)[0]) => {
    setForm((prev) => ({
      ...prev,
      situationId: situation.id,
      occupation:
        situation.id === "repeat" && prev.occupation
          ? prev.occupation
          : situation.occupation,
      hasAttemptedBefore: situation.hasAttemptedBefore,
    }));
  };

  const handleSubmit = async (skipDemographics = false) => {
    if (form.targetExam.length === 0 || !form.examYear || !form.dailyStudyTime) return;

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        targetExam: form.targetExam,
        examYear: parseInt(form.examYear) || new Date().getFullYear() + 1,
        occupation: form.occupation || "Student",
        hasAttemptedBefore: form.hasAttemptedBefore,
        dailyStudyTime: form.dailyStudyTime,
      };

      if (!skipDemographics) {
        if (form.age) payload.age = parseInt(form.age);
        if (form.gender) payload.gender = form.gender;
        if (form.city) payload.city = form.city;
        if (form.educationLevel) payload.educationLevel = form.educationLevel;
        if (form.incomeRange) payload.incomeRange = form.incomeRange;
      }

      const response = await api.post("/users/onboarding", payload);
      const result = response.data.data as {
        studyPersona: StudyPersona;
        onboardingComplete: boolean;
        user: typeof user;
      };

      if (accessToken && result.user) {
        setAuth(result.user, accessToken);
      } else if (result.user) {
        setUser(result.user);
      }

      toast.success("You're all set! Welcome to Code Zest.");
      router.push("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || !user || user.onboardingComplete) return null;

  return (
    <div className="bg-white/5 backdrop-blur-md text-white border border-white/10 shadow-2xl rounded-2xl p-8 sm:p-10 w-full">
      <ProgressBar step={step} total={4} />

      {/* ── Step 1: Goal ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold tracking-tight mb-1">Which exam are you targeting?</h2>
          <p className="text-slate-400 mb-8 text-sm">
            We&apos;ll personalise your preparation path around it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {EXAMS.map((exam) => (
              <SelectionCard
                key={exam.id}
                isSelected={form.targetExam.includes(exam.id)}
                onClick={() => setForm((p) => ({
                  ...p,
                  targetExam: p.targetExam.includes(exam.id)
                    ? p.targetExam.filter((e) => e !== exam.id)
                    : [...p.targetExam, exam.id]
                }))}
              >
                <div>
                  <span className={cn("font-bold text-base block", form.targetExam.includes(exam.id) ? "text-primary" : "text-white")}>
                    {exam.name}
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block">{exam.description}</span>
                </div>
              </SelectionCard>
            ))}
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-slate-300 mb-3">Target year</p>
            <div className="flex flex-wrap gap-2">
              {EXAM_YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, examYear: year }))}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 min-h-[44px]",
                    form.examYear === year
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-primary/40"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="h-12 px-8 text-base font-bold rounded-lg group"
            >
              Continue
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Situation ────────────────────────────────── */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold tracking-tight mb-1">What best describes you?</h2>
          <p className="text-slate-400 mb-8 text-sm">
            There are no wrong answers — this helps us show you what&apos;s most useful.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {SITUATIONS.map((s) => {
              const Icon = s.icon;
              return (
                <SelectionCard
                  key={s.id}
                  isSelected={form.situationId === s.id}
                  onClick={() => handleSituationSelect(s)}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    form.situationId === s.id ? "bg-primary/20" : "bg-white/8"
                  )}>
                    <Icon className={cn("w-5 h-5", form.situationId === s.id ? "text-primary" : "text-slate-400")} />
                  </div>
                  <div>
                    <span className={cn("font-bold text-base block", form.situationId === s.id ? "text-primary" : "text-white")}>
                      {s.label}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">{s.description}</span>
                  </div>
                </SelectionCard>
              );
            })}
          </div>

          {/* Occupation free text for repeat aspirants */}
          {form.situationId === "repeat" && (
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-300 block mb-2">
                What&apos;s your current occupation? <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                placeholder="e.g. Student, Software Engineer..."
                className="w-full h-12 px-4 rounded-xl bg-white/8 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/60 text-sm"
              />
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400 hover:text-white">
              <ChevronLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="h-12 px-8 text-base font-bold rounded-lg group"
            >
              Continue
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Time Commitment ──────────────────────────── */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold tracking-tight mb-1">How much time can you give daily?</h2>
          <p className="text-slate-400 mb-8 text-sm">
            Be realistic — we&apos;ll build a plan that actually fits your life.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {DAILY_TIMES.map((t) => {
              const Icon = t.icon;
              return (
                <SelectionCard
                  key={t.id}
                  isSelected={form.dailyStudyTime === t.id}
                  onClick={() => setForm((p) => ({ ...p, dailyStudyTime: t.id }))}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    form.dailyStudyTime === t.id ? "bg-primary/20" : "bg-white/8"
                  )}>
                    <Icon className={cn("w-5 h-5", form.dailyStudyTime === t.id ? "text-primary" : "text-slate-400")} />
                  </div>
                  <div>
                    <span className={cn("font-bold text-base block", form.dailyStudyTime === t.id ? "text-primary" : "text-white")}>
                      {t.label}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">{t.description}</span>
                  </div>
                </SelectionCard>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)} className="text-slate-400 hover:text-white">
              <ChevronLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button
              onClick={() => setStep(4)}
              disabled={!canProceedStep3}
              className="h-12 px-8 text-base font-bold rounded-lg group"
            >
              Continue
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4: About You (Optional) ────────────────────── */}
      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold tracking-tight mb-1">A little more about you</h2>
          <p className="text-slate-400 mb-8 text-sm">
            Totally optional — skip anytime. You can always fill this in your profile later.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Age</label>
              <input
                type="number"
                min={15}
                max={45}
                value={form.age}
                onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                placeholder="e.g. 22"
                className="w-full h-12 px-4 rounded-xl bg-white/8 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/60 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl bg-white/8 border border-white/10 text-white focus:outline-none focus:border-primary/60 text-sm appearance-none"
              >
                <option value="" className="bg-slate-900">Select...</option>
                <option value="MALE" className="bg-slate-900">Male</option>
                <option value="FEMALE" className="bg-slate-900">Female</option>
                <option value="OTHER" className="bg-slate-900">Other</option>
                <option value="PREFER_NOT_TO_SAY" className="bg-slate-900">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Education</label>
              <select
                value={form.educationLevel}
                onChange={(e) => setForm((p) => ({ ...p, educationLevel: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl bg-white/8 border border-white/10 text-white focus:outline-none focus:border-primary/60 text-sm appearance-none"
              >
                <option value="" className="bg-slate-900">Select...</option>
                <option value="HIGH_SCHOOL" className="bg-slate-900">High School</option>
                <option value="UNDERGRADUATE" className="bg-slate-900">Undergraduate</option>
                <option value="POSTGRADUATE" className="bg-slate-900">Postgraduate</option>
                <option value="OTHER" className="bg-slate-900">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                placeholder="e.g. Delhi"
                className="w-full h-12 px-4 rounded-xl bg-white/8 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/60 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Monthly Income / Family Income</label>
              <select
                value={form.incomeRange}
                onChange={(e) => setForm((p) => ({ ...p, incomeRange: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl bg-white/8 border border-white/10 text-white focus:outline-none focus:border-primary/60 text-sm appearance-none"
              >
                <option value="" className="bg-slate-900">Prefer not to say</option>
                <option value="< 3 LPA" className="bg-slate-900">{"< 3 LPA"}</option>
                <option value="3-6 LPA" className="bg-slate-900">3–6 LPA</option>
                <option value="6-10 LPA" className="bg-slate-900">6–10 LPA</option>
                <option value="> 10 LPA" className="bg-slate-900">{"> 10 LPA"}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(3)} className="text-slate-400 hover:text-white">
              <ChevronLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="text-slate-400 hover:text-white"
              >
                <SkipForward className="mr-2 w-4 h-4" />
                Skip for now
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="h-12 px-8 text-base font-bold rounded-lg"
              >
                {loading ? "Setting up..." : "Let's go! 🚀"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
