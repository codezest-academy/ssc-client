"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Medal,
  Trophy,
  Flame,
  Zap,
  Star,
  Award,
  Info,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  criteria: string;
}

interface UserBadge {
  id: string;
  badgeId: string;
  awardedAt: string;
  badge: Badge;
}

type RankTier = "ASPIRANT" | "CONSTABLE" | "SUB_INSPECTOR" | "INSPECTOR" | "COMMISSIONER";

interface GamificationProfile {
  xpPoints: number;
  rankTier: RankTier;
  streakDays: number;
  badges: UserBadge[];
}

// ─── Rank Config ───────────────────────────────────────────────────────────
// Must match RankTier enum in ssc-api/prisma/schema.prisma

interface RankConfig {
  name: RankTier;
  label: string;
  minXP: number;
  color: string;
  bg: string;
  border: string;
  ring: string;
  icon: React.ElementType;
  description: string;
}

const RANKS: RankConfig[] = [
  {
    name: "ASPIRANT",
    label: "Aspirant",
    minXP: 0,
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
    ring: "ring-border",
    icon: Shield,
    description: "Starting point — every journey begins here.",
  },
  {
    name: "CONSTABLE",
    label: "Constable",
    minXP: 500,
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/30",
    ring: "ring-info/40",
    icon: Shield,
    description: "You've got momentum. Keep the practice going.",
  },
  {
    name: "SUB_INSPECTOR",
    label: "Sub Inspector",
    minXP: 2000,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    ring: "ring-success/40",
    icon: Medal,
    description: "Consistent effort is paying off. You're above average.",
  },
  {
    name: "INSPECTOR",
    label: "Inspector",
    minXP: 5000,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    ring: "ring-warning/40",
    icon: Award,
    description: "Highly dedicated. You're in the top tier of aspirants.",
  },
  {
    name: "COMMISSIONER",
    label: "Commissioner",
    minXP: 10000,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    ring: "ring-primary/40",
    icon: Trophy,
    description: "Elite rank. You're among the best on the platform.",
  },
];

