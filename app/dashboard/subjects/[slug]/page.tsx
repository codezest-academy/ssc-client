"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Layers, ChevronRight, FolderX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

interface Chapter {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
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
  
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubject = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/subjects/${slug}`);
      setSubject(response.data.data);
    } catch (err: any) {
      console.error("Failed to load subject:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load subject"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubject();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
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
        retry={fetchSubject} 
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <Link href="/dashboard/syllabus" className="hover:text-primary transition-colors">Subjects</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">{subject.name}</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{subject.name}</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">{subject.description}</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold flex items-center shrink-0">
          <Layers className="w-5 h-5 mr-2" />
          {subject.chapters.length} Chapters
        </div>
      </div>

      <div className="space-y-4">
        {subject.chapters.length === 0 ? (
          <EmptyState 
            icon={FolderX}
            title="No chapters available"
            description="Check back later for new content in this subject."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subject.chapters.map((chapter, index) => (
              <Link key={chapter.id} href={`/dashboard/subjects/${subject.slug}/chapters/${chapter.slug}`} className="group block h-full">
                <Card className="h-full border-border hover:border-primary/50 transition-colors shadow-sm rounded-xl overflow-hidden bg-card flex flex-col">
                  <CardContent className="p-5 flex flex-col h-full gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                          {chapter.name}
                        </h3>
                      </div>
                      <span className="text-4xl font-black text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors shrink-0 leading-none">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {chapter.description || "Learn the concepts of this chapter."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center text-xs font-medium text-muted-foreground">
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {chapter._count.lessons} Lessons
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
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
