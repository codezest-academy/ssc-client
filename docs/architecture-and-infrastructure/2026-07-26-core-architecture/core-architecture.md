# Core Client Architecture

**Date:** 2026-07-26  
**Updated:** 2026-08-08  
**Status:** 🟢 Active — Finalized  
**Author:** CVS Charan

---

## Context

The `ssc-client` is the student-facing application where `STUDENT` users login, study learning content (videos, articles, PDFs), attempt practice sets and mock tests, and track their progress and leaderboard rank.

---

## Finalized Stack

| Concern | Decision |
|---|---|
| **Framework** | Next.js 14 App Router (React Server Components where possible) |
| **State Management** | Zustand (auth, test engine) + TanStack React Query (server state) |
| **API Client** | Axios with typed wrappers in `lib/api/` |
| **Auth** | Access token in Zustand memory; Refresh token in httpOnly cookie (handled by API) |
| **UI Library** | shadcn/ui + TailwindCSS v4 |
| **Math Rendering** | KaTeX (via `QuestionRenderer` component) |
| **Animations** | Framer Motion (respects `prefers-reduced-motion`) |

---

## Key User Flows

| Flow | Route | Description |
|---|---|---|
| **Auth** | `/login`, `/register`, `/verify-email` | Register → OTP Verify Email → Redirect to Onboarding |
| **Onboarding** | `/onboarding` | 4-step persona wizard (Goal → Situation → Time → Demographics) → Dashboard |
| **Learning** | `/subjects`, `/subjects/[slug]/[chapter]` | Browse Subjects → Chapters → Lessons (video/article/PDF) → Mark Complete |
| **Practice** | `/practice` | Browse Practice Sets → Attempt MCQs → View Instant Result |
| **Mock Test** | `/tests/[id]/attempt` | Focus Mode Engine (Timer, Palette, Anti-cheat) → Submit → Scorecard |
| **Analytics** | `/dashboard` | Persona-aware dashboard: accuracy by subject, streak, rank, recent attempts |
| **Leaderboard** | `/leaderboard` | Global + per-mock-test rankings |
| **Profile** | `/profile` | Update demographics, change exam target, re-take persona quiz |

---

## Route Guard Rules

```
Unauthenticated user → redirect to /login
Authenticated + !isEmailVerified → redirect to /verify-email
Authenticated + !onboardingComplete → redirect to /onboarding
Authenticated + onboardingComplete → allow access to all student routes
```

---

## Persona-Aware Dashboard

The dashboard layout varies based on `user.studyPersona`. See [User Personas](../../../../../ssc-api/docs/product/user-personas.md) for the full persona-to-feature mapping.

| Persona | Dashboard Hero | Primary CTA |
|---|---|---|
| `FULL_TIME_ASPIRANT` | Today's Study Plan | Continue Learning |
| `PART_TIME_ASPIRANT` | Daily 15-Min Quiz | Start Quiz |
| `REPEAT_ASPIRANT` | Your Weak Areas | Practice Weak Topics |

---

## State Management Architecture

### Zustand Stores

| Store | File | Responsibilities |
|---|---|---|
| `useAuthStore` | `store/useAuthStore.ts` | User object, access token, login/logout actions |
| `useTestEngineStore` | `store/useTestEngineStore.ts` | Active test state, responses, timer, palette states |

### React Query Keys Convention
```typescript
['subjects']                        // All subjects
['chapters', subjectId]             // Chapters for a subject
['lessons', chapterId]              // Lessons for a chapter
['practiceSet', practiceSetId]      // Single practice set with questions
['mockTest', mockTestId]            // Single mock test with sections
['dashboard', 'student']            // Student analytics dashboard
['leaderboard', 'global']           // Global leaderboard
```

---


---

## 📱 Mobile Architecture (ssc-mobile)

We are concurrently developing the `ssc-mobile` native application alongside this web client. 
- **Tech Stack**: React Native CLI, React Navigation, NativeWind, react-native-reusables.
- **Shared Logic**: The mobile app uses the exact same Zustand auth store structure, React Query keys, and Axios API interceptors as `ssc-client`.
- **Purpose**: Provides students with an offline-capable, high-performance native experience (using FlashList and Reanimated) for studying and test-taking.

## Related Documents

| Document | Location |
|---|---|
| API Response Shapes | [client-data-models.md](../../database-and-schema/2026-07-26-client-data-models/client-data-models.md) |
| Onboarding Flow Spec | [onboarding-flow.md](../../frontend-and-ux/2026-08-08-onboarding-flow/onboarding-flow.md) |
| UX/UI Guidelines | [ux-ui-guidelines.md](../../frontend-and-ux/2026-08-03-ux-architecture-and-standards/ux-ui-guidelines.md) |
| Theme System | [theme-system.md](../../frontend-and-ux/2026-07-26-theme-system/theme-system.md) |
| User Personas | [user-personas.md](../../../../../ssc-api/docs/product/user-personas.md) |
