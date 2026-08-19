"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { FileText, Layers, ChevronRight, FolderX, ArrowLeft, Lock, PlayCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { BuyChapterButton } from "@/components/ui/buy-chapter-button";

interface Chapter {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  accessTier: string;
  _count: {
    lessons: number;
  };
}

interface SubjectDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  chapters: Chapter[];
}

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const user = useAuthStore((state) => state.user);

  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubject = async () => {
    if (!slug) return;
    try {
      const response = await api.get(`/subjects/${slug}?t=${Date.now()}`);
      setSubject(response.data.data);
    } catch (err: unknown) {
      console.error("Failed to load subject:", err);
      const e = err instanceof Error ? err : new Error("Failed to load subject");
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchSubject();
    })();
  }, [slug]);

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
        title="Failed to load subject"
        description={error.message}
        retry={() => {
          setLoading(true);
          setError(null);
          fetchSubject();
        }}
      />
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Subject not found</h3>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="text-border">/</span>
            <Link href="/dashboard/syllabus" className="hover:text-primary transition-colors">Subjects</Link>
            <span className="text-border">/</span>
            <span className="text-foreground">{subject.name}</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">{subject.name}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">{subject.description}</p>
        </div>
        <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-semibold flex items-center shrink-0 text-sm border border-border">
          <Layers className="w-4 h-4 mr-2" />
          {subject.chapters.length} Chapters
        </div>
      </div>

      {/* Chapter grid */}
      <div>
        {subject.chapters.length === 0 ? (
          <EmptyState
            icon={FolderX}
            title="No chapters available"
            description="Check back later for new content in this subject."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subject.chapters.map((chapter, index) => {
              const isLocked = chapter.accessTier === "PRO" && (!user?.subscriptionTier || user.subscriptionTier === "FREE");

              const card = (
                <div className={cn(
                  "group relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col",
                  isLocked ? "border-border hover:border-warning/30 hover:shadow-warning/5" : "border-border hover:border-primary/30 hover:shadow-primary/5"
                )}>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm transition-colors",
                          isLocked ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                        )}>
                          {(index + 1).toString().padStart(2, "0")}
                        </div>
                        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                          Chapter
                        </span>
                      </div>
                      {isLocked ? (
                        <Badge className="text-[10px] font-bold tracking-widest uppercase bg-warning text-warning-foreground border-0 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <Lock className="w-3 h-3" /> PRO
                        </Badge>
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className={cn(
                        "font-bold text-lg leading-tight transition-colors line-clamp-2",
                        isLocked ? "text-foreground" : "text-foreground group-hover:text-primary"
                      )}>
                        {chapter.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {chapter.description || `Learn the essential concepts and techniques of ${chapter.name.toLowerCase()} with our comprehensive lessons.`}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between group-hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-background border border-border shadow-sm">
                        <FileText className="w-3 h-3 text-foreground/70" />
                      </div>
                      <span>{chapter._count.lessons > 0 ? `${chapter._count.lessons} Lessons` : "Lessons"}</span>
                    </div>
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full bg-background border shadow-sm transition-all duration-300",
                      isLocked 
                        ? "border-border text-muted-foreground" 
                        : "border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                    )}>
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                    </div>
                  </div>
                </div>
              );

              if (isLocked) {
                return (
                  <Dialog key={chapter.id}>
                    <DialogTrigger asChild>
                      <button className="text-left block h-full w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
                        {card}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg overflow-hidden p-0 border-border shadow-lg">
                      {/* Modal header */}
                      <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5 text-primary" />
                          </div>
                          <Badge className="text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary border-0">
                            PRO Chapter
                          </Badge>
                        </div>
                        <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                          {chapter.name}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {chapter.description || "This chapter is part of the PRO syllabus. Upgrade to get full access."}
                        </DialogDescription>
                      </div>

                      {/* What's included */}
                      <div className="px-6 pt-5 pb-4 space-y-2.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">What you'll unlock:</p>
                        {[
                          { icon: PlayCircle, text: `${chapter._count.lessons} full video lessons` },
                          { icon: BookOpen, text: "Detailed notes & reading material" },
                          { icon: FileText, text: "Practice sets with step-by-step solutions" },
                        ].map(({ icon: Icon, text }, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                            <Icon className="w-4 h-4 text-primary shrink-0" />
                            <span>{text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="px-6 pb-6 flex flex-col gap-2">
                        <Button asChild className="w-full h-11 font-semibold rounded-lg">
                          <Link href="/dashboard/upgrade">View PRO Plans</Link>
                        </Button>
                        <BuyChapterButton chapterId={chapter.id} className="w-full h-11 font-semibold rounded-lg" variant="outline" />
                        <Button asChild variant="ghost" className="w-full h-10 text-sm text-muted-foreground hover:text-foreground">
                          <Link href={`/dashboard/subjects/${subject.slug}/chapters/${chapter.slug}`}>
                            Preview a few lessons for free
                          </Link>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              }

              return (
                <Link key={chapter.id} href={`/dashboard/subjects/${subject.slug}/chapters/${chapter.slug}`} className="block h-full">
                  {card}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
