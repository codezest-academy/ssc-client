"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, FileText, File, ArrowLeft, ChevronRight, Clock, CheckCircle2, VideoOff, FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

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
  practiceSets?: PracticeSet[];
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

  const fetchData = async () => {
    if (!slug || !chapterSlug) return;
    try {
      setLoading(true);
      setError(null);
      // Fetch subject to get chapter info (since chapters are public through subjects)
      const subjectRes = await api.get(`/subjects/${slug}`);
      const subjectData = subjectRes.data.data;
      setSubject(subjectData);
      
      const currentChapter = subjectData.chapters.find((c: Chapter) => c.slug === chapterSlug);
      if (currentChapter) {
        setChapter(currentChapter);
      }

      // Fetch lessons for this chapter
      if (currentChapter) {
        const lessonsRes = await api.get(`/lessons/chapter/${currentChapter.id}`);
        setLessons(lessonsRes.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load chapter data:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load chapter data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        retry={fetchData} 
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

      <div className="space-y-4">
        {lessons.length === 0 ? (
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
