"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Play, FolderX, Target, Zap } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

export default function PracticeSetsPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/subjects");
      const subjectsData = res.data.data;
      
      // Fetch detailed subjects with chapters
      const detailedSubjects = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subjectsData.map(async (sub: any) => {
          const detailRes = await api.get(`/subjects/${sub.slug}`);
          return detailRes.data.data;
        })
      );
      
      setSubjects(detailedSubjects);
    } catch (e: any) {
      console.error(e);
      setError(e instanceof Error ? e : new Error(e.response?.data?.message || e.message || "Failed to load subjects"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const generatePracticeTest = async (payload: { subjectId?: string, chapterId?: string }) => {
    try {
      setGenerating(true);
      const res = await api.post("/attempts/dynamic", {
        ...payload,
        limit: 20
      });
      router.push(`/tests/attempt/${res.data.data.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to generate test. There might not be enough fresh questions available.");
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[120px] w-full rounded-3xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load subjects" 
        description={error.message} 
        retry={fetchSubjects} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Dynamic Practice Sets</h1>
          </div>
          <p className="opacity-90 max-w-2xl mt-2">
            Generate 20-question practice tests tailored to your weak areas. Questions are freshly shuffled and drawn from our entire question bank so you never see the same set twice!
          </p>
        </div>
      </div>

      {subjects.length === 0 ? (
        <EmptyState 
          icon={Target}
          title="No subjects available"
          description="Curriculum categories will appear here once content is added."
        />
      ) : (
        <div className="grid gap-6">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-card border rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div
                className="w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
              >
                <div className="text-left flex-1">
                  <h3 className="font-bold text-xl text-foreground">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{sub.chapters?.length || 0} Topics available</p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    onClick={() => generatePracticeTest({ subjectId: sub.id })}
                    disabled={generating}
                    className="rounded-xl font-bold shadow-sm"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Mixed Subject Test
                  </Button>
                  <button
                    onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
                    className={`p-2 rounded-full hover:bg-muted transform transition-transform ${expandedSubject === sub.id ? "rotate-180" : ""}`}
                  >
                    ▼
                  </button>
                </div>
              </div>

              {expandedSubject === sub.id && (
                <div className="border-t bg-muted/10 p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {sub.chapters?.map((chap: any) => (
                    <div key={chap.id} className="bg-background border rounded-xl p-5 flex flex-col justify-between group hover:border-primary/50 transition-colors shadow-sm">
                      <div>
                        <h4 className="font-bold text-foreground mb-2 line-clamp-2" title={chap.name}>{chap.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {chap.description || "Master this specific topic with a targeted quiz."}
                        </p>
                      </div>
                      <Button
                        onClick={() => generatePracticeTest({ chapterId: chap.id })}
                        disabled={generating}
                        variant="secondary"
                        className="mt-5 w-full rounded-lg font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {generating ? "Generating..." : "Generate Test"}
                      </Button>
                    </div>
                  ))}
                  {(!sub.chapters || sub.chapters.length === 0) && (
                    <div className="col-span-full">
                      <EmptyState 
                        icon={FolderX}
                        title="No topics available"
                        description="Topics for this subject will appear here."
                      />
                    </div>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
