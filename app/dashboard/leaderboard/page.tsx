"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  student: {
    id: string;
    name: string;
  };
  totalScore: number;
  averageAccuracy: number;
  testsTaken: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/analytics/leaderboard/global");
        setLeaderboard(response.data.data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-slate-400 p-8">Loading leaderboard...</div>;
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Leaders Yet</h2>
        <p className="text-slate-500 max-w-sm">
          No tests have been submitted yet. Be the first to take a mock test and get on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Global Leaderboard</h2>
        <p className="text-slate-500 mt-2">See how you stack up against the competition.</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-slate-50/50 pb-4">
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
                <div key={entry.student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-6 mb-4 sm:mb-0 w-full sm:w-auto">
                    <div className="w-10 text-center">
                      {entry.rank === 1 ? (
                        <Medal className="w-8 h-8 text-rank-gold mx-auto" style={{ color: '#FFD700' }} />
                      ) : entry.rank === 2 ? (
                        <Medal className="w-7 h-7 text-slate-400 mx-auto" />
                      ) : entry.rank === 3 ? (
                        <Medal className="w-6 h-6 text-amber-700 mx-auto" style={{ color: '#CD7F32' }} />
                      ) : (
                        <span className="text-xl font-bold text-slate-400">#{entry.rank}</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isTop3 ? 'text-slate-900' : 'text-slate-700'}`}>
                        {entry.student.name}
                      </h4>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {entry.testsTaken} {entry.testsTaken === 1 ? 'test' : 'tests'} attempted
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-sm w-full sm:w-auto justify-end sm:justify-start">
                    <div className="flex flex-col items-end">
                      <span className="text-slate-500 font-medium mb-1">Total Score</span>
                      <span className={`font-bold text-xl ${isTop3 ? 'text-primary' : 'text-slate-900'}`}>
                        {entry.totalScore}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-slate-500 font-medium mb-1">Avg Accuracy</span>
                      <span className="font-bold text-slate-700">
                        {entry.averageAccuracy}%
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
