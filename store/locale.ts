import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocaleStore = {
  locale: "EN" | "HI" | "TE";
  setLocale: (locale: "EN" | "HI" | "TE") => void;
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "EN",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "locale-storage", // name of item in storage
    },
  ),
);
