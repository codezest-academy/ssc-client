'use client';

import { useTestEngineStore } from '@/store/useTestEngineStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bookmark, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { QuestionRenderer } from '@/components/ui/question-renderer';

/** Strip HTML tags and common LaTeX delimiters to get plain-text length */
function plainTextLength(text: string): number {
  if (!text) return 0;
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\$\$?[^$]*\$\$?/g, 'X')
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
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Layout: 2-col grid for short options, 1-col for long / image options
  const hasImageOption = currentQuestion.options.some((o) => !!o.imageUrl);
  const maxOptionLen = Math.max(
    ...currentQuestion.options.map((o) => plainTextLength(String(o.text ?? '')))
  );
  const useTwoCol = !hasImageOption && maxOptionLen <= 35;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Thin progress bar at very top */}
      <div className="h-1 w-full bg-muted shrink-0">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scrollable question area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

          {/* Question number row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black shrink-0 shadow-md shadow-primary/20">
              {currentIndex + 1}
            </div>
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* Question text */}
          <div className="text-xl md:text-2xl font-bold leading-relaxed text-foreground tracking-tight">
            <QuestionRenderer content={currentQuestion.questionText} />
            {currentQuestion.questionImageUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border border-border/50 shadow-sm">
                <img
                  src={currentQuestion.questionImageUrl}
                  alt="Question"
                  className="max-w-full"
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className={cn(
            useTwoCol ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'
          )}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer === option.key;
              const dynamicLabel = String.fromCharCode(65 + index);

              return (
                <button
                  key={option.key}
                  onClick={() => selectOption(currentQuestion.id, option.key)}
                  disabled={status === 'SUBMITTED'}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl border-2 transition-all duration-150 text-left overflow-hidden',
                    useTwoCol ? 'px-4 py-3 min-h-[56px]' : 'w-full px-4 py-3.5',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/60 bg-card hover:border-primary/50 hover:bg-muted/40 active:scale-[0.99]'
                  )}
                >
                  {/* Left accent stripe on selection */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-[10px]" />
                  )}

                  {/* Option key badge */}
                  <span
                    className={cn(
                      'font-mono font-black w-8 h-8 flex items-center justify-center shrink-0 rounded-full text-sm transition-colors',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    )}
                  >
                    {dynamicLabel}
                  </span>

                  {/* Option text */}
                  <span className={cn(
                    'flex-1 text-sm font-medium leading-snug transition-colors',
                    isSelected ? 'text-foreground' : 'text-card-foreground'
                  )}>
                    <QuestionRenderer content={option.text} />
                    {option.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border/50 shadow-sm">
                        <img
                          src={option.imageUrl}
                          alt={`Option ${dynamicLabel}`}
                          className="max-w-full max-h-40 object-contain"
                        />
                      </div>
                    )}
                  </span>

                  {/* Checkmark on selection */}
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="shrink-0 px-6 py-4 border-t border-border/50 bg-card/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={clearResponse}
            disabled={status === 'SUBMITTED' || !currentAnswer}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full px-5 text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => markForReviewAndNext()}
              disabled={status === 'SUBMITTED'}
              className="rounded-full px-5 text-sm bg-warning/5 hover:bg-warning/10 text-warning border-warning/30 hover:border-warning/50 transition-colors"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Review Later
            </Button>
            <Button
              onClick={() => saveAndNext()}
              disabled={status === 'SUBMITTED'}
              className="rounded-full px-7 text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
