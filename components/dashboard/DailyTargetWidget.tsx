"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Flame, PlayCircle, Trophy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DailyTargetWidget() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isToday = (dateString: string | null | undefined) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  const hasCompletedToday = isToday(user?.lastActiveDate);
  const streakDays = user?.streakDays || 0;

  const startDailyQuiz = async () => {
    try {
      setLoading(true);
      // 1. Fetch today's quiz
      const { data } = await api.get("/daily-quiz/today");
      const quiz = data.data;

      // 2. Start attempt
      const attemptRes = await api.post("/attempts/daily-quiz", {
        dailyQuizId: quiz.id,
      });

      const attempt = attemptRes.data.data;
      router.push(`/test-engine/${attempt.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start daily quiz");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Trophy className="w-24 h-24" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Daily 10-Min Target</h2>
            {hasCompletedToday && (
              <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/20" />
            )}
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            {hasCompletedToday 
              ? "You've crushed your daily target! Come back tomorrow to keep the streak alive." 
              : "Keep your streak alive! Complete a quick 10-minute revision challenge to earn XP and boost your retention."}
          </p>
          
          <div className="flex items-center gap-4 pt-2">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
              hasCompletedToday ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground"
            )}>
              <Flame className={cn("w-4 h-4", hasCompletedToday && "fill-orange-500")} />
              {streakDays} Day Streak
            </div>
          </div>
        </div>

        <div>
          <Button 
            size="lg" 
            className="w-full md:w-auto rounded-xl gap-2 font-bold"
            disabled={hasCompletedToday || loading}
            onClick={startDailyQuiz}
          >
            {hasCompletedToday ? (
              <>Completed</>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                {loading ? "Starting..." : "Start Challenge"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
