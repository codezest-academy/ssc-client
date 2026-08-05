"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { QuestionRenderer } from "@/components/ui/question-renderer";
import { useAuthStore } from "@/store/auth";
import { PaywallGate } from "@/components/ui/paywall-gate";

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
  const slug = params?.slug as string;
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const { data: lesson, isLoading: loading } = useQuery<Lesson>({
    queryKey: ["lesson", slug],
    queryFn: async () => {
      const response = await api.get(`/lessons/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
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
      await queryClient.cancelQueries({ queryKey: ["lesson", slug] });
      const previousLesson = queryClient.getQueryData<Lesson>(["lesson", slug]);

      // Optimistically update
      if (previousLesson) {
        queryClient.setQueryData<Lesson>(["lesson", slug], {
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
        queryClient.setQueryData(["lesson", slug], context.previousLesson);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", slug] });
    },
  });

  const handleMarkComplete = () => {
    if (!lesson) return;
    const isCompleted = !!lesson.progress?.[0]?.completedAt;
    markCompleteMutation.mutate(isCompleted);
  };

  if (loading) {
    return <div className="text-slate-400 p-8">Loading lesson...</div>;
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

  return (
    <div className="max-w-5xl mx-auto pb-24">
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{lesson.title}</h1>
          {lesson.description && <p className="text-slate-500 text-lg">{lesson.description}</p>}
        </div>
        {!lesson.isFree && (
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1 border border-amber-200">
            Premium
          </span>
        )}
      </div>

      {/* Lesson Content Area */}
      {!hasAccess ? (
        <PaywallGate contentType="Lesson" title={`Unlock "${lesson.title}"`} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden min-h-[500px]">
          {lesson.type === "VIDEO" && lesson.videoUrl ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={lesson.videoUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : lesson.type === "ARTICLE" && lesson.articleHtml ? (
            <div className="p-8 prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-primary">
              <QuestionRenderer content={lesson.articleHtml} />
            </div>
          ) : lesson.type === "PDF" && lesson.pdfUrl ? (
            <div className="w-full h-[80vh]">
              <iframe
                src={lesson.pdfUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Content not available for this lesson.
            </div>
          )}
        </div>
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-border p-4 px-6 sm:px-8 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/dashboard/subjects/${lesson.subject?.slug}/chapters/${lesson.chapter?.id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Chapter
          </Button>
          
          <Button
            onClick={handleMarkComplete}
            disabled={markCompleteMutation.isPending}
            variant={isCompleted ? "secondary" : "default"}
            className={isCompleted ? "text-emerald-700 bg-emerald-100 hover:bg-emerald-200" : ""}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
              </>
            ) : (
              <>
                <Circle className="w-5 h-5 mr-2" /> Mark as Complete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