function getRankConfig(tier: RankTier): RankConfig {
  return RANKS.find((r) => r.name === tier) ?? RANKS[0];
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function GamificationSkeleton() {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <Skeleton className="h-9 w-56 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-3xl" />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function GamificationPage() {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data: GamificationProfile }>("/gamification/profile");
      setProfile(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(new Error(e.response?.data?.message ?? e.message ?? "Failed to load rank profile"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await fetchProfile(); })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <GamificationSkeleton />;

  if (error) {
    return (
      <ErrorState
        title="Failed to load rank profile"
        description={error.message}
        retry={() => { setError(null); fetchProfile(); }}
      />
    );
  }

  if (!profile) return null;

  const currentRankConfig = getRankConfig(profile.rankTier);
  const currentRankIndex  = RANKS.findIndex((r) => r.name === profile.rankTier);
  const nextRankConfig     = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;
  const RankIcon           = currentRankConfig.icon;

  const xpProgress = nextRankConfig
    ? Math.min(
        100,
        Math.max(
          0,
          ((profile.xpPoints - currentRankConfig.minXP) /
            (nextRankConfig.minXP - currentRankConfig.minXP)) *
            100
        )
      )
    : 100;

  return (
    <div className="space-y-10 pb-20">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display tracking-tight flex items-center gap-3">
            <span className={cn("p-2 rounded-2xl", currentRankConfig.bg, currentRankConfig.color)}>
              <Trophy className="w-6 h-6" />
            </span>
            Rank &amp; Gamification
          </h1>
          <p className="text-muted-foreground mt-2">
            Earn XP by completing tests. Level up through SSC rank tiers.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="mt-1 text-muted-foreground hover:text-foreground shrink-0">
              <Info className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-5 h-5 text-primary" />
                How XP Works
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 text-sm text-muted-foreground">
              <p>
                XP is automatically awarded every time you submit a test — practice sets,
                mock tests, and the daily quiz all count.
              </p>
              <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-2">
                <h4 className="font-bold text-foreground">Formula per submission:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong className="text-foreground">(Marks obtained × 10)</strong></li>
                  <li><strong className="text-foreground">+ (Accuracy % × 5)</strong></li>
                  <li>Minimum <strong className="text-foreground">0 XP</strong> — you never lose XP</li>
                </ul>
              </div>
              <p className="text-xs">
                Example: 50 marks at 80% accuracy = (50×10) + (80×5) = <strong className="text-foreground">900 XP</strong>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Hero Rank Card ── */}
      <Card
        className={cn(
          "rounded-3xl border shadow-sm relative overflow-hidden",
          currentRankConfig.border
        )}
      >
        {/* Background glow */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-10",
            currentRankConfig.bg
          )}
        />

        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Rank badge */}
            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center border-4 shadow-lg ring-4",
                  currentRankConfig.bg,
                  currentRankConfig.border,
                  currentRankConfig.ring
                )}
              >
                <RankIcon className={cn("w-12 h-12", currentRankConfig.color)} />
              </div>
              <span
                className={cn(
                  "text-sm font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                  currentRankConfig.bg,
                  currentRankConfig.color,
                  currentRankConfig.border
                )}
              >
                {currentRankConfig.label}
              </span>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                    Total XP
                  </p>
                  <p className="font-mono text-3xl font-black text-foreground">
                    {profile.xpPoints.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                    Day Streak
                  </p>
                  <p className="font-mono text-3xl font-black text-foreground flex items-end gap-1">
                    {profile.streakDays}
                    <Flame className="w-5 h-5 text-warning fill-warning/50 mb-1" />
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                    Badges
                  </p>
                  <p className="font-mono text-3xl font-black text-foreground">
                    {profile.badges.length}
                  </p>
                </div>
              </div>

              {/* XP Progress bar */}
              {nextRankConfig ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">
                      Progress to {nextRankConfig.label}
                    </span>
                    <span className={currentRankConfig.color}>
                      {nextRankConfig.minXP.toLocaleString()} XP needed
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50 relative">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000 ease-out absolute left-0 top-0 rounded-full",
                        // Use bg equivalent of current rank color
                        currentRankConfig.name === "ASPIRANT"      ? "bg-muted-foreground" :
                        currentRankConfig.name === "CONSTABLE"     ? "bg-info"             :
                        currentRankConfig.name === "SUB_INSPECTOR" ? "bg-success"          :
                        currentRankConfig.name === "INSPECTOR"     ? "bg-warning"          :
                                                                     "bg-primary"
                      )}
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground text-right">
                    <strong className="text-foreground">
                      {Math.max(0, nextRankConfig.minXP - profile.xpPoints).toLocaleString()} XP
                    </strong>{" "}
                    to {nextRankConfig.label}
                  </p>
                </div>
              ) : (
                <div className={cn("rounded-2xl border p-4 text-center", currentRankConfig.bg, currentRankConfig.border)}>
                  <Trophy className={cn("w-6 h-6 mx-auto mb-1", currentRankConfig.color)} />
                  <p className={cn("font-bold text-sm", currentRankConfig.color)}>
                    Maximum rank achieved! You&apos;re a Commissioner.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Rank Ladder ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Rank Ladder</h2>

        <div className="space-y-3">
          {RANKS.map((rank, idx) => {
            const isCurrentRank  = rank.name === profile.rankTier;
            const isAchieved     = idx <= currentRankIndex;
            const RankItemIcon   = rank.icon;

            return (
              <div
                key={rank.name}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                  isCurrentRank
                    ? cn("shadow-sm", rank.bg, rank.border)
                    : isAchieved
                    ? "bg-muted/30 border-border/50"
                    : "bg-card border-border/40 opacity-50"
                )}
              >
                {/* Rank icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2",
                    isCurrentRank ? cn(rank.bg, rank.border) : isAchieved ? "bg-muted border-border" : "bg-muted/50 border-border/40"
                  )}
                >
                  <RankItemIcon
                    className={cn(
                      "w-5 h-5",
                      isCurrentRank ? rank.color : isAchieved ? "text-muted-foreground" : "text-muted-foreground/40"
                    )}
                  />
                </div>

                {/* Rank info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-black text-sm", isCurrentRank ? rank.color : isAchieved ? "text-foreground" : "text-muted-foreground/60")}>
                      {rank.label}
                    </span>
                    {isCurrentRank && (
                      <span className={cn("text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border", rank.bg, rank.color, rank.border)}>
                        Current
                      </span>
                    )}
                    {isAchieved && !isCurrentRank && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                        ✓ Achieved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{rank.description}</p>
                </div>

                {/* XP threshold */}
                <div className="shrink-0 text-right">
                  <p className="font-mono font-bold text-sm text-foreground">
                    {rank.minXP.toLocaleString()} XP
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Badges ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Badges</h2>
          <span className="text-sm font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
            {profile.badges.length}
          </span>
        </div>

        {profile.badges.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No badges yet"
            description="Complete tests and hit milestones to earn your first badge!"
            action={
              <Button className="rounded-full px-6" asChild>
                <Link href="/dashboard/daily-quiz">
                  <Zap className="w-4 h-4 mr-2" />
                  Take Today&apos;s Quiz
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.badges.map((ub) => (
              <Card key={ub.id} className="rounded-2xl border border-border/60 bg-card hover:shadow-md hover:-translate-y-0.5 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-black">{ub.badge.name}</CardTitle>
                      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest font-bold">
                        {format(new Date(ub.awardedAt), "d MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ub.badge.description}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground/60 mt-2 uppercase">
                    {ub.badge.criteria}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── How to Earn XP — CTA ── */}
      <Card className="rounded-3xl border border-primary/15 bg-primary/5 shadow-sm">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 space-y-1">
            <h3 className="font-black text-foreground text-lg">Earn more XP today</h3>
            <p className="text-sm text-muted-foreground">
              Take the daily quiz (10 min), a practice set, or a full mock test. Every submission counts.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/dashboard/practice-sets">
                Practice Sets
              </Link>
            </Button>
            <Button className="rounded-full font-bold shadow-md" asChild>
              <Link href="/dashboard/daily-quiz">
                <Zap className="w-4 h-4 mr-2" />
                Daily Quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
