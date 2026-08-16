"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Play, FolderX, Target, Zap, ChevronDown } from "lucide-react";
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
            <Skeleton key={i} className="h-24 w-full rounded-3xl" />
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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">
          Practice Sets
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Practice on any subject or topic, with fresh questions every time.
        </p>
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
            <div key={sub.id} className="bg-card border border-primary/10 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-primary/30 group">
              <div
                className="w-full p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer relative"
                onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
              >
                {/* Decorative background curve */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="text-left flex-1 relative z-10">
                  <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{sub.chapters?.length || 0} Topics available</p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0 relative z-10" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    onClick={() => generatePracticeTest({ subjectId: sub.id })}
                    disabled={generating}
                    className="rounded-full font-bold shadow-sm h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Mixed Subject Test
                  </Button>
                  <button
                    onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
                    className="p-2.5 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transform transition-all duration-300 outline-none"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedSubject === sub.id ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {expandedSubject === sub.id && (
                <div className="border-t border-primary/5 bg-muted/20 p-5 md:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {sub.chapters?.map((chap: any) => (
                    <div key={chap.id} className="bg-card border border-primary/10 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all shadow-sm group/chap">
                      <div className="mb-4">
                        <h4 className="font-black text-foreground mb-1.5 line-clamp-2 leading-tight group-hover/chap:text-primary transition-colors" title={chap.name}>{chap.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                          {chap.description || "Master this specific topic with a targeted quiz."}
                        </p>
                      </div>
                      <Button
                        onClick={() => generatePracticeTest({ chapterId: chap.id })}
                        disabled={generating}
                        variant="secondary"
                        className="mt-auto w-full rounded-full font-bold group-hover/chap:bg-primary group-hover/chap:text-primary-foreground transition-all shadow-sm h-9"
                      >
                        {generating ? "Generating..." : "Generate Test"}
                      </Button>
                    </div>
                  ))}
                  {(!sub.chapters || sub.chapters.length === 0) && (
                    <div className="col-span-full py-4">
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
