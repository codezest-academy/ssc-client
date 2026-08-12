"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Layers, ChevronRight, FolderX, Home, ArrowLeft } from "lucide-react";
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
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
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
          <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-slate-500">
            <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/dashboard/syllabus" className="hover:text-primary transition-colors">
              Subjects
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-foreground">{subject.name}</span>
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
          subject.chapters.map((chapter) => (
            <Link key={chapter.id} href={`/dashboard/subjects/${subject.slug}/chapters/${chapter.slug}`} className="block group">
              <Card className="border-border hover:border-primary/50 hover:bg-slate-50 transition-colors duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-xl">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {chapter.order}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {chapter.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xl line-clamp-2">
                      {chapter.description || "Learn the concepts of this chapter."}
                    </p>
                    <div className="flex items-center text-xs font-semibold text-slate-400 mt-3">
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      {chapter._count.lessons} Lessons
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 pl-16 sm:pl-0">
                  <Button variant="ghost" className="group-hover:bg-primary/5 text-slate-400 group-hover:text-primary transition-colors w-full sm:w-auto">
                    View Chapter <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
