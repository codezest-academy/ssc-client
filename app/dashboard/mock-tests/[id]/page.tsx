"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, FileText, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { PaywallGate } from "@/components/ui/paywall-gate";
import { MockTestSection } from "@/types/api";
import { usePostHog } from 'posthog-js/react';
import { ErrorState } from "@/components/ui/error-state";

interface MockTest {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  examType: string;
  isFree: boolean;
  sections: MockTestSection[];
}

export default function MockTestOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const posthog = usePostHog();

  const [mockTest, setMockTest] = useState<MockTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const user = useAuthStore((state) => state.user);

  const fetchMockTest = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/mock-tests/${id}`);
      setMockTest(response.data.data);
    } catch (err: any) {
      console.error("Failed to load mock test:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load mock test"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    (async () => {


      await fetchMockTest();


    })();


  }, [id]);

  const handleStartMockTest = async () => {
    if (!mockTest) return;
    setStarting(true);
    try {
      const response = await api.post("/attempts/start", {
        attemptType: "MOCK",
        mockTestId: mockTest.id,
      });
      const attemptId = response.data.data.id;
      
      posthog?.capture('mock_test_started', {
        mockTestId: mockTest.id,
        mockTestTitle: mockTest.title,
        attemptId: attemptId,
      });

      router.push(`/tests/attempt/${attemptId}`);
    } catch (error) {
      console.error("Failed to start attempt:", error);
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="flex flex-col gap-4 animate-pulse p-4"><div className="h-8 bg-muted rounded-lg w-1/3" /><div className="h-5 bg-muted rounded-lg w-2/3 mt-2" /><div className="h-[200px] bg-muted rounded-xl mt-6" /></div>;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load mock test" 
        description={error.message} 
        retry={() => {
          setLoading(true);
          setError(null);
          fetchMockTest();
        }} 
      />
    );
  }

  if (!mockTest) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Mock Test not found</h3>
        <Button onClick={() => router.push("/dashboard/mock-tests")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Mock Tests
        </Button>
      </div>
    );
  }

  const questionCount = mockTest.sections?.reduce(
    (acc, section) => acc + (section.questions?.length || 0),
    0
  ) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/dashboard/mock-tests" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Mock Tests
        </Link>
      </div>

      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight">{mockTest.title}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {mockTest.description || "Full-length mock test for your exam preparation."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border bg-muted/50 shadow-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Questions</h3>
            <p className="text-2xl font-bold text-primary">{questionCount}</p>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-muted/50 shadow-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Duration</h3>
            <p className="text-2xl font-bold text-primary">{mockTest.durationMinutes} mins</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-muted/50 shadow-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Exam Type</h3>
            <p className="text-xl font-bold text-primary uppercase">{mockTest.examType}</p>
          </CardContent>
        </Card>
      </div>

      {(!mockTest.isFree && (!user || user.subscriptionTier === "FREE")) ? (
        <PaywallGate contentType="Mock Test" title="Premium Mock Test" />
      ) : (
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm text-center">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Important Instructions</h3>
          <ul className="text-muted-foreground mb-8 max-w-lg mx-auto text-left list-disc list-inside space-y-2">
            <li>Ensure you have a stable internet connection.</li>
            <li>Do not refresh or close the browser window once the test starts.</li>
            <li>Use the "Focus Mode" inside the test to minimize distractions.</li>
            <li>Your test will be automatically submitted when the timer ends.</li>
          </ul>
          
          <Button 
            size="lg" 
            onClick={handleStartMockTest} 
            disabled={starting || questionCount === 0}
            className="w-full sm:w-auto min-w-[200px] text-lg h-14"
          >
            {starting ? (
              "Starting..."
            ) : (
              <>
                <PlayCircle className="w-6 h-6 mr-2" /> Start Mock Test
              </>
            )}
          </Button>
          {questionCount === 0 && (
            <p className="text-rose-500 text-sm mt-4">This mock test has no questions yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
