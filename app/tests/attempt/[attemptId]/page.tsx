"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useTestEngineStore, EngineQuestion } from "@/store/useTestEngineStore";
import { Question, PracticeSetQuestion, MockTestSection, MockTestSectionQuestion } from "@/types/api";
import { TestLayout } from "@/components/test-engine/TestLayout";
import { QuestionViewer } from "@/components/test-engine/QuestionViewer";

export default function TestAttemptPage() {
  const params = useParams();
  const attemptId = params?.attemptId as string;
  const router = useRouter();

  const { initializeTest, status } = useTestEngineStore();
  const [loading, setLoading] = useState(true);
  const [testTitle, setTestTitle] = useState("Practice Test");

  useEffect(() => {
    if (!attemptId) return;

    const loadTestData = async () => {
      try {
        // 1. Fetch attempt details
        const attemptRes = await api.get(`/attempts/${attemptId}`);
        const attempt = attemptRes.data.data;

        if (attempt.status === "SUBMITTED" || attempt.status === "COMPLETED") {
          // If already submitted, update store and stop loading
          useTestEngineStore.setState({ status: "SUBMITTED" });
          setLoading(false);
          return;
        }

        // 2. Fetch the actual questions
        let questionsData: Question[] = [];
        let durationSeconds = 30 * 60; // default 30 mins

        if (attempt.practiceSetId) {
          const psRes = await api.get(`/practice-sets/${attempt.practiceSetId}`);
          const ps = psRes.data.data;
          setTestTitle(ps.title);
          questionsData = ps.questions.map((q: PracticeSetQuestion) => q.question);
          // Estimate 1.5 mins per question for practice sets if duration not specified
          durationSeconds = questionsData.length * 90;
        } else if (attempt.mockTestId) {
          const mtRes = await api.get(`/mock-tests/${attempt.mockTestId}`);
          const mt = mtRes.data.data;
          setTestTitle(mt.title);
          questionsData = mt.sections.flatMap((s: MockTestSection) => s.questions.map((q: MockTestSectionQuestion) => q.question));
          durationSeconds = mt.durationMinutes * 60;
        }

        // 3. Map questions to EngineQuestion format
        const engineQuestions: EngineQuestion[] = questionsData.map((q: any) => {
          // Parse options if it's a string, or use as is
          let parsedOptions = q.options;
          if (typeof parsedOptions === 'string') {
            try { parsedOptions = JSON.parse(parsedOptions); } catch (e) {}
          }
          
          return {
            id: q.id,
            questionText: q.questionText,
            questionImageUrl: q.questionImageUrl,
            options: parsedOptions.map((opt: Record<string, unknown>) => ({
              key: opt.key,
              text: opt.text,
              imageUrl: opt.imageUrl,
            })),
          };
        });

        // 4. Initialize store
        initializeTest(engineQuestions, durationSeconds, attemptId);
        setLoading(false);

      } catch (error) {
        console.error("Failed to load test attempt:", error);
        setLoading(false);
      }
    };

    loadTestData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  // Anti-cheat: Warn user if they try to leave mid-test
  useEffect(() => {
    if (status !== "IN_PROGRESS") return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your test progress will be saved automatically.";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading your test...</p>
      </div>
    );
  }

  if (status === "SUBMITTED") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <span className="text-4xl">🎉</span>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Test Submitted!</h1>
          <p className="text-muted-foreground">
            Your answers have been recorded. Results will be available shortly.
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-md space-y-4">
          <h2 className="font-semibold text-foreground text-center text-lg">Summary</h2>
          <SummaryGrid />
        </div>
        <a
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <TestLayout testTitle={testTitle}>
      <QuestionViewer />
    </TestLayout>
  );
}

function SummaryGrid() {
  const { questions, questionStatus } = useTestEngineStore();

  const answered = questions.filter(
    (q) =>
      questionStatus[q.id] === "ANSWERED" ||
      questionStatus[q.id] === "ANSWERED_MARKED_FOR_REVIEW"
  ).length;
  const notAnswered = questions.filter(
    (q) => questionStatus[q.id] === "NOT_ANSWERED"
  ).length;
  const markedForReview = questions.filter(
    (q) => questionStatus[q.id] === "MARKED_FOR_REVIEW"
  ).length;
  const notVisited = questions.filter(
    (q) => !questionStatus[q.id] || questionStatus[q.id] === "NOT_VISITED"
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Answered" value={answered} color="emerald" />
      <StatCard label="Not Answered" value={notAnswered} color="amber" />
      <StatCard label="Marked for Review" value={markedForReview} color="indigo" />
      <StatCard label="Not Visited" value={notVisited} color="muted" />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "emerald" | "amber" | "indigo" | "muted";
}) {
  const colorMap = {
    emerald:
      "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400",
    amber:
      "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400",
    indigo: "bg-primary/5 border-primary/20 text-primary",
    muted: "bg-muted border-border text-muted-foreground",
  };

  return (
    <div className={`rounded-xl border p-4 text-center ${colorMap[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-1 opacity-80">{label}</p>
    </div>
  );
}
