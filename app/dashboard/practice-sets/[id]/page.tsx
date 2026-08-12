"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, BookOpen, Clock, Target } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { PaywallGate } from "@/components/ui/paywall-gate";
import { PracticeSetQuestion } from "@/types/api";
import { ErrorState } from "@/components/ui/error-state";

interface PracticeSet {
  id: string;
  title: string;
  description: string;
  subject?: { name: string };
  chapter?: { name: string };
  isFree: boolean;
  questions: PracticeSetQuestion[];
}

export default function PracticeSetOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const user = useAuthStore((state) => state.user);

  const fetchPracticeSet = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/practice-sets/${id}`);
      setPracticeSet(response.data.data);
    } catch (err: any) {
      console.error("Failed to load practice set:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load practice set"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticeSet();
  }, [id]);

  const handleStartPractice = async () => {
    if (!practiceSet) return;
    setStarting(true);
    try {
      const response = await api.post("/attempts/start", {
        attemptType: "PRACTICE",
        practiceSetId: practiceSet.id,
      });
      const attemptId = response.data.data.id;
      router.push(`/tests/attempt/${attemptId}`);
    } catch (error) {
      console.error("Failed to start attempt:", error);
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 p-8">Loading practice set details...</div>;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load practice set" 
        description={error.message} 
        retry={fetchPracticeSet} 
      />
    );
  }

  if (!practiceSet) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Practice Set not found</h3>
        <Button onClick={() => router.push("/dashboard/practice-sets")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Practice Sets
        </Button>
      </div>
    );
  }

  const questionCount = practiceSet.questions.length;
  const estimatedTimeMins = Math.ceil(questionCount * 1.5); // estimate 1.5 mins per question

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/dashboard/practice-sets" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Practice Sets
        </Link>
      </div>

      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{practiceSet.title}</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          {practiceSet.description || "Practice questions to test your understanding."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border bg-slate-50 shadow-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <BookOpen className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Questions</h3>
            <p className="text-2xl font-bold text-primary">{questionCount}</p>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-slate-50 shadow-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Estimated Time</h3>
            <p className="text-2xl font-bold text-primary">~{estimatedTimeMins} mins</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-slate-50 shadow-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Target className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Type</h3>
            <p className="text-2xl font-bold text-primary">Practice</p>
          </CardContent>
        </Card>
      </div>

      {(!practiceSet.isFree && (!user || user.subscriptionTier === "FREE")) ? (
        <PaywallGate contentType="Practice Set" title="Premium Practice Set" />
      ) : (
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm text-center">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">Ready to begin?</h3>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">
            Your progress will be saved automatically. You can pause and resume this practice set at any time.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleStartPractice} 
            disabled={starting || questionCount === 0}
            className="w-full sm:w-auto min-w-[200px] text-lg h-14"
          >
            {starting ? (
              "Starting..."
            ) : (
              <>
                <PlayCircle className="w-6 h-6 mr-2" /> Start Practice
              </>
            )}
          </Button>
          {questionCount === 0 && (
            <p className="text-rose-500 text-sm mt-4">This practice set has no questions yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
