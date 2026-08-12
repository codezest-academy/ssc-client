# Phase 4 Roadmap: Polish & Production Readiness (Client)

**Date:** 2026-08-12  
**Status:** 🟡 In Progress  
**Last Updated:** 2026-08-12

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

## 2. 🟡 Error Handling: Industry Standard Implementation

**Status:** Planned — Ready to Implement

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

## 3. 🔴 Layout: Marketing Nav & Route Group

**Status:** Not Started — Planned

### Problem
All public/marketing pages (`/`, `/pyq`, `/pricing`, `/[examSlug]-mock-tests`, etc.) each define their own inline `<header>` with no shared component — inconsistent branding, high maintenance cost.

### Solution
1. **`<MarketingNav />` component** (`components/layout/MarketingNav.tsx`) — Floating pill navbar matching the dashboard's `FloatingNav` aesthetic but for public visitors. Smart auth detection (logged in → "Go to Dashboard").
2. **`(marketing)` route group** (`app/(marketing)/layout.tsx`) — Shared layout for all public pages. URLs do NOT change.
3. **Strip inline headers** from: `app/page.tsx`, `app/pyq/page.tsx`, `app/pricing/page.tsx`, `app/[examSlug]-mock-tests/page.tsx`.

---

## 4. 🔴 Layout: Mobile Bottom Navigation

**Status:** Not Started — Planned

### Problem
`FloatingNav` hides all navigation links on mobile (they require `lg:` breakpoint). Students on phones have no way to navigate between sections.

### Solution
Add a fixed bottom tab bar to `components/layout/FloatingNav.tsx` with 5 icon tabs:  
Home · Practice Sets · Mock Tests · Analytics · Leaderboard  
Auto-hides inside test engine routes (`/tests/*`).

---

## 5. Future: Performance & Scale
- **Internationalization (i18n):** Integrate `next-intl` for English and Hindi locales.
- **Progressive Web App (PWA):** Service workers + offline caching for critical assets.
- **E2E Testing:** Playwright for core user flow: Register → Onboard → Take Test → View Analytics.
- **Error Tracking:** Sentry Next.js SDK integration.
- **CI/CD:** GitHub Actions for `tsc --noEmit` + `eslint` on pull requests.
- **Bundle Optimization:** Analyze and lazy-load heavy components (Recharts, KaTeX).
