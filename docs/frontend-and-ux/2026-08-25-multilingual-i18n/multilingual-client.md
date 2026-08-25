# Multilingual Client: Hindi (HI) + Telugu (TE)

**Date:** 2026-08-25
**Status:** 🔴 Not Started — Approved Plan
**Applies to:** `ssc-client`
**Depends on:** [ssc-api multilingual doc](../../../../../ssc-api/docs/architecture-and-infrastructure/2026-08-25-multilingual-i18n/multilingual-i18n.md) — schema + batch translation must be done first.

---

## 1. What This Covers

This doc covers the **client-side** of multilingual support:

1. User locale preference storage and initialization
2. Axios interceptor to attach `?locale=` on content requests
3. Language switcher UI
4. Font loading (Devanagari + Telugu scripts)
5. Locale context provider

This does NOT cover `next-intl` for translating UI strings (buttons, nav, headings). That is a separate, later phase. **This phase: content translation (questions, lessons). UI stays in English.**

---

## 2. Scope of What Gets Translated

| Content | Translated | Notes |
|---|---|---|
| Question text | ✅ Yes | Via `?locale=` on attempt endpoints |
| Question options | ✅ Yes | `option.text` only, `option.key` stays the same |
| Question explanations | ✅ Yes | Shown in review screen |
| Lesson articleHtml | ✅ Yes | Via `?locale=` on lesson endpoints |
| Lesson title | ✅ Yes | |
| Chapter names | ❌ No (Phase 2) | Low priority, not in test flow |
| Subject names | ❌ No (Phase 2) | Low priority |
| UI labels (buttons, nav, headings) | ❌ No | Requires `next-intl` — future phase |
| English Comprehension questions | ❌ Never | Subject is exempt by design |

---

## 3. Locale State Management

### Store: Zustand (`store/locale.ts`) — NEW file

```typescript
// store/locale.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'EN' | 'HI' | 'TE';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: 'EN',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'ssc-locale' } // persisted to localStorage
  )
);
```

### Initialization on login

After login/onboarding, sync `user.preferredLocale` from the API into the store:

```typescript
// After successful login response
const { user } = loginResponse;
useLocaleStore.getState().setLocale(user.preferredLocale); // 'EN' | 'HI' | 'TE'
```

---

## 4. Axios Interceptor

### File: `lib/axios.ts` — MODIFY

Add the locale query param to all content-fetching GET requests:

```typescript
// In the existing request interceptor
axiosInstance.interceptors.request.use((config) => {
  // ... existing auth token logic ...

  // Attach locale to all GET requests
  if (config.method === 'get') {
    const locale = useLocaleStore.getState().locale;
    if (locale !== 'EN') {
      config.params = { ...config.params, locale };
    }
  }

  return config;
});
```

**Why only GET?** Locale is read-only context for fetching content. POST/PUT/PATCH/DELETE operations (submitting answers, saving progress) are locale-agnostic — they work on IDs.

**Why skip `locale=EN`?** The API defaults to EN when no locale param is sent. Omitting it keeps URLs clean and maintains full backward compatibility.

---

## 5. Font Loading

Hindi uses **Devanagari** script. Telugu uses **Telugu** script. Neither is covered by the app's current font (`Inter`).

### Strategy: Conditional font loading

Load script-specific fonts only when the user selects HI or TE. Do not add them to the global bundle.

### File: `app/layout.tsx` — MODIFY

```typescript
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Telugu } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false, // Don't preload — load on demand
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-telugu',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});
```

### CSS: Apply font per locale

```css
/* index.css */
/* When locale is HI, Devanagari text renders in Noto Sans Devanagari */
:lang(hi) {
  font-family: var(--font-devanagari), var(--font-inter), sans-serif;
}

/* When locale is TE, Telugu text renders in Noto Sans Telugu */
:lang(te) {
  font-family: var(--font-telugu), var(--font-inter), sans-serif;
}
```

### Apply `lang` attribute dynamically

In the `LocaleProvider`, set `document.documentElement.lang` when locale changes:

```typescript
useEffect(() => {
  const langMap = { EN: 'en', HI: 'hi', TE: 'te' };
  document.documentElement.lang = langMap[locale];
}, [locale]);
```

---

## 6. Language Switcher Component

### File: `components/ui/locale-switcher.tsx` — NEW

```
┌─────────────────────┐
│  [EN] [हिं] [తె]     │
└─────────────────────┘
```

- Three pill buttons: `EN`, `हिं` (abbreviated Hindi), `తె` (abbreviated Telugu)
- Active locale is highlighted with `bg-primary text-primary-foreground`
- On click: update Zustand store + persist to `localStorage` + call `PATCH /api/v1/users/me` with `{ preferredLocale }` (fire-and-forget, no UI block)
- Component is small enough to embed in `FloatingNav` (desktop) and profile settings page

### Placement

| Location | Notes |
|---|---|
| `FloatingNav` (desktop) | Top-right area, next to `ModeToggle` |
| `app/profile/page.tsx` | Full "Language & Region" settings section |
| Onboarding wizard (Step 1 or 2) | "Choose your preferred language for practice content" |

---

## 7. What Changes in Existing Pages

### Test Engine (`app/tests/attempt/[attemptId]/page.tsx`)

No changes needed. The attempt is already loaded from `GET /api/v1/attempts/:id`. The axios interceptor automatically appends `?locale=hi` (or `te`). Questions arrive pre-translated. The `QuestionRenderer` (KaTeX) handles the translated HTML with math intact.

### Review Screen (`app/tests/review/[attemptId]/page.tsx`)

Same — translations come from the API. `QuestionRenderer` renders translated `explanation` automatically.

### Lesson Viewer (`app/(learn)/learn/[subjectSlug]/[chapterSlug]/[lessonSlug]/page.tsx`)

The lesson articleHtml comes from `GET /api/v1/lessons/:slug?locale=hi`. The existing `MdxRenderer` renders it. No component changes needed.

### Practice Sets / Daily Quiz

The axios interceptor handles locale attachment. No page-level changes.

---

## 8. Excluded from this Phase

| Item | Why |
|---|---|
| `next-intl` for UI strings | Separate, larger effort. Buttons/nav stay English. |
| PDF lesson translation | Binary format, requires separate pipeline |
| Video subtitles | Requires dubbing/subtitle generation |
| Hindi/Telugu URL routes (`/hi/dashboard`) | Adds routing complexity. Locale is a query param only. |

---

## 9. Progress Tracker

| Task | Status |
|---|---|
| `store/locale.ts` Zustand store | 🔴 Not Started |
| `lib/axios.ts` locale interceptor | 🔴 Not Started |
| `app/layout.tsx` font loading | 🔴 Not Started |
| `index.css` `:lang()` font rules | 🔴 Not Started |
| `components/ui/locale-switcher.tsx` | 🔴 Not Started |
| `FloatingNav` — embed `LocaleSwitcher` | 🔴 Not Started |
| `app/profile/page.tsx` — language settings section | 🔴 Not Started |
| Onboarding wizard — locale selection step | 🔴 Not Started |
| `LocaleProvider` — set `document.documentElement.lang` | 🔴 Not Started |
