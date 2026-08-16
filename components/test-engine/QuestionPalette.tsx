'use client';

import { useTestEngineStore, QuestionStatus } from '@/store/useTestEngineStore';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

const StatusStyles: Record<QuestionStatus, string> = {
  NOT_VISITED: 'border border-muted-foreground/30 text-muted-foreground bg-transparent',
  NOT_ANSWERED: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
  ANSWERED: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
  MARKED_FOR_REVIEW: 'bg-primary/10 text-primary border-primary/20',
  ANSWERED_MARKED_FOR_REVIEW: 'bg-primary text-primary-foreground border-primary relative',
};

export function QuestionPalette() {
  const { questions, questionStatus, currentIndex, jumpToQuestion } = useTestEngineStore();

  const getStatusCount = (statusType: QuestionStatus) => {
    return questions.filter((q) => questionStatus[q.id] === statusType).length;
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent">      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground mb-4">Question Palette</h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-medium">
              {getStatusCount('ANSWERED')}
            </span>
            Answered
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-medium">
              {getStatusCount('NOT_ANSWERED')}
            </span>
            Not Answered
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-muted-foreground/30 flex items-center justify-center font-medium">
              {getStatusCount('NOT_VISITED')}
            </span>
            Not Visited
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10 text-primary font-medium">
              {getStatusCount('MARKED_FOR_REVIEW')}
            </span>
            Marked
          </div>
          <div className="flex items-center gap-2 col-span-2 mt-1">
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-medium relative">
              <Star className="w-2.5 h-2.5 absolute -bottom-1 -right-1 text-amber-500 fill-amber-500 drop-shadow-sm" />
              {getStatusCount('ANSWERED_MARKED_FOR_REVIEW')}
            </span>
            Answered & Marked for Review
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-5 gap-3">
          {questions.map((q, idx) => {
            const status = questionStatus[q.id] || 'NOT_VISITED';
            const isCurrent = idx === currentIndex;
            const isAnsweredAndMarked = status === 'ANSWERED_MARKED_FOR_REVIEW';

            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                className={cn(
                  'relative w-full aspect-square rounded-full flex items-center justify-center text-sm font-semibold transition-all shadow-sm hover:ring-2 hover:ring-primary/40 hover:ring-offset-1 hover:ring-offset-background',
                  StatusStyles[status],
                  isCurrent && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 shadow-md'
                )}
              >
                {idx + 1}
                {isAnsweredAndMarked && (
                  <Star className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-amber-500 fill-amber-500 drop-shadow-md" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
