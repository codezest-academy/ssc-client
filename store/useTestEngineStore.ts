import { create } from 'zustand';
import { api } from '@/lib/axios';
import { useAuthStore } from './auth';

export type QuestionStatus =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED_FOR_REVIEW'
  | 'ANSWERED_MARKED_FOR_REVIEW';

export type OptionType = 'A' | 'B' | 'C' | 'D' | null;

export interface EngineOption {
  key: OptionType;
  text: string;
  imageUrl?: string;
}

export interface EngineQuestion {
  id: string;
  questionText: string;
  questionImageUrl?: string;
  options: EngineOption[];
}

interface TestEngineState {
  questions: EngineQuestion[];
  currentIndex: number;
  answers: Record<string, OptionType>;
  questionStatus: Record<string, QuestionStatus>;
  timeRemaining: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
  attemptId: string | null;
  syncQueue: Array<{ questionId: string; selectedOption: OptionType }>;
  
  // Actions
  initializeTest: (questions: EngineQuestion[], durationSeconds: number, attemptId: string) => void;
  selectOption: (questionId: string, option: OptionType) => void;
  saveAndNext: () => void;
  markForReviewAndNext: () => void;
  clearResponse: () => void;
  jumpToQuestion: (index: number) => void;
  tickTimer: () => void;
  submitTest: () => void;
  syncQueuedResponses: () => Promise<void>;
}

export const useTestEngineStore = create<TestEngineState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  answers: {},
  questionStatus: {},
  timeRemaining: 0,
  status: 'NOT_STARTED',
  attemptId: null,
  syncQueue: [],

  initializeTest: (questions, durationSeconds, attemptId) => {
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
      attemptId,
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

  saveAndNext: async () => {
    const state = get();
    const currentQ = state.questions[state.currentIndex];
    const hasAnswer = state.answers[currentQ.id] !== undefined && state.answers[currentQ.id] !== null;
    
    const responsePayload = {
      questionId: currentQ.id,
      selectedOption: state.answers[currentQ.id] || null,
    };

    if (state.attemptId) {
      try {
        await api.patch(`/attempts/${state.attemptId}/answers`, {
          responses: [responsePayload]
        });
        // If successful, try to flush any existing queue
        get().syncQueuedResponses();
      } catch (e) {
        console.error('Network failed. Queuing answer offline.', e);
        set((s) => ({ syncQueue: [...s.syncQueue, responsePayload] }));
      }
    }

    set((state) => {
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

  markForReviewAndNext: async () => {
    const state = get();
    const currentQ = state.questions[state.currentIndex];
    const hasAnswer = state.answers[currentQ.id] !== undefined && state.answers[currentQ.id] !== null;

    const responsePayload = {
      questionId: currentQ.id,
      selectedOption: state.answers[currentQ.id] || null,
    };

    if (state.attemptId) {
      try {
        await api.patch(`/attempts/${state.attemptId}/answers`, {
          responses: [responsePayload]
        });
        get().syncQueuedResponses();
      } catch (e) {
        console.error('Failed to sync answer', e);
        set((s) => ({ syncQueue: [...s.syncQueue, responsePayload] }));
      }
    }

    set((state) => {
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

  clearResponse: async () => {
    const state = get();
    const currentQ = state.questions[state.currentIndex];

    const responsePayload = {
      questionId: currentQ.id,
      selectedOption: null,
    };

    if (state.attemptId) {
      try {
        await api.patch(`/attempts/${state.attemptId}/answers`, {
          responses: [responsePayload]
        });
        get().syncQueuedResponses();
      } catch (e) {
        console.error('Failed to clear answer', e);
        set((s) => ({ syncQueue: [...s.syncQueue, responsePayload] }));
      }
    }

    set((state) => {
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
        // We defer calling the async submitTest so we don't break Zustand's set execution flow
        setTimeout(() => get().submitTest(), 0);
        return { timeRemaining: 0 }; // status will be updated by submitTest
      }
      return { timeRemaining: state.timeRemaining - 1 };
    });
  },

  syncQueuedResponses: async () => {
    const state = get();
    if (!state.attemptId || state.syncQueue.length === 0) return;
    
    const queueToProcess = [...state.syncQueue];
    set({ syncQueue: [] }); // Clear eagerly
    
    try {
      await api.patch(`/attempts/${state.attemptId}/answers`, {
        responses: queueToProcess
      });
    } catch (e) {
      console.error('Failed to sync queued answers', e);
      // Re-add to queue if failed
      set((s) => ({ syncQueue: [...s.syncQueue, ...queueToProcess] }));
    }
  },

  submitTest: async () => {
    const state = get();
    if (state.attemptId) {
      try {
        const res = await api.post(`/attempts/${state.attemptId}/submit`);
        // If the backend returns gamification awards, apply them immediately to the auth store
        if (res.data?.data?.gamification) {
          const { xpAwarded, streakIncremented } = res.data.data.gamification;
          if (xpAwarded || streakIncremented) {
             useAuthStore.getState().optimisticGamificationUpdate(xpAwarded || 0, !!streakIncremented);
          }
        }
      } catch (e) {
        console.error('Failed to submit test', e);
      }
    }
    set({ status: 'SUBMITTED' });
  },
}));
