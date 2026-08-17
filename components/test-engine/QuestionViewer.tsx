'use client';

import { useTestEngineStore } from '@/store/useTestEngineStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bookmark, Save, Trash2 } from 'lucide-react';
import { QuestionRenderer } from '@/components/ui/question-renderer';

/** Strip HTML tags and common LaTeX delimiters to get plain-text length */
function plainTextLength(text: string): number {
  if (!text) return 0;
  return text
    .replace(/<[^>]*>/g, '')       // remove HTML
    .replace(/\$\$?[^$]*\$\$?/g, 'X') // collapse LaTeX blocks to single char
    .replace(/\\\([^)]*\\\)/g, 'X')
    .replace(/\\\[[^\]]*\\\]/g, 'X')
    .trim()
    .length;
}

export function QuestionViewer() {
  const {
    questions,
    currentIndex,
    answers,
    selectOption,
    saveAndNext,
    markForReviewAndNext,
    clearResponse,
    status
  } = useTestEngineStore();

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentAnswer = answers[currentQuestion.id];

  // Decide layout: use a 2-column grid only when all options are short text with no images
  const hasImageOption = currentQuestion.options.some((o) => !!o.imageUrl);
  const maxOptionLen = Math.max(
    ...currentQuestion.options.map((o) => plainTextLength(String(o.text ?? '')))
  );
  const useTwoCol = !hasImageOption && maxOptionLen <= 35;

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      {/* Question Header */}
      <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-base font-bold tracking-tight text-muted-foreground">Question {currentIndex + 1}</h2>
        <div className="text-xs text-muted-foreground font-semibold bg-muted/50 px-3 py-1 rounded-full">
          {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full space-y-7">

          {/* Question Text — prominent & large */}
          <div className="text-xl md:text-2xl font-bold leading-snug text-foreground">
            <QuestionRenderer content={currentQuestion.questionText} />
            {currentQuestion.questionImageUrl && (
              <div className="mt-5 rounded-xl overflow-hidden border border-border/50 shadow-sm">
                <img src={currentQuestion.questionImageUrl} alt="Question Reference" className="max-w-full" />
              </div>
            )}
          </div>

          {/* Options */}
          <div
            className={cn(
              useTwoCol
                ? 'grid grid-cols-2 gap-3'
                : 'flex flex-col gap-3'
            )}
          >
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer === option.key;
              const dynamicLabel = String.fromCharCode(65 + index); // A, B, C, D

              return (
                <button
                  key={option.key}
                  onClick={() => selectOption(currentQuestion.id, option.key)}
                  disabled={status === 'SUBMITTED'}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left group',
                    useTwoCol ? 'min-h-[52px]' : 'w-full',
                    isSelected
                      ? 'bg-primary/5 border-primary text-foreground shadow-[0_0_0_2px_rgba(var(--primary),0.08)]'
                      : 'bg-card border-border/60 text-card-foreground hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm'
                  )}
                >
                  <span
                    className={cn(
                      'font-mono font-bold w-8 h-8 flex items-center justify-center shrink-0 rounded-full border-2 text-sm transition-colors',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border/80 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary'
                    )}
                  >
                    {dynamicLabel}
                  </span>
                  <span className="text-sm font-medium flex-1 leading-snug">
                    <QuestionRenderer content={option.text} />
                    {option.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border/50 shadow-sm">
                        <img src={option.imageUrl} alt={`Option ${dynamicLabel}`} className="max-w-full max-h-40 object-contain" />
                      </div>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-border/50 bg-card/80 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={clearResponse}
              disabled={status === 'SUBMITTED' || !currentAnswer}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full px-5"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Response
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => markForReviewAndNext()}
              disabled={status === 'SUBMITTED'}
              className="rounded-full px-6 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Mark for Review &amp; Next
            </Button>
            <Button
              onClick={() => saveAndNext()}
              disabled={status === 'SUBMITTED'}
              className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Save className="w-4 h-4 mr-2" />
              Save &amp; Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

