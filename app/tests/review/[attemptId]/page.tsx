"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { QuestionRenderer } from "@/components/ui/question-renderer";
import { ShareScoreButton } from "@/components/ui/share-score-button";
import { ReportIssueButton } from "@/components/ui/report-issue-button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

function TestReviewSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        {/* Analytics Dashboard Skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-card border rounded-2xl p-6 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Review Skeleton */}
        <div className="pt-8 border-t space-y-8">
          <Skeleton className="h-8 w-48" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-3 pt-1 w-full">
                    <div className="flex gap-2 mb-2">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-5 w-32 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                  </div>
                </div>
                <div className="shrink-0">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <div className="pl-12 space-y-3">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  // Analytics Logic
  const analytics = useMemo(() => {
    if (!attempt || !attempt.responses) return null;

    let totalCorrectTime = 0;
    let correctCount = 0;
    let totalIncorrectTime = 0;
    let incorrectCount = 0;

    const subjectMap: Record<string, { total: number; correct: number; time: number }> = {};
    const chapterMap: Record<string, { total: number; correct: number; time: number; subject: string }> = {};

    attempt.responses.forEach((resp: any) => {
      const q = resp.question;
      if (!q) return;

      const time = resp.timeTakenSeconds || 0;
      
      if (resp.isCorrect) {
        totalCorrectTime += time;
        correctCount++;
      } else if (resp.selectedOption) {
        totalIncorrectTime += time;
        incorrectCount++;
      }

      // Group by Subject
      const subName = q.subject?.name || "Unknown Subject";
      if (!subjectMap[subName]) subjectMap[subName] = { total: 0, correct: 0, time: 0 };
      if (resp.selectedOption) {
        subjectMap[subName].total++;
        if (resp.isCorrect) subjectMap[subName].correct++;
      }
      subjectMap[subName].time += time;

      // Group by Chapter
      const chapName = q.chapter?.name || "Unknown Chapter";
      if (!chapterMap[chapName]) chapterMap[chapName] = { total: 0, correct: 0, time: 0, subject: subName };
      if (resp.selectedOption) {
        chapterMap[chapName].total++;
        if (resp.isCorrect) chapterMap[chapName].correct++;
      }
      chapterMap[chapName].time += time;
    });

    const avgCorrectTime = correctCount ? Math.round(totalCorrectTime / correctCount) : 0;
    const avgIncorrectTime = incorrectCount ? Math.round(totalIncorrectTime / incorrectCount) : 0;

    const subjectStats = Object.keys(subjectMap).map(name => {
      const stat = subjectMap[name];
      const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      return { name, accuracy, time: stat.time };
    });

    // Danger Zones: Chapters with <= 50% accuracy and substantial average time per question (>30s) or high total time (>120s)
    const dangerZones = Object.keys(chapterMap)
      .map(name => {
        const stat = chapterMap[name];
        const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
        return { name, accuracy, time: stat.time, subject: stat.subject, total: stat.total };
      })
      .filter(chap => chap.total > 0 && chap.accuracy <= 50 && (chap.time / chap.total > 30 || chap.time > 120))
      .sort((a, b) => b.time - a.time);

    return { avgCorrectTime, avgIncorrectTime, subjectStats, dangerZones };
  }, [attempt]);

  if (loading) {
    return <TestReviewSkeleton />;
  }

  if (!attempt) {
    return <div className="p-8 text-center text-muted-foreground">Attempt not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Performance Diagnostics</h1>
            <p className="text-muted-foreground mt-1">Score: <span className="font-semibold text-foreground">{attempt.marksObtained}</span> | Accuracy: <span className="font-semibold text-foreground">{Math.round(attempt.accuracy || 0)}%</span></p>
          </div>
          <div className="flex gap-4">
            <ShareScoreButton 
              testName={attempt.mockTest?.title || attempt.practiceSet?.title || 'Diagnostic'} 
              score={attempt.marksObtained} 
              totalMarks={attempt.mockTest?.totalMarks || 200} 
            />
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 rounded-full border bg-card hover:bg-muted transition-colors text-sm font-semibold shadow-sm"
            >
              Exit Review
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Subject Accuracy Chart */}
            <div className="md:col-span-2 bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-foreground">Subject-wise Accuracy</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.subjectStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/30" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="currentColor" className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-muted-foreground" unit="%" />
                    <Tooltip 
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                      {analytics.subjectStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.accuracy >= 75 ? '#10b981' : entry.accuracy >= 50 ? '#f59e0b' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Management & Danger Zones */}
            <div className="space-y-6">
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Time Management
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-xl border border-success/20">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Avg Correct Time</span>
                    </div>
                    <span className="font-bold text-success">{analytics.avgCorrectTime}s</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Avg Incorrect Time</span>
                    </div>
                    <span className="font-bold text-destructive">{analytics.avgIncorrectTime}s</span>
                  </div>
                </div>
              </div>

              {analytics.dangerZones.length > 0 && (
                <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-warning flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Danger Zones
                  </h3>
                  <div className="space-y-3">
                    {analytics.dangerZones.slice(0, 3).map((zone, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-warning/20 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-warning-text-on-tint">{zone.name}</p>
                          <p className="text-xs opacity-80">{zone.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-warning-text-on-tint">{zone.accuracy}% Acc</p>
                          <p className="text-xs opacity-80">{zone.time}s spent</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-8 border-t space-y-8">
          <h2 className="text-2xl font-bold text-foreground">Detailed Review</h2>
          
          {attempt.responses.map((resp: any, index: number) => {
            const q = resp.question;
            if (!q) return null;
            
            let options = q.options;
            if (typeof options === "string") {
              try { options = JSON.parse(options); } catch (e) {}
            }
            const selectedOpt = options.find((o: any) => o.key === resp.selectedOption);

            return (
              <div key={resp.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md">{q.subject?.name}</span>
                        <span className="text-xs text-muted-foreground">{q.chapter?.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {resp.timeTakenSeconds || 0}s
                        </span>
                      </div>
                      <div className="prose prose-sm dark:prose-invert">
                        <QuestionRenderer content={q.questionText} />
                      </div>
                      {q.questionImageUrl && (
                        <img src={q.questionImageUrl} alt="Question" className="max-w-full rounded border" />
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {resp.isCorrect ? (
                      <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-semibold">Correct (+{resp.marksAwarded})</span>
                    ) : resp.selectedOption ? (
                      <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-semibold">Incorrect ({resp.marksAwarded})</span>
                    ) : (
                      <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold">Skipped</span>
                    )}
                    <ReportIssueButton questionId={q.id} />
                  </div>
                </div>

                <div className="pl-12 space-y-3">
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
                      <p className="text-warning-text-on-tint text-sm">
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
                      <div className="text-info-text-on-tint text-sm prose prose-sm dark:prose-invert">
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
