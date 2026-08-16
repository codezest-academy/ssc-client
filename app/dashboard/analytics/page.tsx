"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle2, Target, Trophy, Flame } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { PaywallModal } from "@/components/pricing/PaywallModal";
import { Lock } from "lucide-react";

interface Attempt {
  attemptType: string;
  totalCorrect: number;
  totalIncorrect: number;
  accuracy: number;
  marksObtained: number;
  timeTakenSeconds: number;
  submittedAt: string;
}

interface AnalyticsData {
  totalTests: number;
  totalCorrect: number;
  totalAttempted: number;
  averageAccuracy: number;
  totalTimeSeconds: number;
  recentAttempts: Attempt[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useAuthStore((state) => state.user);
  const [showPaywall, setShowPaywall] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/analytics/dashboard");
      setData(response.data.data);
    } catch (err: any) {
      console.error("Failed to load analytics:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load analytics"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load analytics" 
        description={error.message} 
        retry={fetchAnalytics} 
      />
    );
  }

  const PageHeader = (
    <div>
      <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Your Performance</h1>
      <p className="text-muted-foreground mt-2">Track your progress, accuracy, and study time.</p>
    </div>
  );

  if (!data || data.totalTests === 0) {
    return (
      <div className="space-y-8">
        {PageHeader}
        <EmptyState 
          icon={Activity}
          title="No Analytics Yet"
          description="You haven't taken any tests yet. Complete a Practice Set or Mock Test to see your performance metrics here!"
          action={
            <Button variant="default" className="rounded-full px-6" asChild>
              <Link href="/dashboard/practice-sets">Start Practicing</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {PageHeader}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total Tests Taken</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{data.totalTests}</h3>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-success" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-foreground">{Math.round(data.averageAccuracy)}%</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-warning" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Questions Attempted</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-bold text-foreground">{data.totalAttempted}</h3>
                <span className="text-sm font-medium text-success">({data.totalCorrect} correct)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Total Time Spent</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{formatTime(data.totalTimeSeconds)}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Timeline */}
        <Card className="border-border shadow-sm relative overflow-hidden">
          {(!user?.subscriptionTier || user.subscriptionTier === 'FREE') && (
            <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Analytics Locked</h3>
              <p className="text-muted-foreground max-w-md mb-6">Upgrade to Pro to view your complete attempt history and personalized performance insights.</p>
              <Button onClick={() => setShowPaywall(true)} className="rounded-full shadow-md">
                Unlock Advanced Analytics
              </Button>
            </div>
          )}
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.recentAttempts.map((attempt, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className={`mt-1 w-2 h-2 rounded-full ${attempt.attemptType === 'MOCK' ? 'bg-primary' : 'bg-success'}`} />
                    <div>
                      <h4 className="font-semibold text-foreground capitalize">
                        {attempt.attemptType.toLowerCase().replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Submitted {formatDistanceToNow(new Date(attempt.submittedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-muted-foreground font-medium mb-1">Score</span>
                      <span className="font-bold text-foreground">{attempt.marksObtained} marks</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-muted-foreground font-medium mb-1">Accuracy</span>
                      <span className={`font-bold ${attempt.accuracy >= 70 ? 'text-success' : attempt.accuracy >= 40 ? 'text-warning' : 'text-destructive'}`}>
                        {Math.round(attempt.accuracy)}%
                      </span>
                    </div>
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-muted-foreground font-medium mb-1">Time</span>
                      <span className="font-medium text-muted-foreground">{formatTime(attempt.timeTakenSeconds)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName="Advanced Analytics" 
      />
    </>
  );
}
