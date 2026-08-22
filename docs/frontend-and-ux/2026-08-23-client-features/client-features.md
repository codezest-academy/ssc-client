# Client Web Features — Low-Priority Docs

**Date:** 2026-08-23  
**Status:** ✅ Implemented / 🔴 Missing  
**Applies to:** `ssc-client`

This document details low-priority/miscellaneous client pages and features, addressing gaps M through Q from the gap analysis backlog.

---

## M. Gamification UI
**Route:** `/dashboard`  
**Location:** `src/app/dashboard/page.tsx`

**Overview:**
The gamification UI surfaces the user's XP, rank tier, and streak to them on the main dashboard.

**Features:**
- **Gamification Widget:** Shows rank tier (e.g., ASPIRANT, CONSTABLE) and total XP. Displays a progress bar to the next tier and the user's current streak (in days).
- **Data Source:** Pulls data from `profile` object passed to the `GamificationWidget`.

---

## N. Daily Quiz UI
**Route:** Unknown (`/dashboard/daily-quiz` planned)  
**Status:** 🔴 **Not Built**

**Overview:**
The Daily Quiz API (Phase 15) is fully functional on the backend, generating personalized daily quizzes for students. However, no frontend page or component currently exists in `ssc-client` to render or take these quizzes.

**Gap:** A student-facing UI route needs to be created to consume the `/api/v1/daily-quiz` endpoints.

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
