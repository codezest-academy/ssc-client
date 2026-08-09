"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { QuestionRenderer } from "@/components/ui/question-renderer";

export default function TestReviewPage() {
  const params = useParams();
  const attemptId = params?.attemptId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [attempt, setAttempt] = useState<any>(null);

  useEffect(() => {
    if (!attemptId) return;
    const loadData = async () => {
      try {
        const res = await api.get(`/attempts/${attemptId}`);
        setAttempt(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading review...</p>
      </div>
    );
  }

  if (!attempt) {
    return <div className="p-8 text-center text-muted-foreground">Attempt not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Test Review</h1>
            <p className="text-muted-foreground">Score: {attempt.marksObtained} | Accuracy: {Math.round(attempt.accuracy || 0)}%</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-full border bg-card hover:bg-muted transition-colors text-sm font-medium"
          >
            Exit Review
          </button>
        </div>

        <div className="space-y-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {attempt.responses.map((resp: any, index: number) => {
            const q = resp.question;
            if (!q) return null;
            
            // Parse options if needed
            let options = q.options;
            if (typeof options === "string") {
              try { options = JSON.parse(options); } catch (e) {}
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const selectedOpt = options.find((o: any) => o.key === resp.selectedOption);

            return (
              <div key={resp.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="space-y-3 pt-1">
                      <div className="prose prose-sm dark:prose-invert">
                        <QuestionRenderer content={q.questionText} />
                      </div>
                      {q.questionImageUrl && (
                        <img src={q.questionImageUrl} alt="Question" className="max-w-full rounded border" />
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {resp.isCorrect ? (
                      <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-semibold">Correct (+{resp.marksAwarded})</span>
                    ) : resp.selectedOption ? (
                      <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-semibold">Incorrect ({resp.marksAwarded})</span>
                    ) : (
                      <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold">Skipped</span>
                    )}
                  </div>
                </div>

                <div className="pl-12 space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {options.map((opt: any) => {
                    const isSelected = resp.selectedOption === opt.key;
                    const isCorrect = q.correctOption === opt.key;
                    
                    let ringClass = "border-border";
                    let bgClass = "bg-muted/30";
                    if (isCorrect) {
                      ringClass = "border-success ring-1 ring-success/30";
                      bgClass = "bg-success/5";
                    } else if (isSelected && !isCorrect) {
                      ringClass = "border-destructive ring-1 ring-destructive/30";
                      bgClass = "bg-destructive/5";
                    }

                    return (
                      <div key={opt.key} className={`border rounded-xl p-4 flex gap-3 ${ringClass} ${bgClass}`}>
                        <div className={`w-6 h-6 shrink-0 rounded-full border flex items-center justify-center text-xs font-medium ${isCorrect ? "bg-success text-success-foreground border-success" : isSelected ? "bg-destructive text-destructive-foreground border-destructive" : "bg-background"}`}>
                          {opt.key}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="prose prose-sm dark:prose-invert">
                            <QuestionRenderer content={opt.text} />
                          </div>
                          {opt.imageUrl && <img src={opt.imageUrl} alt={`Option ${opt.key}`} className="max-w-full rounded border" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Distractor Rationale */}
                {resp.selectedOption && !resp.isCorrect && selectedOpt?.rationale && (
                  <div className="pl-12 mt-4">
                    <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 space-y-2">
                      <h4 className="font-semibold text-warning text-sm flex items-center gap-2">
                        <span>⚠️</span> Why you got this wrong:
                      </h4>
                      <p className="text-warning text-sm">
                        {selectedOpt.rationale}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* General Explanation */}
                {q.explanation && (
                  <div className="pl-12 mt-4">
                    <div className="bg-info/10 border border-info/20 rounded-xl p-4 space-y-2">
                      <h4 className="font-semibold text-info text-sm flex items-center gap-2">
                        <span>💡</span> Correct Explanation:
                      </h4>
                      <div className="text-info text-sm prose prose-sm dark:prose-invert">
                        <QuestionRenderer content={q.explanation} />
                      </div>
                      {q.explanationImageUrl && (
                        <img src={q.explanationImageUrl} alt="Explanation" className="max-w-full rounded border mt-2" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
