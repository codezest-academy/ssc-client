'use client';

import { useTestEngineStore, OptionType } from '@/store/useTestEngineStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bookmark, Save, Trash2, ArrowLeft } from 'lucide-react';
import { QuestionRenderer } from '@/components/ui/question-renderer';

export function QuestionViewer() {
  const {
    questions,
    currentIndex,
    answers,
    selectOption,
    saveAndNext,
    markForReviewAndNext,
    clearResponse,
    jumpToQuestion,
    status
  } = useTestEngineStore();

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      {/* Question Header */}
      <div className="px-6 py-5 border-b border-border/50 flex justify-between items-center bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold tracking-tight">Question {currentIndex + 1}</h2>
        <div className="text-sm text-muted-foreground font-semibold bg-muted/50 px-3 py-1 rounded-full">
          {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-lg leading-relaxed text-foreground font-medium">
            <QuestionRenderer content={currentQuestion.questionText} />
            {currentQuestion.questionImageUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border border-border/50 shadow-sm">
                <img src={currentQuestion.questionImageUrl} alt="Question Reference" className="max-w-full" />
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer === option.key;
              const dynamicLabel = String.fromCharCode(65 + index); // A, B, C, D...
              
              return (
                <button
                  key={option.key}
                  onClick={() => selectOption(currentQuestion.id, option.key)}
                  disabled={status === 'SUBMITTED'}
                  className={cn(
                    'w-full flex items-start gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left group',
                    isSelected
                      ? 'bg-primary/5 border-primary text-foreground shadow-[0_0_0_2px_rgba(var(--primary),0.1)] ring-primary'
                      : 'bg-card border-border/60 text-card-foreground hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm'
                  )}
                >
                  <span
                    className={cn(
                      'font-mono font-bold w-9 h-9 flex items-center justify-center shrink-0 rounded-full border-2 transition-colors',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border/80 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary'
                    )}
                  >
                    {dynamicLabel}
                  </span>
                  <span className="mt-1 text-base flex-1">
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
              Mark for Review & Next
            </Button>
            <Button
              onClick={() => saveAndNext()}
              disabled={status === 'SUBMITTED'}
              className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95"
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
