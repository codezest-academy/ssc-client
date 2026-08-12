"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, FileText, File, ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const chapterId = params?.chapterId as string;
  
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !chapterId) return;

    const fetchData = async () => {
      try {
        // Fetch subject to get chapter info (since chapters are public through subjects)
        const subjectRes = await api.get(`/subjects/${slug}`);
        const subjectData = subjectRes.data.data;
        setSubject(subjectData);
        
        const currentChapter = subjectData.chapters.find((c: Chapter) => c.id === chapterId);
        if (currentChapter) {
          setChapter(currentChapter);
        }

        // Fetch lessons for this chapter
        const lessonsRes = await api.get(`/lessons/chapter/${chapterId}`);
        setLessons(lessonsRes.data.data);
      } catch (error) {
        console.error("Failed to load chapter data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, chapterId]);

  if (loading) {
    return <div className="text-slate-400">Loading chapter details...</div>;
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
      case "VIDEO": return <PlayCircle className="w-5 h-5" />;
      case "ARTICLE": return <FileText className="w-5 h-5" />;
      case "PDF": return <File className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getLessonColor = (type: string) => {
    switch (type) {
      case "VIDEO": return "bg-blue-100 text-blue-600";
      case "ARTICLE": return "bg-emerald-100 text-emerald-600";
      case "PDF": return "bg-rose-100 text-rose-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/dashboard/subjects/${slug}`} className="text-slate-400 hover:text-primary transition-colors text-sm font-medium flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> {subject?.name || "Subject"}
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{chapter.name}</h2>
        <p className="text-slate-500 mt-2 max-w-2xl">{chapter.description}</p>
      </div>

      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="text-slate-400 p-8 text-center border-2 border-dashed rounded-xl">
            No lessons available for this chapter yet.
          </div>
        ) : (
          lessons.map((lesson) => {
            const isCompleted = lesson.progress?.[0]?.completedAt != null;
            return (
              <Card key={lesson.id} className="border-border hover:border-primary/50 transition-all shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getLessonColor(lesson.type)}`}>
                      {getLessonIcon(lesson.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{lesson.title}</h3>
                        {lesson.isPremium && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider">Premium</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">{lesson.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-400">
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {Math.floor(lesson.duration / 60)} mins
                        </div>
                        <div className="flex items-center">
                          {isCompleted ? (
                            <span className="flex items-center text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed</span>
                          ) : (
                            <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Not started</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex justify-end">
                      <Link href={`/dashboard/lessons/${lesson.slug}`} className="w-full sm:w-auto">
                        <Button variant="secondary" className="w-full">
                          View Lesson
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {chapter.practiceSets && chapter.practiceSets.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-foreground">Practice Sets</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapter.practiceSets.map((set) => (
              <Card key={set.id} className="hover:border-primary/50 transition-colors border-border/40 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{set.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                    Practice your skills with this test.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                      {set._count?.questions || 0} Questions
                    </span>
                    <Link href={`/tests/overview/${set.id}`}>
                      <Button size="sm" variant="default">
                        Take Test
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
