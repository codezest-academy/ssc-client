"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionRenderer } from "@/components/ui/question-renderer";
import { CheckCircle2, XCircle, ChevronRight, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeCheckProps {
  lessonId: string;
  onComplete?: () => void;
}

export function LessonKnowledgeCheck({ lessonId, onComplete }: KnowledgeCheckProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { data: practiceSets, isLoading } = useQuery({
    queryKey: ["lesson-practice-sets", lessonId],
    queryFn: async () => {
      const response = await api.get(`/practice-sets?lessonId=${lessonId}`);
      return response.data.data;
    },
    enabled: !!lessonId,
  });

  const practiceSet = practiceSets?.[0]; // Get the first attached practice set
  
  const { data: practiceSetData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["practice-set", practiceSet?.id],
    queryFn: async () => {
      const response = await api.get(`/practice-sets/${practiceSet?.id}`);
      return response.data.data;
    },
    enabled: !!practiceSet?.id,
  });

  if (isLoading || isLoadingQuestions) {
    return null; // Return null so we don't block the lesson load visually
  }

  if (!practiceSetData || !practiceSetData.questions || practiceSetData.questions.length === 0) {
    return null; // No knowledge check for this lesson
  }

  const questions = practiceSetData.questions.map((q: any) => q.question);
  const currentQuestion = questions[currentQuestionIdx];

  const handleSelectOption = (optionKey: string) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedOption(optionKey);
    setShowExplanation(true);
    
    if (optionKey === currentQuestion.correctOption) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((c) => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  };

  if (isFinished) {
    return (
      <Card className="mt-8 p-8 border-2 border-primary/20 bg-primary/5 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Knowledge Check Complete!</h3>
        <p className="text-muted-foreground">
          You scored {score} out of {questions.length}.
        </p>
        <Button 
          variant="outline" 
          onClick={() => {
            setCurrentQuestionIdx(0);
            setScore(0);
            setSelectedOption(null);
            setShowExplanation(false);
            setIsFinished(false);
          }}
          className="mt-4"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
      </Card>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        Knowledge Check
        <span className="text-sm font-normal text-muted-foreground ml-auto">
          Question {currentQuestionIdx + 1} of {questions.length}
        </span>
      </h3>
      
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-lg font-medium prose prose-sm dark:prose-invert max-w-none text-foreground">
          <QuestionRenderer content={currentQuestion.questionText} />
        </div>
        
        {currentQuestion.questionImageUrl && (
          <img 
            src={currentQuestion.questionImageUrl} 
            alt="Question" 
            className="max-h-[300px] rounded-lg object-contain"
          />
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((opt: any) => {
            const isSelected = selectedOption === opt.key;
            const isCorrect = opt.key === currentQuestion.correctOption;
            const showCorrect = showExplanation && isCorrect;
            const showIncorrect = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                disabled={showExplanation}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4",
                  !showExplanation && "hover:border-primary hover:bg-primary/5",
                  isSelected && !showExplanation && "border-option-selected/10 bg-option-selected text-foreground",
                  !isSelected && !showExplanation && "border-border bg-card",
                  showCorrect && "border-correct bg-correct/10 text-correct",
                  showIncorrect && "border-incorrect bg-incorrect/10 text-incorrect",
                  showExplanation && !isCorrect && !isSelected && "border-border bg-card opacity-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                  showCorrect ? "bg-correct/10 text-correct" : 
                  showIncorrect ? "bg-incorrect/10 text-incorrect" :
                  "bg-muted text-muted-foreground"
                )}>
                  {showCorrect ? <CheckCircle2 className="w-5 h-5" /> : 
                   showIncorrect ? <XCircle className="w-5 h-5" /> : 
                   opt.key}
                </div>
                <div className="flex-1 text-foreground">
                  <QuestionRenderer content={opt.text} />
                  {opt.imageUrl && (
                    <img src={opt.imageUrl} alt="Option" className="mt-2 max-h-32 rounded object-contain" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 pt-6 border-t border-border animate-in fade-in slide-in-from-bottom-4">
            <div className={cn(
              "p-4 rounded-xl mb-6",
              selectedOption === currentQuestion.correctOption ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              <p className="font-bold mb-1">
                {selectedOption === currentQuestion.correctOption ? "Correct!" : "Incorrect"}
              </p>
              <div className="text-sm prose prose-sm dark:prose-invert text-current">
                {currentQuestion.explanation ? (
                  <QuestionRenderer content={currentQuestion.explanation} />
                ) : (
                  <p>The correct answer is {currentQuestion.correctOption}.</p>
                )}
              </div>
            </div>
            
            <Button onClick={handleNext} className="w-full">
              {currentQuestionIdx < questions.length - 1 ? "Next Question" : "Finish Knowledge Check"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
