"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Play, FolderX, Library } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function PYQExplorerPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        const subjectsData = res.data.data;
        
        // Fetch detailed subjects with chapters
        const detailedSubjects = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subjectsData.map(async (sub: any) => {
            const detailRes = await api.get(`/subjects/slug/${sub.slug}`);
            return detailRes.data.data;
          })
        );
        
        setSubjects(detailedSubjects);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const generatePYQTest = async (chapterId: string) => {
    try {
      setGenerating(true);
      const res = await api.post("/attempts/pyq", {
        chapterId,
        limit: 20
      });
      router.push(`/tests/attempt/${res.data.data.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to generate test. There might not be enough PYQs in this chapter yet.");
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Topic-wise PYQ Explorer</h1>
        <p className="opacity-90 max-w-2xl">
          Instantly generate 20-question practice tests consisting entirely of Previous Year Questions. Target your weak areas specifically.
        </p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState 
          icon={Library}
          title="No subjects available"
          description="PYQ categories will appear here once content is added."
        />
      ) : (
        <div className="grid gap-6">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-card border rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-bold text-lg text-foreground">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground">{sub.chapters?.length || 0} Topics</p>
                </div>
                <div className={`transform transition-transform ${expandedSubject === sub.id ? "rotate-180" : ""}`}>
                  ▼
                </div>
              </button>

              {expandedSubject === sub.id && (
                <div className="border-t bg-muted/10 p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {sub.chapters?.map((chap: any) => (
                    <div key={chap.id} className="bg-background border rounded-xl p-4 flex flex-col justify-between group hover:border-primary/50 transition-colors">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{chap.name}</h4>
                      </div>
                      <button
                        onClick={() => generatePYQTest(chap.id)}
                        disabled={generating}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        {generating ? "Generating..." : "Generate Test"}
                      </button>
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
