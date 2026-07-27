import { create } from 'zustand';

export type QuestionStatus =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED_FOR_REVIEW'
  | 'ANSWERED_MARKED_FOR_REVIEW';

export type OptionType = 'A' | 'B' | 'C' | 'D' | null;

export interface MockQuestion {
  id: string;
  text: string;
  options: {
    key: OptionType;
    text: string;
  }[];
}

interface TestEngineState {
  questions: MockQuestion[];
  currentIndex: number;
  answers: Record<string, OptionType>;
  questionStatus: Record<string, QuestionStatus>;
  timeRemaining: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
  
  // Actions
  initializeTest: (questions: MockQuestion[], durationSeconds: number) => void;
  selectOption: (questionId: string, option: OptionType) => void;
  saveAndNext: () => void;
  markForReviewAndNext: () => void;
  clearResponse: () => void;
  jumpToQuestion: (index: number) => void;
  tickTimer: () => void;
  submitTest: () => void;
}

const mockQuestionsData: MockQuestion[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `q${i + 1}`,
  text: `This is a sample mock question number ${i + 1}. What is the correct answer according to the concepts you have learned?`,
  options: [
    { key: 'A', text: `Option A for Question ${i + 1}` },
    { key: 'B', text: `Option B for Question ${i + 1}` },
    { key: 'C', text: `Option C for Question ${i + 1}` },
    { key: 'D', text: `Option D for Question ${i + 1}` },
  ],
}));

export const useTestEngineStore = create<TestEngineState>((set, get) => ({
  questions: mockQuestionsData,
  currentIndex: 0,
  answers: {},
  questionStatus: {},
  timeRemaining: 0,
  status: 'NOT_STARTED',

  initializeTest: (questions, durationSeconds) => {
    const initialStatus: Record<string, QuestionStatus> = {};
    questions.forEach((q, idx) => {
      initialStatus[q.id] = idx === 0 ? 'NOT_ANSWERED' : 'NOT_VISITED';
    });

    set({
      questions,
      currentIndex: 0,
      answers: {},
      questionStatus: initialStatus,
      timeRemaining: durationSeconds,
      status: 'IN_PROGRESS',
    });
  },

  selectOption: (questionId, option) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: option,
      },
    }));
  },

  saveAndNext: () => {
    set((state) => {
      const currentQ = state.questions[state.currentIndex];
      const hasAnswer = state.answers[currentQ.id] !== undefined && state.answers[currentQ.id] !== null;
      
      const newStatus = { ...state.questionStatus };
      newStatus[currentQ.id] = hasAnswer ? 'ANSWERED' : 'NOT_ANSWERED';

      const nextIndex = Math.min(state.currentIndex + 1, state.questions.length - 1);
      const nextQ = state.questions[nextIndex];
      
      if (newStatus[nextQ.id] === 'NOT_VISITED') {
        newStatus[nextQ.id] = 'NOT_ANSWERED';
      }

      return {
        questionStatus: newStatus,
        currentIndex: nextIndex,
      };
    });
  },

  markForReviewAndNext: () => {
    set((state) => {
      const currentQ = state.questions[state.currentIndex];
      const hasAnswer = state.answers[currentQ.id] !== undefined && state.answers[currentQ.id] !== null;
      
      const newStatus = { ...state.questionStatus };
      newStatus[currentQ.id] = hasAnswer ? 'ANSWERED_MARKED_FOR_REVIEW' : 'MARKED_FOR_REVIEW';

      const nextIndex = Math.min(state.currentIndex + 1, state.questions.length - 1);
      const nextQ = state.questions[nextIndex];
      
      if (newStatus[nextQ.id] === 'NOT_VISITED') {
        newStatus[nextQ.id] = 'NOT_ANSWERED';
      }

      return {
        questionStatus: newStatus,
        currentIndex: nextIndex,
      };
    });
  },

  clearResponse: () => {
    set((state) => {
      const currentQ = state.questions[state.currentIndex];
      const newAnswers = { ...state.answers };
      delete newAnswers[currentQ.id];
      
      return {
        answers: newAnswers,
      };
    });
  },

  jumpToQuestion: (index) => {
    set((state) => {
      if (index < 0 || index >= state.questions.length) return state;
      
      const newStatus = { ...state.questionStatus };
      const nextQ = state.questions[index];
      if (newStatus[nextQ.id] === 'NOT_VISITED') {
        newStatus[nextQ.id] = 'NOT_ANSWERED';
      }

      return {
        currentIndex: index,
        questionStatus: newStatus,
      };
    });
  },

  tickTimer: () => {
    set((state) => {
      if (state.timeRemaining <= 0 || state.status !== 'IN_PROGRESS') return state;
      if (state.timeRemaining === 1) {
        return { timeRemaining: 0, status: 'SUBMITTED' };
      }
      return { timeRemaining: state.timeRemaining - 1 };
    });
  },

  submitTest: () => {
    set({ status: 'SUBMITTED' });
  },
}));
