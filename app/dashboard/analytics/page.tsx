"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
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

import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { GamificationProfileCard } from "@/components/analytics/GamificationProfileCard";
import { SubjectRadarChart } from "@/components/analytics/SubjectRadarChart";

interface Attempt {
  attemptType: string;
  totalCorrect: number;
  totalIncorrect: number;
  accuracy: number;
  marksObtained: number;
  timeTakenSeconds: number;
  submittedAt: string;
}

interface TestTypeStat {
  totalTests: number;
  averageAccuracy: number;
}

interface AnalyticsData {
  totalTests: number;
  totalCorrect: number;
  totalAttempted: number;
  averageAccuracy: number;
  totalTimeSeconds: number;
  testTypeBreakdown: {
    practice: TestTypeStat;
    mock: TestTypeStat;
    dynamic: TestTypeStat;
  };
  pyqAnalytics: {
    totalAttempted: number;
    averageAccuracy: number;
  };
  subjectWiseStats: {
    name: string;
    slug: string;
    totalQuestions: number;
    accuracy: number;
  }[];
  recentAttempts: Attempt[];
  activity: {
    dailyData: { date: string; count: number }[];
    currentStreak: number;
    longestStreak: number;
    totalContributions: number;
  };
  gamification: {
    xpPoints: number;
    rankTier: string;
  };
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
        <Skeleton className="h-[400px] w-full rounded-3xl" />
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
      <p className="text-muted-foreground mt-2 text-sm max-w-xl">Track your overall progress, analyze your accuracy, and review your daily consistency stats.</p>
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
            <Button variant="default" className="rounded-full px-6 shadow-md hover:-translate-y-0.5 transition-transform" asChild>
              <Link href="/dashboard/practice-sets">Start Practicing</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10 pb-20">
        {PageHeader}

        {/* Gamification Tracker */}
        <GamificationProfileCard 
          xpPoints={data.gamification.xpPoints} 
          rankTier={data.gamification.rankTier} 
          streakDays={data.activity?.currentStreak || 0}
        />

        {/* Premium Hero Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-border shadow-sm bg-card">
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-primary" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tests Taken</p>
              </div>
              <h3 className="text-3xl font-black text-foreground">{data.totalTests}</h3>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm bg-card">
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-success" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Avg Accuracy</p>
              </div>
              <h3 className="text-3xl font-black text-foreground">{data.averageAccuracy}%</h3>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm bg-card">
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-warning" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Questions Attempted</p>
              </div>
              <h3 className="text-3xl font-black text-foreground">{data.totalAttempted}</h3>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm bg-card">
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-accent-foreground" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Study Time</p>
              </div>
              <h3 className="text-3xl font-black text-foreground">{formatTime(data.totalTimeSeconds)}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Test Type & PYQ Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-border shadow-sm bg-card">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Practice Sets</p>
              <div className="flex justify-between items-end">
                <h3 className="text-4xl font-black text-foreground">{data.testTypeBreakdown.practice.totalTests}</h3>
                <span className="text-success font-bold text-sm bg-success/10 px-2 py-1 rounded-md">{data.testTypeBreakdown.practice.averageAccuracy}% Acc</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm bg-card">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Mock Exams</p>
              <div className="flex justify-between items-end">
                <h3 className="text-4xl font-black text-foreground">{data.testTypeBreakdown.mock.totalTests}</h3>
                <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-1 rounded-md">{data.testTypeBreakdown.mock.averageAccuracy}% Acc</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm bg-card">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">PYQ Questions Solved</p>
              <div className="flex justify-between items-end">
                <h3 className="text-4xl font-black text-foreground">{data.pyqAnalytics.totalAttempted}</h3>
                <span className="text-warning font-bold text-sm bg-warning/10 px-2 py-1 rounded-md">{data.pyqAnalytics.averageAccuracy}% Acc</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* GitHub-style Activity Heatmap */}
            {data.activity && (
              <ActivityHeatmap 
                data={data.activity.dailyData}
                currentStreak={data.activity.currentStreak}
                longestStreak={data.activity.longestStreak}
                totalContributions={data.activity.totalContributions}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <SubjectRadarChart data={data.subjectWiseStats} />
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <Card className="border-border shadow-sm relative overflow-hidden bg-card/50">
          {(!user?.subscriptionTier || user.subscriptionTier === 'FREE') && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Analytics Locked</h3>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">Upgrade to Pro to view your complete attempt history and personalized performance insights.</p>
              <Button onClick={() => setShowPaywall(true)} className="rounded-full shadow-md hover:-translate-y-0.5 transition-transform px-6">
                Unlock Advanced Analytics
              </Button>
            </div>
          )}
          <CardHeader className="border-b border-border bg-muted/20 pb-5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {data.recentAttempts.map((attempt, idx) => (
                <div key={idx} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full mt-1.5 border-2",
                      attempt.attemptType === 'MOCK' ? "bg-primary border-primary/20" : attempt.attemptType === 'DYNAMIC_PRACTICE' ? "bg-warning border-warning/20" : "bg-success border-success/20"
                    )} />
                    {idx !== data.recentAttempts.length - 1 && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="mb-4 sm:mb-0">
                      <h4 className="font-bold text-foreground capitalize flex items-center gap-2">
                        {attempt.attemptType.toLowerCase().replace('_', ' ')}
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                          attempt.attemptType === 'MOCK' ? "bg-primary/10 text-primary" : attempt.attemptType === 'DYNAMIC_PRACTICE' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                        )}>
                          {attempt.attemptType}
                        </span>
                      </h4>
                      <p className="text-xs font-medium text-muted-foreground mt-1">
                        Submitted {formatDistanceToNow(new Date(attempt.submittedAt), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Score</span>
                        <span className="font-black text-foreground">{attempt.marksObtained} <span className="text-muted-foreground font-medium text-xs">pts</span></span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Accuracy</span>
                        <span className="font-black text-foreground">{Math.round(attempt.accuracy)}%</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Time</span>
                        <span className="font-bold text-foreground text-sm">{formatTime(attempt.timeTakenSeconds)}</span>
                      </div>
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
