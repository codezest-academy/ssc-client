"use client";

import Link from "next/link";
import { Lock, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { QuestionRenderer } from "@/components/ui/question-renderer";

interface QuestionOption {
  key: string;
  text: string;
  rationale?: string;
}

interface Question {
  id: string;
  content: string;
  difficulty: string;
  options: QuestionOption[];
  correctOption: string;
}

interface FreemiumPaperGateProps {
  lockedQuestions: Question[];
  startIndex: number;
  examLabel: string;
}

/**
 * FreemiumPaperGate
 *
 * Client component that renders locked PYQ paper questions based on auth state:
 *
 * - Not logged in     → show sign-in CTA card, questions hidden
 * - Logged in, FREE   → show upgrade CTA card, questions hidden
 * - Logged in, PRO+   → show all questions (full access)
 *
 * The server page always sends all questions down — gating is UI-only.
 * Future: backend will return only preview questions for unauthenticated requests.
 */
export function FreemiumPaperGate({
  lockedQuestions,
  startIndex,
  examLabel,
}: FreemiumPaperGateProps) {
  const { user, isHydrated } = useAuthStore();

  // Determine access level
  const isPremium =
    user?.subscriptionTier === "PRO" || user?.subscriptionTier === "ELITE";

  // Full access — render all locked questions normally
  if (isHydrated && isPremium) {
    return (
      <>
        {lockedQuestions.map((q, i) => (
          <FullQuestion
            key={q.id}
            question={q}
            index={startIndex + i}
            examLabel={examLabel}
          />
        ))}
      </>
    );
  }

  // Pre-hydration or restricted — show paywall
  return (
    <div className="relative">
      {/* Blurred preview of the first locked question */}
      <div className="relative overflow-hidden rounded-xl border border-border">
        <div className="select-none pointer-events-none blur-sm opacity-50 p-6 bg-card">
          <div className="h-5 bg-muted rounded w-3/4 mb-3" />
          <div className="h-4 bg-muted rounded w-full mb-2" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      {/* Paywall CTA card */}
      <div className="mt-4 border border-border bg-muted rounded-xl p-8 text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-7 h-7 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            Unlock {lockedQuestions.length} More Question{lockedQuestions.length !== 1 ? "s" : ""}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            {isHydrated && user
              ? "Upgrade to Pro to view the full paper with detailed distractor rationales and time analysis."
              : "Sign in free to view the full paper with detailed solutions and wrong-option explanations."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isHydrated && user ? (
            // Logged in FREE → upgrade CTA
            <Link href="/dashboard/upgrade">
              <Button size="lg" className="font-bold rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          ) : (
            // Not logged in → sign up CTA
            <>
              <Link href="/register">
                <Button size="lg" className="font-bold rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign in Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="font-semibold rounded-full px-8">
                  Already have an account
                </Button>
              </Link>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {isHydrated && user
            ? "Join 50,000+ aspirants with unlimited access to all papers."
            : "Free account. No credit card required."}
        </p>
      </div>
    </div>
  );
}

// ─── Full question card (for premium users) ────────────────────────────────

function FullQuestion({
  question,
  index,
  examLabel,
}: {
  question: Question;
  index: number;
  examLabel: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Question {index + 1}
        </span>
        <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded">
          {examLabel}
        </span>
      </div>
      <div className="prose prose-sm max-w-none text-foreground mb-6">
        <QuestionRenderer content={question.content} />
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((opt) => (
          <div
            key={opt.key}
            className={`p-4 rounded-lg border ${
              opt.key === question.correctOption
                ? "bg-success/10 border-success/30 text-success"
                : "border-border text-foreground bg-muted/40"
            }`}
          >
            <div className="font-semibold mb-1 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">Option {opt.key}:</span>
              <div className="prose prose-sm">
                <QuestionRenderer content={opt.text} />
              </div>
            </div>
            {opt.rationale && (
              <div className="text-sm opacity-90 flex items-start gap-2 mt-2">
                <strong className="shrink-0">Rationale:</strong>
                <div className="prose prose-sm">
                  <QuestionRenderer content={opt.rationale} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Difficulty:{" "}
          <span className="font-medium text-foreground">
            {question.difficulty}
          </span>
        </span>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Practice on Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
