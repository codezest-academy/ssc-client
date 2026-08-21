# Phase 4 Roadmap: Polish & Production Readiness (Client)

**Date:** 2026-08-12  
**Status:** ✅ Complete  
**Last Updated:** 2026-08-21

With the MVP features (Phases 1–12) completed, `ssc-client` is now in a production-readiness and UX polish sprint. This phase covers error handling, layout consistency, skeleton loading states, and mobile navigation.

---

## 1. ✅ UX Polish: Empty States & Skeleton Loading

Completed as part of the Phase 4 sprint.

### 1a. Empty State Component (`<EmptyState />`)
**Status:** ✅ Complete  
**File:** `components/ui/empty-state.tsx`  
Reusable component with `icon`, `title`, `description`, and optional `action` (CTA button) props. Applied across all pages that previously showed raw text or blank divs for empty data.

### 1b. Skeleton Loading Component (`<Skeleton />`)
**Status:** ✅ Complete  
**File:** `components/ui/skeleton.tsx`  
Replaced all "Loading..." plain text with animated skeleton placeholders. Each page now renders layout-aware skeleton grids that preserve visual structure during data fetches.

**Pages upgraded (skeletons):**
- `app/dashboard/practice-sets/page.tsx`
- `app/dashboard/mock-tests/page.tsx`
- `app/dashboard/pyq/page.tsx`
- `app/dashboard/analytics/page.tsx`
- `app/dashboard/subjects/[slug]/page.tsx`
- `app/dashboard/subjects/[slug]/chapters/[chapterId]/page.tsx`
- `app/pricing/page.tsx`

**Pages upgraded (empty states):**
- `app/dashboard/page.tsx`
- `app/dashboard/mock-tests/page.tsx`
- `app/dashboard/practice-sets/page.tsx`
- `app/dashboard/pyq/page.tsx`
- `app/dashboard/subjects/[slug]/page.tsx`
- `app/dashboard/subjects/[slug]/chapters/[chapterId]/page.tsx`
- `app/pyq/[subject]/page.tsx`
- `app/[examSlug]-mock-tests/page.tsx`
- `app/pricing/page.tsx`

---

## 2. ✅ Exam Color System

**Status:** ✅ Complete (2026-08-15)

### What Was Done
- Defined five OKLCH-based `--exam-*` CSS custom properties in `index.css`:
  - `--exam-cgl` (Indigo/Blue) — SSC CGL
  - `--exam-chsl` (Teal/Green) — SSC CHSL
  - `--exam-mts` (Orange/Amber) — SSC MTS
  - `--exam-cpo` (Purple) — SSC CPO
  - `--exam-gd` (Pink/Rose) — SSC GD
- Applied exam color tokens to the Dashboard curriculum cards (semi-circle accent in top-right corner).
- Added comprehensive documentation to `docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md` (Section 6.5).
- Updated `GEMINI.md` with exam color usage rules.

**Files modified:**
- `app/index.css` — token definitions
- `app/dashboard/page.tsx` — applied to curriculum cards
- `docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md`
- `GEMINI.md`

---

## 3. ✅ MDX Interactive Components

**Status:** ✅ Complete (2026-08-15)

### What Was Done
Extended the `MdxRenderer` with two new rich interactive components to enable visual learning content:

#### `<ZoomableImage />` (`components/ui/learning/zoomable-image.tsx`)
- Full-screen lightbox for any image in MDX content.
- Backdrop blur, smooth `scale` animation, `Esc` key to close, accessible ARIA labels.
- Auto-registered in `MdxRenderer` as the `img` component override — authors write standard markdown images and get lightbox for free.

