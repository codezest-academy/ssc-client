# Client Web Features — Low-Priority Docs

**Date:** 2026-08-23  
**Status:** ✅ Implemented / 🔴 Missing  
**Applies to:** `ssc-client`

This document details low-priority/miscellaneous client pages and features, addressing gaps M through Q from the gap analysis backlog.

---

## M. Gamification UI
**Route:** `/dashboard/gamification`  
**Location:** `app/dashboard/gamification/page.tsx`  
**Status:** ✅ **Complete** (2026-08-24)

**Overview:**
The gamification UI has two surfaces:
1. **Dashboard integration** — The `GamificationProfileCard` component on the Analytics page shows XP, rank, and streak. Inline streak counter + rank badge appear in `FloatingNav`.
2. **Dedicated Gamification page** (`/dashboard/gamification`) — Full rank profile with hero card, animated XP progress bar, rank ladder, and badges showcase.

**Features:**
- **Hero card:** Current tier icon, total XP, streak count, animated XP progress bar to next tier.
- **Rank Ladder:** All 5 tiers (ASPIRANT → COMMISSIONER) shown as a vertical progress map with achieved/current/locked states.
- **Badges:** Grid of all earned badges with award date and criteria. `<EmptyState />` if none earned yet.
- **Info modal:** XP formula (`marks×10 + accuracy×5`) and rank thresholds.
- **Data source:** `GET /api/v1/gamification/profile`

**Rank tiers (implemented — XP-only, no streak gating):**
| Tier | Min XP |
|---|---|
| ASPIRANT | 0 |
| CONSTABLE | 500 |
| SUB\_INSPECTOR | 2,000 |
| INSPECTOR | 5,000 |
| COMMISSIONER | 10,000 |

## N. Daily Quiz UI
**Route:** `/dashboard/daily-quiz`  
**Location:** `app/dashboard/daily-quiz/page.tsx`  
**Status:** ✅ **Complete** (2026-08-24)

**Overview:**
Student-facing page for the Daily 10-Minute Challenge. Fetches (or lazily generates) today's quiz via the API, shows a question preview grid, and starts a standard `TestAttempt` when the student clicks the CTA.

**Features:**
- **Hero card:** Date, difficulty breakdown, completion status (uses `user.lastActiveDate` to infer if taken today), start/retake CTA.
- **Question preview grid:** 10 questions shown as title snippet + difficulty badge. Correct answers are hidden until submission.
- **Start flow:** `POST /api/v1/attempts/daily-quiz/start` → redirects to `/tests/attempt/:id`. The existing test engine handles scoring, XP, and streak natively.
- **Error/loading/empty states:** Full `<ErrorState />`, `<Skeleton />`, and `<EmptyState />` coverage.
- **FloatingNav:** "Daily" tab added to the mobile bottom bar; "Daily Quiz" added to the desktop nav.

**API endpoints consumed:**
- `GET /api/v1/daily-quiz/today` — fetches or auto-generates today's quiz
- `POST /api/v1/attempts/daily-quiz/start` — creates a linked `TestAttempt`
- `POST /api/v1/attempts/:id/submit` — standard submit (no changes needed)

---

## O. Purchases Page
**Route:** `/dashboard/purchases`  
**Location:** `src/app/dashboard/purchases/page.tsx`

**Overview:**
Displays the student's transaction history and active products.

**Features:**
- **Data Fetching:** Calls `GET /payments/history` using `useQuery`.
- **List View:** Shows all past purchases with their status (SUCCESS, FAILED, PENDING), amount paid, payment gateway, and Order ID.
- **Empty State:** If no purchases exist, renders a call-to-action linking to the `/pricing` page.

---

## P. Personalization API Spec
**Location:** `ssc-client/docs/product/personalization-api.md` (Not a page)

**Overview:**
The existing document `personalization-api.md` outlines the *intent* of personalization, including personas (`FULL_TIME_ASPIRANT`, `PART_TIME_ASPIRANT`, `REPEAT_ASPIRANT`). It does not dictate strict endpoint request/response shapes, as those are handled individually by endpoints like `/dashboard/agenda`.

---

## Q. Design System Showcase
**Route:** `/design-system`  
**Location:** `src/app/design-system/page.tsx`

**Overview:**
A developer-only showcase page for the Shadcn-based UI components, color palette, semantic tokens, and page patterns.

**Features:**
- **Navigation:** Left sidebar for jumping between sections (Intro, Brand & Colors, Semantic Status, Subject System, etc.).
- **Token Editor Sidebar:** Right sidebar for tweaking tokens in real time.
- **Usage:** Used heavily during the Phase 4 Polish sprint for ensuring UI consistency. It should likely be removed or hidden behind a `process.env.NODE_ENV === 'development'` flag before production deployment.
