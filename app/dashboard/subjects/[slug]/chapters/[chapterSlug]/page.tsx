"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, FileText, File, ArrowLeft, ChevronRight, Clock, CheckCircle2, VideoOff, FileQuestion, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { PremiumLockScreen } from "@/components/ui/premium-lock-screen";
import { useAuthStore } from "@/store/auth";

interface LessonProgress {
  watchedSeconds: number;
  completedAt: string | null;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "VIDEO" | "ARTICLE" | "PDF";
  duration: number;
  isPremium: boolean;
  order: number;
  progress?: LessonProgress[];
}

interface PracticeSet {
  id: string;
  title: string;
  _count?: {
    questions: number;
  };
}

interface Chapter {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  accessTier: string;
  practiceSets?: PracticeSet[];
  _count?: {
    lessons: number;
    practiceSets: number;
  };
}

interface SubjectDetails {
  slug: string;
  name: string;
  chapters: Chapter[];
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const chapterSlug = params?.chapterSlug as string;
  
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  const fetchData = async () => {
    if (!slug || !chapterSlug) return;
    try {
      // Step 1: Subject is public — get chapter list + basic chapter data
      const subjectRes = await api.get(`/subjects/${slug}`);
      const subjectData = subjectRes.data.data;
      setSubject(subjectData);

      const currentChapter = subjectData.chapters.find((c: Chapter) => c.slug === chapterSlug);
      if (!currentChapter) return;

      // Set chapter from subject data immediately (works even if locked)
      setChapter(currentChapter);

      // Step 2: Try to fetch full chapter detail (practice sets etc.)
      // This will 403 for PRO chapters — catch separately, don't crash
      try {
        const chapterRes = await api.get(`/chapters/${currentChapter.id}`);
        setChapter(chapterRes.data.data);
      } catch (chapterErr: unknown) {
        const status = (chapterErr as { response?: { status?: number } })?.response?.status;
        if (status === 403) {
          setIsForbidden(true);
          return; // No point fetching lessons either
        }
        throw chapterErr; // Re-throw unexpected errors
      }

      // Step 3: Fetch lessons (also gated, will 403 for locked chapters)
      try {
        const lessonsRes = await api.get(`/lessons/chapter/${currentChapter.id}`);
        setLessons(lessonsRes.data.data);
      } catch (lessonsErr: unknown) {
        const status = (lessonsErr as { response?: { status?: number } })?.response?.status;
        if (status === 403) {
          setIsForbidden(true);
        } else {
          throw lessonsErr;
        }
      }
    } catch (err: unknown) {
      console.error("Failed to load chapter data:", err);
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        setIsForbidden(true);
      } else {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          ?? (err instanceof Error ? err.message : "Failed to load chapter data");
        setError(new Error(message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    (async () => {


      await fetchData();


    })();


  }, [slug, chapterSlug]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load chapter data" 
        description={error.message} 
        retry={() => {
          setLoading(true);
          setError(null);
          fetchData();
        }} 
      />
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Chapter not found</h3>
        <Button onClick={() => router.push(`/dashboard/subjects/${slug}`)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subject
        </Button>
      </div>
    );
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <VideoOff className="w-5 h-5" />;
      case "DOCUMENT": return <FileText className="w-5 h-5" />;
      case "QUIZ": return <FileQuestion className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const getLessonColor = (type: string) => {
    switch (type) {
      case "VIDEO": return "bg-info/10 text-info";
      case "DOCUMENT": return "bg-success/10 text-success";
      case "QUIZ": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
          <Link href={`/dashboard/subjects/${slug}`} className="hover:text-primary transition-colors">{subject?.name || "Subject"}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">{chapter.name}</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{chapter.name}</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <p className="text-slate-500 max-w-2xl">{chapter.description}</p>
          
          {/* Resume Learning Button */}
          {lessons.length > 0 && (
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2 rounded-full shadow-md"
              onClick={() => {
                // Find first incomplete lesson
                const firstIncomplete = lessons.find(l => !l.progress?.[0]?.completedAt);
                const targetLesson = firstIncomplete || lessons[0];
                router.push(`/learn/${slug}/${chapter.slug}/${targetLesson.slug}`);
              }}
            >
              <PlayCircle className="w-5 h-5" />
              {lessons.some(l => l.progress?.[0]?.completedAt) ? "Resume Learning" : "Start Chapter"}
            </Button>
          )}
        </div>
      </div>

      <div className="relative mt-8">
        {isForbidden && (
          <div className="mb-6">
            <PremiumLockScreen 
              backUrl={`/dashboard/subjects/${slug}`} 
              chapterId={chapter?.id}
              videoCount={chapter?._count?.lessons}
            />
          </div>
        )}

        <div className={cn(isForbidden && "opacity-50 pointer-events-none select-none filter blur-[1px]")}>
          {isForbidden ? (
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-card">
              {[
                { title: "Core Concepts & Fundamentals", min: "15 min", type: "Video Lesson" },
                { title: "Advanced Problem Solving Techniques", min: "25 min", type: "Video Lesson" },
                { title: "Practice Exercises & Walkthroughs", min: "30 min", type: "PDF + Quiz" },
              ].map((lesson, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/30">
                  <span className="text-sm font-bold tabular-nums w-7 text-center text-muted-foreground/40 shrink-0">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-muted-foreground line-clamp-1">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{lesson.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.min}</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                </div>
              ))}
            </div>
          ) : lessons.length === 0 ? (
            <EmptyState 
              icon={FileText}
              title="No lessons available"
              description="Check back later for new content in this chapter."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson, index) => {
              const isCompleted = lesson.progress?.[0]?.completedAt != null;
              return (
                <Link key={lesson.id} href={`/learn/${slug}/${chapter.slug}/${lesson.slug}`} className="group block h-full">
                  <Card className={cn(
                    "h-full border-border hover:border-primary/50 transition-colors shadow-sm rounded-xl overflow-hidden flex flex-col",
                    isCompleted ? "bg-success/5 border-success/20" : "bg-card"
                  )}>
                    <CardContent className="p-5 flex flex-col h-full gap-4">
                      {/* Top Row: Title & Number */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {lesson.title}
                            </h3>
                            {lesson.isPremium && (
                              <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-bold uppercase tracking-wider shrink-0">Premium</span>
                            )}
                          </div>
                        </div>
                        <span className="text-4xl font-black text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors shrink-0 leading-none">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <div className="flex-1 min-w-0">
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                        )}
                      </div>
                      
                      {/* Footer: Metadata & Action */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {lesson.duration ? `${Math.floor(lesson.duration / 60)} mins` : lesson.type === 'ARTICLE' ? 'Read' : 'Video'}
                          </div>
                          <div className="flex items-center">
                            {isCompleted ? (
                              <span className="flex items-center text-success">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 mr-2" /> Not started
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0",
                          isCompleted ? "bg-success/10 text-success" : "bg-accent text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>

      {chapter.practiceSets && chapter.practiceSets.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-foreground">Practice Sets</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapter.practiceSets.map((set) => {
              // Extract the first exam type from the subject if available to apply the exam color system.
              // We'll fallback to primary if not found.
              const examColorClass = subject?.slug?.includes("cgl") ? "bg-[oklch(var(--exam-cgl)/0.1)] text-[oklch(var(--exam-cgl))]" :
                                     subject?.slug?.includes("chsl") ? "bg-[oklch(var(--exam-chsl)/0.1)] text-[oklch(var(--exam-chsl))]" :
                                     "bg-primary/10 text-primary";
              const borderClass = subject?.slug?.includes("cgl") ? "border-[oklch(var(--exam-cgl)/0.3)]" :
                                  subject?.slug?.includes("chsl") ? "border-[oklch(var(--exam-chsl)/0.3)]" :
                                  "border-primary/30";

              return (
                <Card key={set.id} className="group hover:shadow-md transition-all border-border/40 overflow-hidden relative flex flex-col">
                  {/* Decorative Exam Colored Top Bar */}
                  <div className={cn("h-1.5 w-full", examColorClass.split(" ")[0])} />
                  
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", examColorClass)}>
                        <FileQuestion className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{set.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {set._count?.questions || 0} Questions
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2 h-10">
                      Test your understanding of the concepts covered in this chapter.
                    </p>
                    
                    <div className="flex items-center justify-end mt-4 pt-4 border-t">
                      <Link href={`/tests/overview/${set.id}`}>
                        <Button size="sm" className="gap-2 group-hover:bg-primary transition-colors">
                          Take Test <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
