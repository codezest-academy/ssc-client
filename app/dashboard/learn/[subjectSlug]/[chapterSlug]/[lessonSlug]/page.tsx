"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, FileBadge } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { QuestionRenderer } from "@/components/ui/question-renderer";
import { useAuthStore } from "@/store/auth";
import { PaywallGate } from "@/components/ui/paywall-gate";
import { ErrorState } from "@/components/ui/error-state";

interface LessonProgress {
  watchedSeconds: number;
  completedAt: string | null;
}

interface Chapter {
  id: string;
  name: string;
}

interface Subject {
  slug: string;
  name: string;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "VIDEO" | "ARTICLE" | "PDF";
  videoUrl?: string;
  articleHtml?: string;
  pdfUrl?: string;
  duration: number;
  isFree: boolean;
  chapter: Chapter;
  subject: Subject;
  progress?: LessonProgress[];
}

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const subjectSlug = params?.subjectSlug as string;
  const chapterSlug = params?.chapterSlug as string;
  const lessonSlug = params?.lessonSlug as string;
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const [currentPage, setCurrentPage] = useState(0);

  const { data: lesson, isLoading: loading, error: lessonError, refetch: refetchLesson } = useQuery<Lesson>({
    queryKey: ["lesson", subjectSlug, chapterSlug, lessonSlug],
    queryFn: async () => {
      const response = await api.get(`/lessons/learn/${subjectSlug}/${chapterSlug}/${lessonSlug}`);
      return response.data.data;
    },
    enabled: !!subjectSlug && !!chapterSlug && !!lessonSlug,
  });

  const articlePages = useMemo(() => {
    if (lesson?.type !== "ARTICLE" || !lesson?.articleHtml) return [];
    return lesson.articleHtml.split(/<hr\s*\/?>/i).map(page => page.trim()).filter(Boolean);
  }, [lesson?.articleHtml, lesson?.type]);

  useEffect(() => {
    setCurrentPage(0);
  }, [lesson?.id]);

  const { data: chapterLessons } = useQuery<Lesson[]>({
    queryKey: ["chapter-lessons", lesson?.chapter.id],
    queryFn: async () => {
      const response = await api.get(`/lessons/chapter/${lesson!.chapter.id}`);
      return response.data.data;
    },
    enabled: !!lesson?.chapter.id,
  });

  const markCompleteMutation = useMutation({
    mutationFn: async (isCompleted: boolean) => {
      if (!lesson) return;
      await api.post(`/lessons/${lesson.id}/progress`, {
        isCompleted: !isCompleted,
      });
    },
    onMutate: async (isCompleted) => {
      if (!lesson) return;
      await queryClient.cancelQueries({ queryKey: ["lesson", subjectSlug, chapterSlug, lessonSlug] });
      const previousLesson = queryClient.getQueryData<Lesson>(["lesson", subjectSlug, chapterSlug, lessonSlug]);

      // Optimistically update
      if (previousLesson) {
        queryClient.setQueryData<Lesson>(["lesson", subjectSlug, chapterSlug, lessonSlug], {
          ...previousLesson,
          progress: [
            {
              watchedSeconds: previousLesson.progress?.[0]?.watchedSeconds || 0,
              completedAt: !isCompleted ? new Date().toISOString() : null,
            },
          ],
        });
      }
      return { previousLesson };
    },
    onError: (err, newStatus, context) => {
      if (context?.previousLesson) {
        queryClient.setQueryData(["lesson", subjectSlug, chapterSlug, lessonSlug], context.previousLesson);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", subjectSlug, chapterSlug, lessonSlug] });
    },
  });

  const handleMarkComplete = () => {
    if (!lesson) return;
    const isCompleted = !!lesson.progress?.[0]?.completedAt;
    
    if (!isCompleted) {
      markCompleteMutation.mutate(false); // Mark as complete
    }
    
    // Auto-advance
    if (chapterLessons) {
      const currentIndex = chapterLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex !== -1 && currentIndex < chapterLessons.length - 1) {
        const nextLesson = chapterLessons[currentIndex + 1];
        router.push(`/dashboard/learn/${subjectSlug}/${chapterSlug}/${nextLesson.slug}`);
      } else {
        router.push(`/dashboard/subjects/${subjectSlug}/chapters/${chapterSlug}`);
      }
    }
  };

  const toggleCompletion = () => {
    if (!lesson) return;
    const isCompleted = !!lesson.progress?.[0]?.completedAt;
    markCompleteMutation.mutate(isCompleted);
  };

  if (loading) {
    return <div className="text-slate-400 p-8">Loading lesson...</div>;
  }

  if (lessonError) {
    return (
      <ErrorState 
        title="Failed to load lesson" 
        description={(lessonError as Error).message || "An error occurred while loading the lesson."} 
        retry={() => refetchLesson()} 
      />
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Lesson not found</h3>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const isCompleted = !!lesson.progress?.[0]?.completedAt;
  const hasAccess = lesson.isFree || (user && user.subscriptionTier !== "FREE");
  const isFinalPage = lesson.type !== "ARTICLE" || articlePages.length === 0 || currentPage === articlePages.length - 1;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <PlayCircle className="w-4 h-4" />;
      case "ARTICLE": return <FileText className="w-4 h-4" />;
      case "PDF": return <FileBadge className="w-4 h-4" />;
      default: return <PlayCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <span className="text-slate-300">/</span>
        <Link href={`/dashboard/subjects/${lesson.subject?.slug}`} className="hover:text-primary transition-colors">
          {lesson.subject?.name || "Subject"}
        </Link>
        <span className="text-slate-300">/</span>
        <Link href={`/dashboard/subjects/${lesson.subject?.slug}/chapters/${lesson.chapter?.id}`} className="hover:text-primary transition-colors">
          {lesson.chapter?.name || "Chapter"}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 truncate">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{lesson.title}</h1>
          {lesson.description && <p className="text-slate-500 text-lg">{lesson.description}</p>}
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0 mt-1">
          {!lesson.isFree && (
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1 border border-amber-200">
              Premium
            </span>
          )}
          {hasAccess && (
            <Button
              variant={isCompleted ? "secondary" : "outline"}
              size="sm"
              onClick={toggleCompletion}
              disabled={markCompleteMutation.isPending}
              className={cn(
                "rounded-full transition-all duration-200 shadow-sm font-medium",
                isCompleted 
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              )}
            >
              {isCompleted ? (
                <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Completed</>
              ) : (
                <><Circle className="w-4 h-4 mr-1.5 text-slate-400" /> Mark as Complete</>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Lesson Content Area */}
      {!hasAccess ? (
        <PaywallGate contentType="Lesson" title={`Unlock "${lesson.title}"`} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-border overflow-hidden min-h-[500px]">
            {lesson.type === "VIDEO" && lesson.videoUrl ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : lesson.type === "ARTICLE" && articlePages.length > 0 ? (
              <div className="flex flex-col h-full min-h-full">
                <div className="flex-1 p-8 md:p-12 lg:p-16 prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-p:text-slate-600 prose-li:marker:text-primary prose-li:text-slate-600 prose-strong:text-slate-900 prose-hr:border-border">
                  <QuestionRenderer content={articlePages[currentPage]} />
                </div>
                {/* Pagination Footer */}
                <div className="flex items-center justify-between p-6 border-t border-border bg-slate-50 mt-auto rounded-b-2xl">
                  {articlePages.length > 1 ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                  ) : <div></div>}
                  
                  {articlePages.length > 1 && (
                    <span className="text-sm font-medium text-slate-500">
                      Page {currentPage + 1} of {articlePages.length}
                    </span>
                  )}

                  {isFinalPage ? (
                    <div className="flex items-center gap-3">
                      {isCompleted && (
                        <Button
                          variant="ghost"
                          onClick={toggleCompletion}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
                        </Button>
                      )}
                      <Button
                        onClick={handleMarkComplete}
                        disabled={markCompleteMutation.isPending}
                        className={isCompleted ? "bg-slate-900 hover:bg-slate-800" : ""}
                      >
                        {isCompleted ? "Continue" : "Complete & Continue"} <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setCurrentPage(prev => Math.min(articlePages.length - 1, prev + 1))}
                    >
                      Next <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  )}
                </div>
              </div>
            ) : lesson.type === "PDF" && lesson.pdfUrl ? (
              <div className="w-full h-[80vh]">
                <iframe
                  src={lesson.pdfUrl}
                  className="w-full h-full border-0 rounded-t-2xl"
                  title="PDF Viewer"
                />
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                Content not available for this lesson.
              </div>
            )}
            
            {/* Video/PDF Action Bar */}
            {lesson.type !== "ARTICLE" && (
              <div className="flex items-center justify-end p-6 border-t border-border bg-slate-50 mt-auto rounded-b-2xl">
                <div className="flex items-center gap-3">
                  {isCompleted && (
                    <Button
                      variant="ghost"
                      onClick={toggleCompletion}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
                    </Button>
                  )}
                  <Button
                    onClick={handleMarkComplete}
                    disabled={markCompleteMutation.isPending}
                    className={isCompleted ? "bg-slate-900 hover:bg-slate-800" : ""}
                  >
                    {isCompleted ? "Continue" : "Complete & Continue"} <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Course Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-4">
              <h3 className="font-semibold text-slate-900 mb-4">{lesson.chapter?.name}</h3>
              <div className="flex flex-col gap-2">
                {chapterLessons?.map((l, index) => {
                  const isCurrent = l.slug === lesson.slug;
                  const isFinished = !!l.progress?.[0]?.completedAt;
                  return (
                    <Link
                      key={l.id}
                      href={`/dashboard/learn/${subjectSlug}/${chapterSlug}/${l.slug}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors",
                        isCurrent ? "bg-primary/10 border border-primary/20" : "hover:bg-slate-50 border border-transparent"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border",
                        isFinished 
                          ? "bg-emerald-100 border-emerald-200 text-emerald-600" 
                          : isCurrent 
                            ? "bg-primary text-white border-primary"
                            : "bg-slate-100 border-slate-200 text-slate-400"
                      )}>
                        {isFinished ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-medium">{index + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm truncate font-medium", isCurrent ? "text-primary" : "text-slate-700")}>
                          {l.title}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          {getLessonIcon(l.type)}
                          <span>{l.type === "VIDEO" ? `${l.duration} min` : l.type}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
