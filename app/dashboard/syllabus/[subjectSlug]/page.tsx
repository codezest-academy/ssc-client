"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, PlayCircle, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "ARTICLE" | "PDF";
  durationMins: number | null;
  accessTier: "FREE" | "PRO" | "EXCLUSIVE";
}

interface Chapter {
  id: string;
  name: string;
  slug: string;
  sectionName: string | null;
  description: string | null;
  _count: { lessons: number };
  lessons?: Lesson[]; // If we include lessons
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  chapters: Chapter[];
}

export default function SubjectSyllabusPage({
  params,
}: {
  params: Promise<{ subjectSlug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const exam = searchParams.get("exam") || "SSC_CGL";
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubject() {
      try {
        const res = await api.get(`/subjects/${resolvedParams.subjectSlug}?examType=${exam}`);
        setSubject(res.data.data);
      } catch (error) {
        console.error("Failed to fetch subject:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubject();
  }, [resolvedParams.subjectSlug, exam]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-24 bg-white/5 rounded-md" />
        <div className="h-12 w-64 bg-white/5 rounded-md" />
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-white mb-2">Subject not found</h3>
        <Button onClick={() => router.back()} variant="outline">Go back</Button>
      </div>
    );
  }

  // Group chapters by sectionName
  const groupedChapters = subject.chapters.reduce((acc, chapter) => {
    const section = chapter.sectionName || "General";
    if (!acc[section]) acc[section] = [];
    acc[section].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Syllabus
      </button>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
          {subject.name}
        </h1>
        {subject.description && (
          <p className="text-slate-400 text-lg">{subject.description}</p>
        )}
      </div>

      <div className="space-y-12 mt-10">
        {Object.entries(groupedChapters).map(([sectionName, chapters]) => (
          <div key={sectionName}>
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-3" />
              {sectionName}
            </h2>
            
            <div className="space-y-4">
              {chapters.map((chapter, idx) => (
                <div 
                  key={chapter.id} 
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Chapter {idx + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {chapter.name}
                      </h3>
                      {chapter.description && (
                        <p className="text-sm text-slate-400 mt-1">{chapter.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
                      <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <FileText className="w-4 h-4 mr-2 text-slate-400" />
                        {chapter._count.lessons} Lessons
                      </div>
                      
                      <Link href={`/learn/${subject.slug}/${chapter.slug}`}>
                        <Button className="rounded-full shadow-lg h-9">Start Chapter</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {subject.chapters.length === 0 && (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
            <h3 className="text-lg font-semibold text-white mb-2">No chapters found</h3>
            <p className="text-slate-400">There are no chapters available for this subject for the selected exam.</p>
          </div>
        )}
      </div>
    </div>
  );
}
