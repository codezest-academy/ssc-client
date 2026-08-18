"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { FolderX, Target } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

export default function PracticeSetsPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data.data);
    } catch (e: unknown) {
      console.error(e);
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      setError(new Error(err.response?.data?.message || err.message || "Failed to load subjects"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    (async () => {


      await fetchSubjects();


    })();


  }, []);

  const generateTest = async (subjectId: string) => {
    try {
      setGeneratingId(subjectId);
      const res = await api.post("/attempts/dynamic", { subjectId, limit: 20 });
      router.push(`/tests/attempt/${res.data.data.id}`);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Failed to generate test. There might not be enough questions available.");
      setGeneratingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[180px] w-full rounded-3xl" />
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
        retry={() => {
          setLoading(true);
          setError(null);
          fetchSubjects();
        }}
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
          Practice on any subject, with fresh questions every time.
        </p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No subjects available"
          description="Curriculum categories will appear here once content is added."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="h-full bg-card border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-3xl p-5 flex flex-col relative overflow-hidden group cursor-pointer"
              onClick={() => !generatingId && generateTest(subject.id)}
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-0 transition-colors" />

              {/* Chapter count badge */}
              <div className="relative z-10 flex justify-end mb-4">
                <div className="bg-card shadow-sm border border-border/60 px-2.5 py-1 rounded-xl">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {subject._count?.chapters ?? "—"} Topics
                  </span>
                </div>
              </div>

              {/* Subject info */}
              <div className="relative z-10 space-y-1.5 flex-1 mb-5 pr-6">
                <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {subject.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
                  {subject.description || "Mixed questions from all topics in this subject."}
                </p>
              </div>

              {/* Practice button */}
              <div className="relative z-10 mt-auto">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    generateTest(subject.id);
                  }}
                  disabled={!!generatingId}
                  className="w-full rounded-full font-bold h-9 text-sm"
                >
                  {generatingId === subject.id ? "Starting..." : "Practice"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subjects with no chapters — safety fallback empty state */}
      {subjects.length > 0 && subjects.every((s) => (s._count?.chapters ?? 0) === 0) && (
        <div className="mt-2">
          <EmptyState
            icon={FolderX}
            title="No topics added yet"
            description="Topics will appear inside these subjects once content is published."
          />
        </div>
      )}
    </div>
  );
}

