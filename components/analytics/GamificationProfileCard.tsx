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

// Rank tiers must match the RankTier enum in the API (ssc-api/prisma/schema.prisma)
// XP-only thresholds — streaks do NOT gate tier progression in the current implementation
const RANKS = [
  { name: "ASPIRANT",      minXP: 0,      color: "text-muted-foreground", bg: "bg-muted",          border: "border-border"          },
  { name: "CONSTABLE",     minXP: 500,    color: "text-info",             bg: "bg-info/10",         border: "border-info/20"         },
  { name: "SUB_INSPECTOR", minXP: 2000,   color: "text-success",          bg: "bg-success/10",      border: "border-success/20"      },
  { name: "INSPECTOR",     minXP: 5000,   color: "text-warning",          bg: "bg-warning/10",      border: "border-warning/20"      },
  { name: "COMMISSIONER",  minXP: 10000,  color: "text-primary",          bg: "bg-primary/10",      border: "border-primary/20"      },
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
                  <h4 className="font-bold text-foreground">XP Formula:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-foreground">(Marks × 10)</strong> from your score</li>
                    <li><strong className="text-foreground">+ (Accuracy% × 5)</strong> bonus</li>
                    <li>Minimum <strong className="text-foreground">0 XP</strong> — you never lose XP</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Rank Thresholds:</h4>
                  <ul className="space-y-1">
                    {RANKS.map(r => (
                      <li key={r.name} className="flex justify-between items-center bg-card border border-border p-2 rounded-lg">
                        <span className={cn("font-bold text-xs uppercase tracking-wider px-2 py-1 rounded-md", r.bg, r.color)}>{r.name.replace("_", " ")}</span>
                        <div className="font-mono text-foreground font-semibold">{r.minXP.toLocaleString()} XP</div>
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
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-widest">Progress to {nextRank.name.replace("_", " ")}</span>
              <span className="text-primary">{nextRank.minXP.toLocaleString()} XP</span>
            </div>
            <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border/50 relative">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out absolute left-0 top-0"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-center font-medium text-muted-foreground">
              <strong className="text-foreground">{Math.max(0, nextRank.minXP - xpPoints).toLocaleString()} XP</strong> to next rank
            </p>
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
