import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GamificationProfileCardProps {
  xpPoints: number;
  rankTier: string;
  streakDays: number;
}

const RANKS = [
  { name: "ASPIRANT", minXP: 0, minStreak: 0, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  { name: "CHALLENGER", minXP: 10000, minStreak: 0, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { name: "ACHIEVER", minXP: 50000, minStreak: 7, color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  { name: "MASTER", minXP: 250000, minStreak: 30, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { name: "LEGEND", minXP: 1000000, minStreak: 90, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
];

export function GamificationProfileCard({ xpPoints, rankTier, streakDays }: GamificationProfileCardProps) {
  const currentIndex = RANKS.findIndex(r => r.name === rankTier) !== -1 
    ? RANKS.findIndex(r => r.name === rankTier) 
    : 0;
  
  const currentRank = RANKS[currentIndex];
  const nextRank = currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;

  const xpProgress = nextRank 
    ? Math.min(100, Math.max(0, ((xpPoints - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100))
    : 100;

  const streakProgress = nextRank && nextRank.minStreak > 0
    ? Math.min(100, Math.max(0, (streakDays / nextRank.minStreak) * 100))
    : 100;

  return (
    <Card className="border-border shadow-sm relative overflow-hidden bg-card/50">
      <CardHeader className="border-b border-border bg-muted/20 pb-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            Rank & Experience
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Info className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Trophy className="w-5 h-5 text-primary" />
                  How XP & Streaks Work
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm text-muted-foreground">
                <p>
                  Experience Points (XP) and daily consistency determine your global Rank Tier. Earn XP by attempting Practice Sets and Mock Tests.
                </p>
                <div className="space-y-2 bg-muted/30 p-4 rounded-xl border border-border">
                  <h4 className="font-bold text-foreground">Scoring Rules:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-foreground">+100 XP</strong> per Mark Obtained</li>
                    <li><strong className="text-foreground">Up to +5,000 XP</strong> Accuracy Bonus per test</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Rank Requirements:</h4>
                  <ul className="space-y-1">
                    {RANKS.map(r => (
                      <li key={r.name} className="flex justify-between items-center bg-card border border-border p-2 rounded-lg">
                        <span className={cn("font-bold text-xs uppercase tracking-wider px-2 py-1 rounded-md", r.bg, r.color)}>{r.name}</span>
                        <div className="text-right">
                          <div className="font-mono text-foreground font-semibold">{r.minXP.toLocaleString()} XP</div>
                          {r.minStreak > 0 && <div className="text-[10px] text-muted-foreground">{r.minStreak} Day Streak</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Current Tier</p>
            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border", currentRank.bg, currentRank.border)}>
              <span className={cn("font-black text-lg", currentRank.color)}>{currentRank.name}</span>
            </div>
          </div>
          <div className="flex gap-6 text-right">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Streak</p>
              <p className="font-mono text-3xl font-black text-foreground">{streakDays} <span className="text-sm font-bold text-muted-foreground">days</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total XP</p>
              <p className="font-mono text-3xl font-black text-foreground">{xpPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {nextRank ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">XP Progress</span>
                <span className="text-primary">{nextRank.minXP.toLocaleString()} XP Req</span>
              </div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border/50 relative">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out absolute left-0 top-0" 
                  style={{ width: `${xpProgress}%` }} 
                />
              </div>
              <p className="text-xs text-center font-medium text-muted-foreground">
                <strong className="text-foreground">{Math.max(0, nextRank.minXP - xpPoints).toLocaleString()} XP</strong> needed
              </p>
            </div>

            {nextRank.minStreak > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">Streak Progress</span>
                  <span className="text-amber-500">{nextRank.minStreak} Days Req</span>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border/50 relative">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 ease-out absolute left-0 top-0" 
                    style={{ width: `${streakProgress}%` }} 
                  />
                </div>
                <p className="text-xs text-center font-medium text-muted-foreground">
                  <strong className="text-foreground">{Math.max(0, nextRank.minStreak - streakDays)} days</strong> needed
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center bg-muted/20 border border-border rounded-xl p-4">
                <p className="text-sm font-medium text-muted-foreground">No streak required for {nextRank.name}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-bold text-primary">You reached the maximum rank!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
