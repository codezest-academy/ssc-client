import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTestEngineStore } from "@/store/useTestEngineStore";

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SubmitConfirmationModal({ isOpen, onClose, onConfirm }: SubmitConfirmationModalProps) {
  const { questions, questionStatus } = useTestEngineStore();

  const answered = questions.filter(
    (q) =>
      questionStatus[q.id] === "ANSWERED" ||
      questionStatus[q.id] === "ANSWERED_MARKED_FOR_REVIEW"
  ).length;
  
  const markedForReview = questions.filter(
    (q) => questionStatus[q.id] === "MARKED_FOR_REVIEW"
  ).length;

  const notAnswered = questions.filter(
    (q) => questionStatus[q.id] === "NOT_ANSWERED"
  ).length;

  const notVisited = questions.filter(
    (q) => !questionStatus[q.id] || questionStatus[q.id] === "NOT_VISITED"
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-border bg-card shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Submit Test?</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit? You cannot change your answers after submission.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-3 rounded-xl text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{answered}</p>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-500">Answered</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-3 rounded-xl text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{markedForReview}</p>
            <p className="text-xs font-medium text-indigo-700 dark:text-indigo-500">For Review</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3 rounded-xl text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{notAnswered}</p>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-500">Not Answered</p>
          </div>
          <div className="bg-muted p-3 rounded-xl text-center border border-border">
            <p className="text-2xl font-bold text-muted-foreground">{notVisited}</p>
            <p className="text-xs font-medium text-muted-foreground">Not Visited</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex-row gap-2 items-center">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Continue Test
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto bg-primary text-primary-foreground">
            Yes, Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
