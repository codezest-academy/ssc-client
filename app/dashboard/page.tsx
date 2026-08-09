"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Book,
  ChevronRight,
  Flame,
  Zap,
  BarChart2,
  Clock,
  Trophy,
  ArrowRight,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, type StudyPersona } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  _count: {
    chapters: number;
  };
}

interface AnalyticsSummary {
  averageAccuracy: number;
  totalTests: number;
}

// ─── Persona Hero Components ──────────────────────────────────────────────────

function FullTimeHero({ userName }: { userName: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary))_0%,transparent_60%)]" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Today&apos;s Study Plan</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Good morning, {userName.split(" ")[0]}! 🎯
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg">
            You&apos;re on the <span className="text-foreground font-semibold">full preparation track</span>. Today&apos;s target: complete 2 lessons and 1 practice set to stay on schedule.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link href="/dashboard/subjects">
              <Button size="sm" className="rounded-xl font-semibold">
                Continue Learning <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/practice-sets">
              <Button size="sm" variant="outline" className="rounded-xl font-semibold">
                Practice Sets
              </Button>
            </Link>
          </div>
        </div>
        {/* Daily target chips */}
        <div className="flex md:flex-col gap-3 shrink-0">
          {[
            { label: "Lessons", target: 2, icon: Book, color: "bg-blue-100 text-blue-600" },
            { label: "Practice", target: 1, icon: Target, color: "bg-emerald-100 text-emerald-600" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.color)}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-bold text-foreground">0 / {item.target} done</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartTimeHero({ userName }: { userName: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-6 md:p-8">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_50%,hsl(38,92%,50%)_0%,transparent_60%)]" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Daily Quick Session</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Hey {userName.split(" ")[0]}, got 15 minutes? ⚡
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg">
            You&apos;re on the <span className="text-foreground font-semibold">balanced preparation track</span>. Short daily sessions are the key to consistency. Start with today&apos;s quick quiz.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link href="/dashboard/practice-sets">
              <Button size="sm" className="rounded-xl font-semibold bg-amber-600 hover:bg-amber-700 text-white border-none">
                Start Today&apos;s Quiz <Zap className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/mock-tests">
              <Button size="sm" variant="outline" className="rounded-xl font-semibold">
                Weekend Mock Tests
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex md:flex-col gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Today&apos;s target</p>
              <p className="text-sm font-bold text-foreground">15 min quiz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepeatHero({ userName, accuracy }: { userName: string; accuracy: number | null }) {
  const accuracyColor =
    accuracy === null ? "text-muted-foreground" :
    accuracy >= 70 ? "text-success" :
    accuracy >= 40 ? "text-warning" :
    "text-destructive";

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 p-6 md:p-8">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_80%_50%,hsl(270,70%,60%)_0%,transparent_60%)]" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Your Weak Areas</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Welcome back, {userName.split(" ")[0]}! 🔁
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg">
            You&apos;re on the <span className="text-foreground font-semibold">advanced track</span>. Focus on plugging the gaps — your overall accuracy is{" "}
            {accuracy !== null ? (
              <span className={cn("font-bold", accuracyColor)}>{Math.round(accuracy)}%</span>
            ) : (
              <span className="text-foreground font-semibold">not measured yet</span>
            )}
            . Take a mock test to see where you stand.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link href="/dashboard/mock-tests">
              <Button size="sm" className="rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white border-none">
                Advanced Mock Tests <Trophy className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button size="sm" variant="outline" className="rounded-xl font-semibold">
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
        {accuracy !== null && (
          <div className="flex md:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                accuracy >= 70 ? "bg-success/10" : accuracy >= 40 ? "bg-warning/10" : "bg-destructive/10"
              )}>
                <Target className={cn("w-4 h-4", accuracyColor)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall Accuracy</p>
                <p className={cn("text-sm font-bold", accuracyColor)}>{Math.round(accuracy)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonaHero({
  persona,
  userName,
  accuracy,
}: {
  persona: StudyPersona | null;
  userName: string;
  accuracy: number | null;
}) {
  if (persona === "REPEAT_ASPIRANT") {
    return <RepeatHero userName={userName} accuracy={accuracy} />;
  }
  if (persona === "PART_TIME_ASPIRANT") {
    return <PartTimeHero userName={userName} />;
  }
  // Default: FULL_TIME_ASPIRANT or null (not yet classified)
  return <FullTimeHero userName={userName} />;
}

// ─── Daily Target Button ──────────────────────────────────────────────────────

function DailyTargetButton() {
  const [generating, setGenerating] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Check if they already played today (basic check using lastActiveDate)
  const isCompletedToday = () => {
    if (!user?.lastActiveDate) return false;
    const lastActive = new Date(user.lastActiveDate);
    const today = new Date();
    return (
      lastActive.getDate() === today.getDate() &&
      lastActive.getMonth() === today.getMonth() &&
      lastActive.getFullYear() === today.getFullYear()
    );
  };

  const handleGenerate = async () => {
    if (isCompletedToday()) return; // Already done
    try {
      setGenerating(true);
      const res = await api.post("/attempts/daily");
      router.push(`/tests/attempt/${res.data.data.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to generate daily attempt");
      setGenerating(false);
    }
  };

  if (isCompletedToday()) {
    return (
      <div className="flex items-center gap-2 px-6 py-3 bg-success/10 text-success rounded-xl font-bold">
        <Target className="w-5 h-5" /> Completed!
      </div>
    );
  }

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={generating}
      className="rounded-xl px-8 py-6 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all"
    >
      {generating ? "Starting..." : "Start Daily Target"}
    </Button>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const load = async () => {
      try {
        const [subjectsRes, analyticsRes] = await Promise.allSettled([
          api.get("/subjects"),
          api.get("/analytics/dashboard"),
        ]);

        if (subjectsRes.status === "fulfilled") {
          setSubjects(subjectsRes.value.data.data);
        }
        if (analyticsRes.status === "fulfilled") {
          setAnalytics(analyticsRes.value.data.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const examLabel = user?.targetExam
    ? user.targetExam.replace(/_/g, " ")
    : null;

  return (
    <div className="space-y-8">
      {/* ── Persona-Aware Hero ──────────────────────────────── */}
      <PersonaHero
        persona={user?.studyPersona ?? null}
        userName={user?.name ?? "there"}
        accuracy={analytics?.averageAccuracy ?? null}
      />

      {/* ── Daily 10-Min Target Widget ──────────────────────── */}
      <div className="bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-transparent border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-600" />
            <h3 className="text-xl font-bold text-foreground tracking-tight">Daily 10-Min Target</h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Keep your streak alive! Complete today's dynamic 10-question practice set covering mixed topics to build your daily learning habit.
          </p>
        </div>
        <div className="shrink-0">
          <DailyTargetButton />
        </div>
      </div>

      {/* ── Subjects Section ────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              {examLabel ? `${examLabel} Curriculum` : "Your Subjects"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Pick up where you left off or start a new subject.
            </p>
          </div>
          {analytics && analytics.totalTests > 0 && (
            <Link href="/dashboard/analytics" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-muted-foreground text-center py-16 border-2 border-dashed border-border rounded-2xl">
            No subjects available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/dashboard/subjects/${subject.slug}`} className="block group">
                <Card className="h-full border-border hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 shadow-sm relative overflow-hidden rounded-xl">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <CardHeader>
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                      <Book className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                      {subject.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {subject.description || "Master the concepts of this subject."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground font-medium">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {subject._count.chapters} Chapters
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
