"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock, CheckCircle2, Target, Trophy, Lock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { PaywallModal } from "@/components/pricing/PaywallModal";

import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { GamificationProfileCard } from "@/components/analytics/GamificationProfileCard";
import { SubjectRadarChart } from "@/components/analytics/SubjectRadarChart";
import { DangerZonesWidget } from "@/components/analytics/DangerZonesWidget";
import { PeerComparisonChart } from "@/components/analytics/PeerComparisonChart";
import { MasteryTrendsChart } from "@/components/analytics/MasteryTrendsChart";

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
  const [peerComparison, setPeerComparison] = useState<any>(null);
  const [masteryTrends, setMasteryTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useAuthStore((state) => state.user);
  const [showPaywall, setShowPaywall] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const [dashRes, peerRes, trendRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/peer-comparison").catch(() => ({ data: { data: null } })),
        api.get("/analytics/mastery-trends").catch(() => ({ data: { data: [] } }))
      ]);
      setData(dashRes.data.data);
      setPeerComparison(peerRes.data.data);
      setMasteryTrends(trendRes.data.data);
    } catch (err: any) {
      console.error("Failed to load analytics:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load analytics"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchAnalytics();
    })();
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
      <div className="space-y-8 pb-20">
        <Skeleton className="h-[200px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load analytics" 
        description={error.message} 
        retry={() => {
          setLoading(true);
          setError(null);
          fetchAnalytics();
        }}
      />
    );
  }

  if (!data || data.totalTests === 0) {
    return (
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your progress, identify weak points, and see how you stack up.</p>
        </div>
        <EmptyState 
          icon={Activity}
          title="No Analytics Yet"
          description="You haven't taken any tests yet. Complete a Practice Set or Mock Test to see your performance metrics here!"
          action={
            <Button variant="default" className="rounded-2xl px-6 py-5 font-extrabold shadow-md hover:-translate-y-0.5 transition-transform" asChild>
              <Link href="/dashboard/practice-sets">Start Practicing</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12 pb-20">
        
        {/* STANDARD PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your progress, identify weak points, and see how you stack up.</p>
        </div>
        
        {/* PHASE 1: THE BIRD'S EYE VIEW */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Phase 1: The Bird's Eye View</h2>
            <p className="text-sm text-muted-foreground mt-1">A quick summary of your overall effort.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="rounded-3xl border border-primary/10 p-5 shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <Trophy className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Tests Taken</p>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{data.totalTests}</h3>
            </Card>
            
            <Card className="rounded-3xl border border-success/20 p-5 shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-success/10 p-2 rounded-xl text-success">
                  <Target className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Avg Accuracy</p>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{data.averageAccuracy}%</h3>
            </Card>
            
            <Card className="rounded-3xl border border-warning/20 p-5 shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-warning/10 p-2 rounded-xl text-warning">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Qs Attempted</p>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{data.totalAttempted}</h3>
            </Card>
            
            <Card className="rounded-3xl border border-primary/10 p-5 shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Study Time</p>
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{formatTime(data.totalTimeSeconds)}</h3>
            </Card>
          </div>
        </section>

        {/* PHASE 2: STRENGTHS & WEAKNESSES */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Phase 2: Strengths & Weaknesses</h2>
            <p className="text-sm text-muted-foreground mt-1">What you're good at, and where you're losing marks.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DangerZonesWidget />
            <div className="bg-card border border-primary/10 rounded-3xl p-6 shadow-sm">
               <SubjectRadarChart data={data.subjectWiseStats} />
            </div>
          </div>
        </section>

        {/* PHASE 3: PROGRESS & CONSISTENCY */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Phase 3: Progress & Consistency</h2>
            <p className="text-sm text-muted-foreground mt-1">Are you improving over time? Your mastery trends and daily habits.</p>
          </div>

          <div className="space-y-8">
            {masteryTrends && masteryTrends.length > 0 && (
              <div className="w-full">
                <MasteryTrendsChart data={masteryTrends} />
              </div>
            )}
            
            {data.activity && (
              <div className="w-full">
                <ActivityHeatmap 
                  data={data.activity.dailyData}
                  currentStreak={data.activity.currentStreak}
                  longestStreak={data.activity.longestStreak}
                  totalContributions={data.activity.totalContributions}
                />
              </div>
            )}
          </div>
        </section>

        {/* PHASE 4: THE COMPETITION */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Phase 4: The Competition</h2>
            <p className="text-sm text-muted-foreground mt-1">How you stack up against the rest of the aspirant pool.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GamificationProfileCard 
              xpPoints={data.gamification.xpPoints} 
              rankTier={data.gamification.rankTier} 
              streakDays={data.activity?.currentStreak || 0}
            />
            {peerComparison && (
              <PeerComparisonChart data={peerComparison} />
            )}
          </div>
        </section>

        {/* PHASE 5: RECENT ACTIONS */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Phase 5: Recent Actions</h2>
            <p className="text-sm text-muted-foreground mt-1">Your latest test submissions.</p>
          </div>

          <Card className="rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden bg-card">
            {(!user?.subscriptionTier || user.subscriptionTier === 'FREE') && (
              <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-2">Detailed History Locked</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">Upgrade to Pro to view your complete attempt history and personalized performance insights.</p>
                <Button onClick={() => setShowPaywall(true)} className="rounded-full shadow-md hover:-translate-y-0.5 transition-transform px-6">
                  Unlock Advanced Analytics
                </Button>
              </div>
            )}
            <div className="p-6 pb-4 flex items-center gap-2 border-b border-primary/5">
              <div className="bg-primary/10 p-1.5 rounded-xl text-primary">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Activity Feed</h3>
            </div>
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
                    
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 p-4 rounded-2xl border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="mb-4 sm:mb-0">
                        <h4 className="font-bold text-foreground capitalize flex items-center gap-2">
                          {attempt.attemptType.toLowerCase().replace('_', ' ')}
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-xl",
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
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Score</span>
                          <span className="font-black text-foreground">{attempt.marksObtained} <span className="text-muted-foreground font-bold text-[10px]">pts</span></span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Accuracy</span>
                          <span className="font-black text-foreground">{Math.round(attempt.accuracy)}%</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Time</span>
                          <span className="font-black text-foreground text-sm">{formatTime(attempt.timeTakenSeconds)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        featureName="Advanced Analytics" 
      />
    </>
  );
}
