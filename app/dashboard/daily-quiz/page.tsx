"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Zap,
  CheckCircle2,
  Flame,
  Trophy,
  BookOpen,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// ─── Types ─────────────────────────────────────────────────────────────────

interface QuizOption {
  key: string;
  text: string;
  rationale: string | null;
}

interface DailyQuizQuestion {
  id: string;
  content: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options: QuizOption[];
  correctOption: string;
  subjectId: string;
  chapterId: string;
}

interface DailyQuiz {
  id: string;
  title: string;
  description: string | null;
  date: string;
  questions: DailyQuizQuestion[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<
  DailyQuizQuestion["difficulty"],
  { label: string; className: string }
> = {
  EASY:   { label: "Easy",   className: "text-success bg-success/10"         },
  MEDIUM: { label: "Medium", className: "text-warning bg-warning/10"         },
  HARD:   { label: "Hard",   className: "text-destructive bg-destructive/10" },
};

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function DailyQuizSkeleton() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-48 w-full rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DailyQuizPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [starting, setStarting] = useState(false);

  // Infer "already completed today" from lastActiveDate on the user object.
  // The API has no dedicated hasTakenToday flag; we compare calendar days.
  const completedToday =
    user?.lastActiveDate != null &&
    isSameCalendarDay(new Date(user.lastActiveDate), new Date());

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data: DailyQuiz }>("/daily-quiz/today");
      setQuiz(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        new Error(e.response?.data?.message ?? e.message ?? "Failed to load today's quiz")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await fetchQuiz(); })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startQuiz = async () => {
    if (!quiz) return;
    try {
      setStarting(true);
      const res = await api.post<{ data: { id: string } }>(
        "/attempts/daily-quiz/start",
        { dailyQuizId: quiz.id }
      );
      router.push(`/tests/attempt/${res.data.data.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        new Error(e.response?.data?.message ?? e.message ?? "Failed to start quiz")
      );
      setStarting(false);
    }
  };

  // ── Loading ──
  if (loading) return <DailyQuizSkeleton />;

  // ── Error ──
  if (error) {
    return (
      <ErrorState
        title="Couldn't load today's quiz"
        description={error.message}
        retry={() => { setError(null); fetchQuiz(); }}
      />
    );
  }

  // ── No quiz (shouldn't happen — API auto-generates on request) ──
  if (!quiz) {
    return (
      <EmptyState
        icon={Zap}
        title="No quiz available"
        description="Today's Daily Challenge hasn't been generated yet. Check back in a moment."
        action={
          <Button onClick={() => fetchQuiz()} variant="default" className="rounded-full px-6">
            Retry
          </Button>
        }
      />
    );
  }

  const quizDate = new Date(quiz.date);
  const difficultyCount = quiz.questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-20">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display tracking-tight flex items-center gap-3">
          <span className="bg-warning/10 text-warning p-2 rounded-2xl">
            <Zap className="w-6 h-6" />
          </span>
          Daily 10-Minute Challenge
        </h1>
        <p className="text-muted-foreground mt-2">
          {format(quizDate, "EEEE, d MMMM yyyy")} · 10 questions · ~10 minutes
        </p>
      </div>

      {/* ── Hero Card ── */}
      <Card
        className={cn(
          "rounded-3xl border shadow-sm relative overflow-hidden",
          completedToday
            ? "border-success/30 bg-success/5"
            : "border-warning/20 bg-warning/5"
        )}
      >
        {/* Decorative ambient glow */}
        <div
          className={cn(
            "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20",
            completedToday ? "bg-success" : "bg-warning"
          )}
        />

        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Left — status + title */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                {completedToday ? (
                  <span className="flex items-center gap-2 text-success font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" />
                    Completed Today!
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-warning font-bold text-lg">
                    <Flame className="w-6 h-6 fill-warning/50" />
                    Ready to attempt
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-foreground tracking-tight">
                {quiz.title}
              </h2>

              {quiz.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {quiz.description}
                </p>
              )}

              {/* Meta stats */}
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>~10 minutes</span>
                </div>
                {(["EASY", "MEDIUM", "HARD"] as const).map((d) =>
                  difficultyCount[d] ? (
                    <span
                      key={d}
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        DIFFICULTY_STYLES[d].className
                      )}
                    >
                      {difficultyCount[d]} {DIFFICULTY_STYLES[d].label}
                    </span>
                  ) : null
                )}
              </div>
            </div>

            {/* Right — CTA buttons */}
            <div className="shrink-0 flex flex-col gap-3">
              <Button
                id="daily-quiz-start-btn"
                size="lg"
                onClick={startQuiz}
                disabled={starting}
                className={cn(
                  "rounded-2xl px-8 h-14 text-base font-extrabold shadow-md hover:-translate-y-0.5 transition-all",
                  completedToday && "opacity-70"
                )}
              >
                {starting ? (
                  "Starting…"
                ) : completedToday ? (
                  <><CheckCircle2 className="w-5 h-5 mr-2" />Retake Challenge</>
                ) : (
                  <><Zap className="w-5 h-5 mr-2" />Start Challenge</>
                )}
              </Button>

              {completedToday && (
                <Button variant="outline" className="rounded-2xl" asChild>
                  <Link href="/dashboard/analytics">
                    <Trophy className="w-4 h-4 mr-2" />
                    View My Analytics
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Question Preview Grid ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Today&apos;s Questions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            A preview of today&apos;s topics — correct answers are revealed after you submit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quiz.questions.map((q, idx) => (
            <div
              key={q.id}
              className="flex items-start gap-3 p-4 bg-card border border-border/60 hover:border-primary/20 hover:bg-muted/30 transition-colors rounded-2xl"
            >
              {/* Question number badge */}
              <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
                {idx + 1}
              </div>

              {/* Content preview — strip HTML for plain text */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                  {q.content.replace(/<[^>]*>/g, "").trim() || `Question ${idx + 1}`}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                      DIFFICULTY_STYLES[q.difficulty].className
                    )}
                  >
                    {DIFFICULTY_STYLES[q.difficulty].label}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {q.options.length} options
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground flex-1">
          Daily challenges refresh at <strong className="text-foreground">midnight UTC</strong>.
          Complete every day to build your streak! 🔥
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/dashboard/gamification">
              <Trophy className="w-4 h-4 mr-2" />
              My Rank
            </Link>
          </Button>
          <Button
            size="default"
            onClick={startQuiz}
            disabled={starting}
            className="rounded-full font-bold"
          >
            {starting ? "Starting…" : completedToday ? "Retake" : "Start Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
