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
    <div className="flex flex-col h-full bg-background">
      {/* Question Header */}
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-bold">Question {currentIndex + 1}</h2>
        <div className="text-sm text-muted-foreground font-medium">
          {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-lg leading-relaxed text-foreground">
            <QuestionRenderer content={currentQuestion.questionText} />
            {currentQuestion.questionImageUrl && (
              <div className="mt-4">
                <img src={currentQuestion.questionImageUrl} alt="Question Reference" className="max-w-full rounded-md" />
              </div>
            )}
          </div>

          <div className="space-y-3">
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
                      ? 'bg-primary/5 border-primary text-foreground ring-1 ring-primary shadow-sm'
                      : 'bg-card border-border text-card-foreground hover:border-primary/40 hover:bg-muted/50'
                  )}
                >
                  <span
                    className={cn(
                      'font-mono font-semibold w-8 h-8 flex items-center justify-center shrink-0 rounded-full border',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 border-border text-muted-foreground group-hover:border-primary/40'
                    )}
                  >
                    {dynamicLabel}
                  </span>
                  <span className="mt-1 text-base flex-1">
                    <QuestionRenderer content={option.text} />
                    {option.imageUrl && (
                      <div className="mt-2">
                        <img src={option.imageUrl} alt={`Option ${dynamicLabel}`} className="max-w-full rounded-md max-h-32" />
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
      <div className="p-4 border-t border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={clearResponse}
              disabled={status === 'SUBMITTED' || !currentAnswer}
              className="text-muted-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Response
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => markForReviewAndNext()}
              disabled={status === 'SUBMITTED'}
              className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Mark for Review & Next
            </Button>
            <Button
              onClick={() => saveAndNext()}
              disabled={status === 'SUBMITTED'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
