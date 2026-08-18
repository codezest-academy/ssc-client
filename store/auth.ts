import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "STUDENT";
export type SubscriptionTier = "FREE" | "PRO" | "ELITE";
export type StudyPersona =
  | "FULL_TIME_ASPIRANT"
  | "PART_TIME_ASPIRANT"
  | "REPEAT_ASPIRANT";
export type DailyStudyTime =
  | "LESS_THAN_2_HOURS"
  | "TWO_TO_FOUR_HOURS"
  | "MORE_THAN_4_HOURS";
export type EducationLevel =
  | "HIGH_SCHOOL"
  | "UNDERGRADUATE"
  | "POSTGRADUATE"
  | "OTHER";
export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  targetExam?: string[] | null;
  examYear?: number | null;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
  // Onboarding & Persona
  onboardingComplete: boolean;
  studyPersona: StudyPersona | null;
  dailyStudyTime: DailyStudyTime | null;
  hasAttemptedBefore: boolean;
  // Demographics (all optional)
  phone?: string | null;
  age?: number | null;
  gender?: Gender | null;
  educationLevel?: EducationLevel | null;
  city?: string | null;
  occupation?: string | null;
  incomeRange?: string | null;
  // Gamification
  streakDays?: number;
  lastActiveDate?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isHydrated: false,
      setHydrated: (state) => set({ isHydrated: state }),
      setAuth: (user, token) => set({ user, accessToken: token }),
      setToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "ssc-client-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
