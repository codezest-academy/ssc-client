"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle2, Target, Trophy, Flame } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/analytics/dashboard");
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };
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
    return <div className="text-slate-400 p-8">Loading analytics...</div>;
  }

  if (!data || data.totalTests === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Activity className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Analytics Yet</h2>
        <p className="text-slate-500 max-w-sm">
          You haven't taken any tests yet. Complete a Practice Set or Mock Test to see your performance metrics here!
        </p>
        <Link 
          href="/dashboard/practice-sets" 
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Start Practicing
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Performance</h2>
        <p className="text-slate-500 mt-2">Track your progress, accuracy, and study time.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Tests Taken</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{data.totalTests}</h3>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Average Accuracy</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-slate-900">{Math.round(data.averageAccuracy)}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Questions Attempted</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-slate-900">{data.totalAttempted}</h3>
              <span className="text-sm font-medium text-emerald-600">({data.totalCorrect} correct)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Time Spent</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatTime(data.totalTimeSeconds)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-slate-50/50 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {data.recentAttempts.map((attempt, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className={`mt-1 w-2 h-2 rounded-full ${attempt.attemptType === 'MOCK' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                  <div>
                    <h4 className="font-semibold text-slate-900 capitalize">
                      {attempt.attemptType.toLowerCase().replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Submitted {formatDistanceToNow(new Date(attempt.submittedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 text-sm">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500 font-medium mb-1">Score</span>
                    <span className="font-bold text-slate-900">{attempt.marksObtained} marks</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500 font-medium mb-1">Accuracy</span>
                    <span className={`font-bold ${attempt.accuracy >= 70 ? 'text-emerald-600' : attempt.accuracy >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {Math.round(attempt.accuracy)}%
                    </span>
                  </div>
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-slate-500 font-medium mb-1">Time</span>
                    <span className="font-medium text-slate-700">{formatTime(attempt.timeTakenSeconds)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
