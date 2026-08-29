# Frontend & UX Audit Report (Aug 29, 2026)

Based on the architectural rules and documentation (`theme-system.md`, `multilingual-client.md`, `GEMINI.md`), here is a clear summary of what is currently missing and what needs improvement in the codebase.

## 1. What's Missing

### Multilingual Font Loading
- **Current State**: `app/layout.tsx` only loads `Inter` (Latin) and `Plus_Jakarta_Sans`.
- **The Gap**: Hindi and Telugu fonts are missing. When Indian language text is rendered using Latin fonts, it leads to poor legibility, broken baselines, and a degraded user experience.
- **Requirement**: We need to load `Noto_Sans_Devanagari` and `Noto_Sans_Telugu` from `next/font/google` and implement conditional font application using `:lang()` CSS pseudo-classes (e.g., `:lang(hi)` and `:lang(te)`) in our global CSS.

## 2. What Needs Improvement (Code Quality & Theming)

### Semantic Token Violations in Components
- **Current State**: Several components are using raw Tailwind palette classes (like `bg-primary/5`, `border-primary`, `bg-success`, `bg-destructive`).
- **The Gap**: This directly violates Rule 1 and Rule 2 from `GEMINI.md` ("NEVER use raw Tailwind colors", "ALWAYS use Semantic Tokens"). It breaks the theme system (especially in dark mode) and removes semantic meaning from the UI.
- **Affected Components**:
  - `components/test-engine/QuestionViewer.tsx`: Uses `bg-primary/5` and `border-primary` instead of the required test-state tokens (`--option-selected`, `--correct`, `--incorrect`).
  - `app/(learn)/learn/[subjectSlug]/[chapterSlug]/[lessonSlug]/page.tsx` (lesson knowledge check): Uses `bg-success` and `bg-destructive` instead of the semantic tokens (`bg-correct/10`, `text-correct`, `bg-incorrect/10`, `text-incorrect`).

### ESLint Enforcement
- **Current State**: The ESLint rules designed to catch raw Tailwind color usage exist, but components are currently violating them, meaning the rules are either being bypassed, ignored, or haven't been run against the entire codebase recently.

---

## Action Plan & Priorities

- [x] **1. Fix Component Theming (Highest Priority)**: Refactor `QuestionViewer.tsx` and the `lesson-knowledge-check` components to use proper semantic tokens. This immediately fixes UI inconsistencies and adheres to the strict `GEMINI.md` rules.
- [x] **2. Implement Multilingual Fonts (High Priority)**: Update `app/layout.tsx` and `globals.css` to load and apply Noto Sans Devanagari and Telugu. This is a critical accessibility/UX fix for non-English content.
- [x] **3. Run & Enforce ESLint (Medium Priority)**: After the manual fixes, ran the linter to catch any other hidden semantic token violations and fixed `locale-switcher.tsx` and `TimeAccuracyQuadrant.tsx` hooks violations.
