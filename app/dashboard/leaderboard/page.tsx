"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  student: {
    id: string;
    name: string;
  };
  xpPoints: number;
  rankTier: string;
  testsTaken: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get("/analytics/leaderboard/global");
      setLeaderboard(response.data.data);
    } catch (err: any) {
      console.error("Failed to load leaderboard:", err);
      setError(err instanceof Error ? err : new Error(err.response?.data?.message || err.message || "Failed to load leaderboard"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    (async () => {


      await fetchLeaderboard();


    })();


  }, []);

  const PageHeader = (
    <div>
      <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">Global Leaderboard</h1>
      <p className="text-muted-foreground mt-2">See how you stack up against the competition.</p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        {PageHeader}
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex p-6 justify-between items-center">
                  <div className="flex items-center gap-6">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-[150px] mb-2" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                  <div className="flex gap-8">
                     <Skeleton className="h-10 w-[60px]" />
                     <Skeleton className="h-10 w-[60px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        {PageHeader}
        <ErrorState 
          title="Failed to load leaderboard" 
          description={error.message} 
          retry={() => {
          setLoading(true);
          setError(null);
          fetchLeaderboard();
        }} 
        />
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="space-y-8">
        {PageHeader}
        <EmptyState 
          icon={Trophy}
          title="No Leaders Yet"
          description="No tests have been submitted yet. Be the first to take a mock test and get on the leaderboard!"
          action={
            <Button variant="default" className="rounded-full px-6" asChild>
              <Link href="/dashboard/mock-tests">Take a Mock Test</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {PageHeader}

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {leaderboard.map((entry) => {
              const isTop3 = entry.rank <= 3;
              return (
                <div key={entry.student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-6 mb-4 sm:mb-0 w-full sm:w-auto">
                    <div className="w-10 text-center">
                      {entry.rank === 1 ? (
                        <Medal className="w-8 h-8 text-rank-gold mx-auto" />
                      ) : entry.rank === 2 ? (
                        <Medal className="w-7 h-7 text-muted-foreground mx-auto" />
                      ) : entry.rank === 3 ? (
                        <Medal className="w-6 h-6 text-warning mx-auto" />
                      ) : (
                        <span className="text-xl font-bold text-muted-foreground">#{entry.rank}</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isTop3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {entry.student.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {entry.testsTaken} {entry.testsTaken === 1 ? 'test' : 'tests'} attempted
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-sm w-full sm:w-auto justify-end sm:justify-start">
                    <div className="flex flex-col items-end">
                      <span className="text-muted-foreground font-medium mb-1">XP Points</span>
                      <span className={`font-bold text-xl ${isTop3 ? 'text-primary' : 'text-foreground'}`}>
                        {entry.xpPoints.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-muted-foreground font-medium mb-1">Rank Tier</span>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-2 py-1 bg-muted rounded-full">
                        {entry.rankTier}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
