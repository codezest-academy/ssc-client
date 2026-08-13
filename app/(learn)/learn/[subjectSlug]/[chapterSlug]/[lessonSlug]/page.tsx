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
import { MdxRenderer } from "@/components/ui/learning/mdx-renderer";
import { TableOfContents } from "@/components/ui/learning/table-of-contents";
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
        router.push(`/learn/${subjectSlug}/${chapterSlug}/${nextLesson.slug}`);
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
  const isFinalPage = articlePages.length === 0 || currentPage === articlePages.length - 1;

  // Helper to extract a title from MDX content for the sidebar
  const getPageTitle = (source: string, index: number) => {
    const mdMatch = source.match(/^(#{1,3})\s+(.+)$/m);
    if (mdMatch) return mdMatch[2].replace(/[\[\]_*\`]/g, '').trim();
    
    const htmlMatch = source.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/i);
    if (htmlMatch) {
      return htmlMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    return `Page ${index + 1}`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <PlayCircle className="w-4 h-4" />;
      case "ARTICLE": return <FileText className="w-4 h-4" />;
      case "PDF": return <FileBadge className="w-4 h-4" />;
      default: return <PlayCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex w-full max-w-7xl mx-auto px-4 md:px-8 gap-8 lg:gap-12 pb-12 pt-6 justify-start">
      {/* Left Column: Course Sidebar (Desktop) */}
      <div className="hidden lg:flex flex-col w-72 shrink-0">
        <div className="sticky top-32 space-y-6">
          {chapterLessons && chapterLessons.length > 1 && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">{lesson.chapter?.name}</h3>
              <div className="flex flex-col gap-1">
                {chapterLessons?.map((l, index) => {
                  const isCurrent = l.slug === lesson.slug;
                  const isFinished = !!l.progress?.[0]?.completedAt;
                  return (
                    <Link
                      key={l.id}
                      href={`/learn/${subjectSlug}/${chapterSlug}/${l.slug}`}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                        isCurrent 
                          ? "bg-slate-100 text-slate-900" 
                          : "hover:bg-slate-50 text-slate-600"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border",
                        isFinished 
                          ? "bg-emerald-100 border-emerald-200 text-emerald-600" 
                          : isCurrent 
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-transparent border-slate-300 text-slate-400"
                      )}>
                        {isFinished ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm leading-snug font-medium", isCurrent ? "text-primary" : "text-slate-700")}>
                          {l.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Page Navigation */}
          {lesson.type === "ARTICLE" && articlePages.length > 1 && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">On This Topic</h3>
              <div className="flex flex-col gap-1">
                {articlePages.map((pageSource, idx) => {
                  const title = getPageTitle(pageSource, idx);
                  const isCurrent = currentPage === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentPage(idx);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 text-left",
                        isCurrent 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "hover:bg-slate-50 text-slate-600"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold",
                        isCurrent ? "bg-primary text-white border-primary" : "border-slate-300 text-slate-400"
                      )}>
                        {idx + 1}
                      </div>
                      <span className="flex-1 text-sm line-clamp-2">
                        {title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Column: Main Content */}
      <div className="flex-1 w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-10 lg:p-12 relative">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
          <Link href={`/learn/${subjectSlug}`} className="hover:text-primary transition-colors">{lesson.subject?.name}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">{lesson.chapter?.name}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">{lesson.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                {lesson.title}
              </h1>
              {!lesson.isFree && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full mt-2 md:mt-0">
                  Premium
                </span>
              )}
            </div>
            
            {/* Top Completion Toggle */}
            {hasAccess && (
              <div className="flex items-center shrink-0">
                {isCompleted ? (
                  <Button
                    variant="outline"
                    onClick={toggleCompletion}
                    className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 shadow-sm transition-colors rounded-full px-4"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Completed
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleMarkComplete}
                    disabled={markCompleteMutation.isPending}
                    className="shadow-sm hover:bg-slate-50 text-slate-600 transition-colors rounded-full px-4"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-slate-400" /> Mark as Complete
                  </Button>
                )}
              </div>
            )}
          </div>
          {lesson.description && <p className="text-slate-500 text-xl leading-relaxed">{lesson.description}</p>}
        </div>

        {/* Lesson Content Area */}
        {!hasAccess ? (
          <PaywallGate contentType="Lesson" title={`Unlock "${lesson.title}"`} />
        ) : (
          <div className="flex flex-col">
            {lesson.type === "VIDEO" && lesson.videoUrl ? (
              <div className="aspect-video w-full bg-black rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : lesson.type === "ARTICLE" && articlePages.length > 0 ? (
              <div className="flex flex-col min-h-[200px]">
                <MdxRenderer source={articlePages[currentPage]} />
              </div>
            ) : lesson.type === "PDF" && lesson.pdfUrl ? (
              <div className="w-full h-[80vh] rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
                <iframe
                  src={lesson.pdfUrl}
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                />
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                Content not available for this lesson.
              </div>
            )}
            
            {/* Unified Bottom Action / Pagination Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-t border-slate-200 mt-8">
              
              {/* Left Side: Page Indicator (only if paginated) */}
              <div className="flex items-center">
                {lesson.type === "ARTICLE" && articlePages.length > 1 && (
                  <span className="text-sm font-medium text-slate-500">
                    Page {currentPage + 1} of {articlePages.length}
                  </span>
                )}
              </div>

              {/* Right Side: Navigation Buttons */}
              <div className="flex items-center gap-3">
                {/* Previous Button */}
                {lesson.type === "ARTICLE" && articlePages.length > 1 && currentPage > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentPage(prev => Math.max(0, prev - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Previous
                  </Button>
                )}

                {/* Next Button or Mark Complete */}
                {!isFinalPage ? (
                  <Button 
                    onClick={() => {
                      setCurrentPage(prev => Math.min(articlePages.length - 1, prev + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    variant={isCompleted ? "secondary" : "default"}
                    disabled={markCompleteMutation.isPending}
                    onClick={() => {
                      // Mark complete if not already, then proceed to next logical step
                      if (!isCompleted) markCompleteMutation.mutate(isCompleted);
                      // TODO: Navigate to next chapter/lesson
                    }}
                  >
                    {isCompleted ? "Continue to Next" : "Mark Complete & Continue"} <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