#### `<Mindmap />` (`components/ui/learning/mindmap.tsx`)
- Client-side SVG diagram rendering via the `mermaid` library.
- CSS variables mapped to the design system (indigo accents follow `--primary`).
- Graceful error boundary for invalid diagram syntax.
- Authors write fenced code blocks with ` ```mindmap ` to trigger it.

**Files modified:**
- `components/ui/learning/zoomable-image.tsx` — [NEW]
- `components/ui/learning/mindmap.tsx` — [NEW]
- `components/ui/learning/mdx-renderer.tsx` — registered both components
- `docs/frontend-and-ux/2026-08-16-mdx-components/mdx-interactive-components.md` — [NEW]

---

## 4. ✅ Chapter Dashboard (Industry-Standard UX)

**Status:** ✅ Complete (2026-08-16)

### Problem (Before)
`app/(learn)/learn/[subjectSlug]/[chapterSlug]/page.tsx` performed an unconditional `router.replace()` to the first lesson of the chapter as soon as the data loaded. This meant:
- Students could never see **what was in a chapter** before starting.
- Students couldn't navigate directly to a **specific lesson** or **practice set**.
- No concept of "progress" visibility before entering the chapter.
- **This is an anti-pattern** in modern EdTech (Coursera, Khan Academy, BYJU's all use a Chapter Outline first).

### Solution (After)
- `ChapterRouterPage` now simply redirects to the Chapter Dashboard: `/dashboard/subjects/[subjectSlug]/chapters/[chapterSlug]`.
- The Chapter Dashboard (`app/dashboard/subjects/[slug]/chapters/[chapterSlug]/page.tsx`) now shows:
  - A **chapter description header** with a prominent "**Resume Learning**" / "**Start Chapter**" button.
  - The **Lessons grid** (video, article, pdf cards with progress indicators).
  - The **Practice Sets section** below lessons, styled with the Exam Color System.
- **"Resume Learning" intelligence:** Finds the student's first incomplete lesson and navigates directly to it. Falls back to the first lesson if all are complete.

**Files modified:**
- `app/(learn)/learn/[subjectSlug]/[chapterSlug]/page.tsx` — replaced lesson-fetch redirect with dashboard redirect
- `app/dashboard/subjects/[slug]/chapters/[chapterSlug]/page.tsx` — added Resume button + Practice Sets Exam Color styling

---

## 5. ✅ Error Handling: Industry Standard Implementation

**Status:** ✅ Complete (2026-08-16)

### Current State (Problems Identified)
- **20 pages** use `console.error()` to swallow fetch failures — users see blank/broken UIs
- No root `app/error.tsx` or `app/global-error.tsx` exists
- No `app/not-found.tsx` 404 page exists
- 2 pages (`pricing`, `practice-sets/[id]`, `mock-tests/[id]`) use `alert()` for errors — unacceptable in production
- `app/dashboard/error.tsx` exists but only catches React render crashes, NOT async `useEffect` fetch failures

### Target State (Industry Best Practice)
1. **`<ErrorState />` component** (`components/ui/error-state.tsx`) — Reusable inline error card with icon, message, and a "Try Again" retry button.
2. **Global error boundaries** — `app/global-error.tsx` + `app/error.tsx` for catastrophic crashes.
3. **`app/not-found.tsx`** — Branded 404 page.
4. **Axios interceptor** (`lib/axios.ts`) — Auto-fires `toast.error()` on all mutation failures (POST/PUT/DELETE). Handles 401 → auto-redirect to login.
5. **Per-page error state pattern** — Every `useEffect` fetch adds an `error` state and renders `<ErrorState onRetry={() => refetch()} />` in the catch block.

### Files to Modify (16 pages)
- `app/dashboard/page.tsx`
- `app/dashboard/analytics/page.tsx`
- `app/dashboard/mock-tests/page.tsx`
- `app/dashboard/mock-tests/[id]/page.tsx` ← also replace `alert()` with `toast.error()`
- `app/dashboard/practice-sets/page.tsx`
- `app/dashboard/practice-sets/[id]/page.tsx` ← also replace `alert()` with `toast.error()`
- `app/dashboard/leaderboard/page.tsx`
- `app/dashboard/subjects/[slug]/page.tsx`
- `app/dashboard/subjects/[slug]/chapters/[chapterId]/page.tsx`
- `app/dashboard/pyq/page.tsx`
- `app/tests/attempt/[attemptId]/page.tsx`
- `app/tests/review/[attemptId]/page.tsx`
- `app/pyq/page.tsx`
- `app/pyq/[subject]/page.tsx`
- `app/pyq/[subject]/[chapter]/page.tsx`
- `app/pricing/page.tsx` ← also replace `alert()` with `toast.error()`

---

## 5. ✅ Pillar 2: Syllabus Browser

**Status:** ✅ Complete (2026-08-16)

- Added `/dashboard/syllabus` — subject-level index page listing all exams with year selectors.
- Added `/dashboard/syllabus/[subjectSlug]` — hierarchical `SyllabusNode` tree viewer with collapsible sections.
- Read-only: no progress tracking. Separate from the learning journey routes.

---

## 5b. ✅ Pillar 4: Freemium Model & Marketing Hooks

**Status:** ✅ Complete (2026-08-16)

- **`<PaywallModal />`** (`components/pricing/PaywallModal.tsx`) — Reusable modal with premium feature highlights and Upgrade CTA.
- **`FloatingNav`** — "Upgrade to Pro" gradient pill button, shown only for `FREE` tier users.
- **Mock Tests** — Premium tests (tier = `PREMIUM`) are visually locked with a `<Lock />` icon; clicking triggers `<PaywallModal />` instead of navigating.
- **Analytics** — "Recent Activity" timeline hidden under a frosted-glass blur overlay for free users; unlock CTA triggers `<PaywallModal />`.

---

## 6. ✅ Layout: Marketing Nav & Route Group

**Status:** ✅ Complete (2026-08-21)

### Problem
All public/marketing pages (`/`, `/pyq`, `/pricing`, `/[examSlug]-mock-tests`, etc.) each define their own inline `<header>` with no shared component — inconsistent branding, high maintenance cost.

### Solution
1. **`<MarketingNav />` component** (`components/layout/MarketingNav.tsx`) — Floating pill navbar matching the dashboard's `FloatingNav` aesthetic but for public visitors. Smart auth detection (logged in → "Go to Dashboard").
2. **`(marketing)` route group** (`app/(marketing)/layout.tsx`) — Shared layout for all public pages. URLs do NOT change.
3. **Strip inline headers** from: `app/page.tsx`, `app/pyq/page.tsx`, `app/pricing/page.tsx`, `app/[examSlug]-mock-tests/page.tsx`.

---

## 7. ✅ Layout: Mobile Bottom Navigation

**Status:** ✅ Complete (2026-08-21)

### Problem
`FloatingNav` hides all navigation links on mobile (they require `lg:` breakpoint). Students on phones have no way to navigate between sections.

### Solution
Add a fixed bottom tab bar to `components/layout/FloatingNav.tsx` with 5 icon tabs:  
Home · Practice Sets · Mock Tests · Analytics · Leaderboard  
Auto-hides inside test engine routes (`/tests/*`).

---

## 8. ✅ Pricing & Routing Consolidation (Phase 10 Extension)

**Status:** ✅ Complete

### Problem
The `/pricing` route was completely isolated from the premium "Floating Bento" dashboard architecture, lacked Razorpay integration, and read from a test database product. 

### Solution
1. **Database:** Seeded real `Pro` and `Elite` products into the DB using `seed-e2e-payments.ts`.
2. **UI Extraction:** Extracted the premium cards from `/dashboard/upgrade` into a reusable `<PricingCards />` component that handles Razorpay checkout via `useQuery` and mutations.
3. **Route Sharing:** 
   - `/dashboard/upgrade` uses `<PricingCards />` inside the dashboard's `client-shell-inner` canvas.
   - `/pricing` uses `<PricingCards />` inside a public-facing `bg-grid-pattern` dark mode shell.
4. **Auth Locking:** `FloatingNav` and manual navigations auto-route logged-in users away from `/pricing` and straight to `/dashboard/upgrade`.

---

## 9. ✅ Profile Layout Fix

**Status:** ✅ Complete

### Problem
The `/profile` layout was missing the padding tokens (`p-4 md:p-6 lg:p-8 gap-6`) used by the dashboard's `client-shell-outer`, causing the `FloatingNav` to stick to the very top of the viewport instead of floating.

### Solution
Updated `app/profile/layout.tsx` to include the standard outer shell paddings and gap tokens, correctly aligning the Floating Nav with the rest of the application.

---

## 10. Future: Performance & Scale
- **Internationalization (i18n):** Integrate `next-intl` for English and Hindi locales.
- **Progressive Web App (PWA):** Service workers + offline caching for critical assets.
- **E2E Testing:** Playwright for core user flow: Register → Onboard → Take Test → View Analytics.
- **Error Tracking:** Custom Error Tracking System implemented (✅ Phase 4)
- **CI/CD:** GitHub Actions for `tsc --noEmit` + `eslint` on pull requests.
- **Bundle Optimization:** Analyze and lazy-load heavy components (Recharts, KaTeX).
