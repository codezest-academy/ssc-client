import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "STUDENT";
export type SubscriptionTier = "FREE" | "PRO" | "ELITE";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  targetExam?: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
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
