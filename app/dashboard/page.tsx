"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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
  Library,
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
  examTypes: string[];
  _count: {
    chapters: number;
  };
}

interface AnalyticsSummary {
  averageAccuracy: number;
  totalTests: number;
}

interface WeakTopic {
  id: string;
  name: string;
  subjectName: string;
  correct: number;
  total: number;
  accuracy: number;
}

interface DailyAgenda {
  persona: StudyPersona;
  targets: { lessons: number; practice: number };
  progress: { lessonsCompletedToday: number; practiceCompletedToday: number };
  nextLesson: {
    id: string;
    title: string;
    slug: string;
    type: string;
    chapterName: string;
    chapterSlug: string;
    subjectName: string;
    subjectSlug: string;
  } | null;
}

function FullTimeHero({ userName, agenda }: { userName: string, agenda: DailyAgenda | null }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-card border border-primary/10 p-5 md:p-6 shadow-sm group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-xl">
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Today&apos;s Plan</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-1.5">
            Good morning, {userName.split(" ")[0]}! ☀️
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            You&apos;re on the <span className="text-foreground font-bold">full track</span>. Today: {agenda?.targets.lessons || 2} lessons, {agenda?.targets.practice || 1} practice set.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Link href={agenda?.nextLesson ? `/dashboard/subjects/${agenda.nextLesson.subjectSlug}/chapters/${agenda.nextLesson.chapterSlug}/lessons/${agenda.nextLesson.slug}` : "/dashboard/subjects"}>
              <Button size="sm" variant="default" className="rounded-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Let&apos;s go! <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/practice-sets">
              <Button size="sm" variant="secondary" className="rounded-2xl font-bold hover:bg-secondary/80 transition-all">
                Practice
              </Button>
            </Link>
          </div>
        </div>
        {/* Daily target chips */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0">
          {[
            { label: "Lessons", target: agenda?.targets.lessons || 2, current: agenda?.progress.lessonsCompletedToday || 0, icon: Book },
            { label: "Practice", target: agenda?.targets.practice || 1, current: agenda?.progress.practiceCompletedToday || 0, icon: Target },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 min-w-[120px]">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                <p className="text-sm font-black text-foreground">{item.current}/{item.target}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartTimeHero({ userName, agenda }: { userName: string, agenda: DailyAgenda | null }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-card border border-primary/10 p-5 md:p-6 shadow-sm group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-xl">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Quick Session</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-1.5">
            Hey {userName.split(" ")[0]}, got 15 mins? ⚡
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            You&apos;re on the <span className="text-foreground font-bold">balanced track</span>. Short daily sessions are the key to consistency.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Link href="/dashboard/practice-sets">
              <Button size="sm" variant="default" className="rounded-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Start Quiz <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/mock-tests">
              <Button size="sm" variant="secondary" className="rounded-2xl font-bold hover:bg-secondary/80 transition-all">
                Mock Tests
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex md:flex-col gap-2 shrink-0">
          <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 min-w-[120px]">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Today&apos;s target</p>
              <p className="text-sm font-black text-foreground">
                {agenda?.progress.practiceCompletedToday ? "Done! 🎉" : "15 min quiz"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepeatHero({ userName, accuracy, agenda }: { userName: string; accuracy: number | null; agenda: DailyAgenda | null }) {
  const accuracyColor =
    accuracy === null ? "text-muted-foreground" :
    accuracy >= 70 ? "text-success" :
    accuracy >= 40 ? "text-warning" :
    "text-destructive";

  const accuracyBg = 
    accuracy === null ? "bg-muted" :
    accuracy >= 70 ? "bg-success/10" :
    accuracy >= 40 ? "bg-warning/10" :
    "bg-destructive/10";

  return (
    <div className="relative rounded-3xl overflow-hidden bg-card border border-primary/10 p-5 md:p-6 shadow-sm group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-1.5 rounded-xl">
              <BarChart2 className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Advanced Track</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-1.5">
            Welcome back, {userName.split(" ")[0]}! 🔁
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            Focus on plugging the gaps — your overall accuracy is{" "}
            {accuracy !== null ? (
              <span className={cn("font-bold", accuracyColor)}>{Math.round(accuracy)}%</span>
            ) : (
              <span className="text-foreground font-bold">not measured yet</span>
            )}
            .
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Link href="/dashboard/mock-tests">
              <Button size="sm" variant="default" className="rounded-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Mock Tests <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button size="sm" variant="secondary" className="rounded-2xl font-bold hover:bg-secondary/80 transition-all">
                Analytics
              </Button>
            </Link>
          </div>
        </div>
        {accuracy !== null && (
          <div className="flex md:flex-col gap-2 shrink-0">
            <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 min-w-[120px]">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", accuracyBg, accuracyColor)}>
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Accuracy</p>
                <p className={cn("text-sm font-black", accuracyColor)}>{Math.round(accuracy)}%</p>
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
  agenda,
}: {
  persona: StudyPersona | null;
  userName: string;
  accuracy: number | null;
  agenda: DailyAgenda | null;
}) {
  if (persona === "REPEAT_ASPIRANT") {
    return <RepeatHero userName={userName} accuracy={accuracy} agenda={agenda} />;
  }
  if (persona === "PART_TIME_ASPIRANT") {
    return <PartTimeHero userName={userName} agenda={agenda} />;
  }
  // Default: FULL_TIME_ASPIRANT or null (not yet classified)
  return <FullTimeHero userName={userName} agenda={agenda} />;
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
      <div className="flex items-center gap-2 px-5 py-2.5 bg-success/10 text-success rounded-2xl font-bold border border-success/20 shadow-sm">
        <Target className="w-4 h-4" /> Done!
      </div>
    );
  }

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={generating}
      className="rounded-2xl px-6 py-5 text-base font-extrabold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {generating ? "Starting..." : "Start Target"}
    </Button>
  );
}

// ─── Weak Topics Widget (Target 160+) ─────────────────────────────────────────

function WeakTopicsWidget({ weakTopics }: { weakTopics: WeakTopic[] }) {
  const router = useRouter();
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  if (!weakTopics || weakTopics.length === 0) return null;

  const handlePractice = async (chapterId: string) => {
    try {
      setGeneratingFor(chapterId);
      const res = await api.post("/attempts/pyq", {
        chapterId,
        limit: 10,
      });
      router.push(`/tests/attempt/${res.data.data.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to generate practice test");
      setGeneratingFor(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">Target 160+ Weak Areas</h3>
          <p className="text-muted-foreground text-sm mt-1">
            We analyzed your recent mock tests. Practice these topics to boost your score.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {weakTopics.map((topic) => (
          <div key={topic.id} className="bg-card border border-primary/10 rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-destructive px-2.5 py-1 bg-destructive/10 rounded-full">
                  {topic.accuracy}% Acc
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider line-clamp-1">{topic.subjectName}</span>
              </div>
              <h4 className="font-black text-foreground line-clamp-2 leading-tight" title={topic.name}>{topic.name}</h4>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {topic.correct} of {topic.total} correct
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-4 rounded-2xl font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handlePractice(topic.id)}
              disabled={generatingFor === topic.id}
            >
              {generatingFor === topic.id ? "Loading..." : "Practice"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

function SubjectCardSkeleton() {
  return (
    <div className="h-full bg-card border border-primary/10 rounded-3xl p-5 flex flex-col relative overflow-hidden">
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-muted animate-pulse rounded-2xl" />
        <div className="w-16 h-6 bg-muted animate-pulse rounded-xl" />
      </div>
      <div className="relative z-10 space-y-2 flex-1 mb-5">
        <div className="w-3/4 h-6 bg-muted animate-pulse rounded-md" />
        <div className="w-full h-4 bg-muted animate-pulse rounded-md mt-2" />
        <div className="w-5/6 h-4 bg-muted animate-pulse rounded-md" />
      </div>
      <div className="relative z-10 flex flex-col gap-2 mt-auto">
        <div className="flex justify-between items-end">
          <div className="w-16 h-3 bg-muted animate-pulse rounded-md" />
          <div className="w-6 h-3 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-2 w-full bg-muted animate-pulse rounded-full" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [agenda, setAgenda] = useState<DailyAgenda | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const load = async () => {
      try {
        const [subjectsRes, analyticsRes, weakTopicsRes, agendaRes] = await Promise.allSettled([
          api.get("/subjects"),
          api.get("/analytics/dashboard"),
          api.get("/analytics/weak-topics"),
          api.get("/dashboard/agenda"),
        ]);

        if (subjectsRes.status === "fulfilled") {
          setSubjects(subjectsRes.value.data.data);
        }
        if (analyticsRes.status === "fulfilled") {
          setAnalytics(analyticsRes.value.data.data);
        }
        if (weakTopicsRes.status === "fulfilled") {
          setWeakTopics(weakTopicsRes.value.data.data);
        }
        if (agendaRes.status === "fulfilled") {
          setAgenda(agendaRes.value.data.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const targetExams: string[] = Array.isArray(user?.targetExam)
    ? user.targetExam
    : typeof user?.targetExam === "string"
    ? [user.targetExam]
    : [];

  return (
    <div className="space-y-8">
      {/* ── Persona-Aware Hero ──────────────────────────────── */}
      <PersonaHero
        persona={user?.studyPersona ?? null}
        userName={user?.name ?? "there"}
        accuracy={analytics?.averageAccuracy ?? null}
        agenda={agenda}
      />

      {/* ── Daily 10-Min Target Widget ──────────────────────── */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-primary/10 p-1.5 rounded-xl">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-foreground tracking-tight">Daily 10-Min Target</h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
            Keep your streak alive! Complete today&apos;s dynamic 10-question practice set covering mixed topics.
          </p>
        </div>
        <div className="shrink-0 relative">
          <DailyTargetButton />
        </div>
      </div>

      {/* ── Weak Topics Widget ──────────────────────────────── */}
      <WeakTopicsWidget weakTopics={weakTopics} />

      {/* ── Subjects Section ────────────────────────────────── */}
      <div className="space-y-10">
        {loading ? (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="w-48 h-7 bg-muted animate-pulse rounded-md mb-2" />
                <div className="w-64 h-4 bg-muted animate-pulse rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <SubjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : subjects.length === 0 ? (
          <EmptyState 
            icon={Library}
            title="No subjects available"
            description="Subjects for your selected target exams will appear here."
          />
        ) : targetExams.length === 0 ? (
          <EmptyState 
            icon={Target}
            title="No target exam selected"
            description="Please update your profile and select a target exam to see your curriculum."
          />
        ) : (
          targetExams.map((exam) => {
            const examLabel = exam.replace(/_/g, " ");
            const examSubjects = subjects.filter((subject) => subject.examTypes?.includes(exam));

            if (examSubjects.length === 0) return null;

            return (
              <div key={exam}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight">
                      {examLabel} Curriculum
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {examSubjects.map((subject) => (
                    <Link key={subject.id} href={`/dashboard/subjects/${subject.slug}?exam=${exam}`} className="block group">
                      <div className="h-full bg-card border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-3xl p-5 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0 group-hover:bg-primary/10 transition-colors" />
                        <div className="relative z-10 flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm">
                            <Book className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="bg-muted/50 backdrop-blur-sm border border-border/50 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                             <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                             <span className="text-[10px] font-bold text-muted-foreground uppercase">{subject._count.chapters} Ch</span>
                          </div>
                        </div>
                        <div className="relative z-10 space-y-1.5 flex-1 mb-5">
                          <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {subject.name}
                          </h3>
                          <p className="line-clamp-2 text-xs text-muted-foreground font-medium leading-relaxed">
                            {subject.description || "Master the concepts of this subject."}
                          </p>
                        </div>
                        <div className="relative z-10 flex flex-col gap-2 mt-auto">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Progress</span>
                            <span className="text-xs font-black text-primary">0%</span>
                          </div>
                          <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)] w-0" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
