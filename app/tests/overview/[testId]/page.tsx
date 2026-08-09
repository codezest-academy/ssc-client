"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { api } from "@/lib/axios";

export default function TestOverviewPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  const testId = resolvedParams.testId;
  const router = useRouter();
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await api.get(`/mock-tests/${testId}`);
        setTestData(data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load test details");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  const handleStartTest = async () => {
    if (!agreed) return;
    setStarting(true);
    setError("");

    try {
      const { data } = await api.post("/attempts/start", {
        attemptType: "MOCK",
        mockTestId: testId,
      });
      // Redirect to the actual attempt page
      router.push(`/tests/attempt/${data.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start the test");
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Error Loading Test</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            {testData.examType.replace(/_/g, " ")}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{testData.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {testData.durationMinutes} Minutes</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {testData.totalQuestions} Questions</span>
            <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> {testData.totalMarks} Max Marks</span>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
            <p>Please read the following instructions carefully before starting the test:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The clock has been set at the server and the countdown timer at the top right corner of your screen will display the time remaining for you to complete the exam.</li>
              <li>When the clock runs out the exam ends by default - you are not required to end or submit your exam.</li>
              <li>You are awarded <strong>+{testData.markingCorrect}</strong> marks for every correct answer.</li>
              <li>There is a negative marking of <strong>{testData.markingIncorrect}</strong> marks for every incorrect answer.</li>
              <li>Unanswered questions will receive <strong>{testData.markingSkipped}</strong> marks.</li>
              <li>Do not refresh the page or click the browser back button while taking the test.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Area */}
        <div className="space-y-6 bg-card border border-border p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="agree" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)} 
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I agree that in case of not adhering to the instructions, I will be disqualified from giving the exam.
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              size="lg" 
              onClick={handleStartTest} 
              disabled={!agreed || starting}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {starting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Test...
                </>
              ) : (
                "Begin Test"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
