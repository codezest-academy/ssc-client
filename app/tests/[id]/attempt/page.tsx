'use client';

import { useEffect } from 'react';
import { useTestEngineStore } from '@/store/useTestEngineStore';
import { TestLayout } from '@/components/test-engine/TestLayout';
import { QuestionViewer } from '@/components/test-engine/QuestionViewer';

// For now, hardcoded mock data. Replace with API call later.
const MOCK_DURATION_SECONDS = 60 * 30; // 30 minutes

export default function TestAttemptPage() {
  const { initializeTest, questions, status } = useTestEngineStore();

  // Initialize test on mount
  useEffect(() => {
    initializeTest(questions, MOCK_DURATION_SECONDS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Anti-cheat: Warn user if they try to leave mid-test
  useEffect(() => {
    if (status !== 'IN_PROGRESS') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

  if (status === 'SUBMITTED') {
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
    <TestLayout testTitle="SSC CGL Mock Test #1">
      <QuestionViewer />
    </TestLayout>
  );
}

function SummaryGrid() {
  const { questions, answers, questionStatus } = useTestEngineStore();

  const answered = questions.filter(
    (q) =>
      questionStatus[q.id] === 'ANSWERED' ||
      questionStatus[q.id] === 'ANSWERED_MARKED_FOR_REVIEW'
  ).length;
  const notAnswered = questions.filter(
    (q) => questionStatus[q.id] === 'NOT_ANSWERED'
  ).length;
  const markedForReview = questions.filter(
    (q) => questionStatus[q.id] === 'MARKED_FOR_REVIEW'
  ).length;
  const notVisited = questions.filter(
    (q) => !questionStatus[q.id] || questionStatus[q.id] === 'NOT_VISITED'
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
  color: 'emerald' | 'amber' | 'indigo' | 'muted';
}) {
  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
    amber: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400',
    indigo: 'bg-primary/5 border-primary/20 text-primary',
    muted: 'bg-muted border-border text-muted-foreground',
  };

  return (
    <div className={`rounded-xl border p-4 text-center ${colorMap[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-1 opacity-80">{label}</p>
    </div>
  );
}
