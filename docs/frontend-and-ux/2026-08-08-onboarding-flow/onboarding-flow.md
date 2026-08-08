# Onboarding Flow — Design & Spec

**Date:** 2026-08-08  
**Status:** 🔴 Planned  
**Author:** CVS Charan  
**Route:** `app/onboarding/page.tsx`

---

## Overview

The onboarding flow is a **mandatory 4-step wizard** that runs immediately after a student verifies their email address. The student cannot access the main dashboard until `user.onboardingComplete === true`.

This is the primary persona-capture mechanism. The answers collected here drive the entire personalization engine and determine which dashboard experience the student receives.

> **UX Principle:** The wizard must feel light, friendly, and fast — not like a form. Each step is one focused question. The visual style follows the "Floating Bento" paradigm: large rounded cards, ambient gradients, no harsh borders.

---

## Route Guard Logic

```typescript
// middleware.ts (Next.js)
// After auth check:
if (user.role === 'STUDENT' && !user.onboardingComplete) {
  redirect('/onboarding');
}
```

Any authenticated student without `onboardingComplete = true` is redirected to `/onboarding` regardless of the URL they attempt to access.

---

## Step-by-Step Specification

### Step 1 — The Goal
**Heading:** "Which exam are you targeting?"  
**Subtext:** "We'll personalise your preparation path around it."

**Fields:**
- `targetExam` — Large visual card grid (SSC CGL, SSC CHSL, SSC MTS, SSC CPO, SSC GD). One selectable at a time.
- `examYear` — Dropdown: "2025", "2026", "2027", "Not sure yet"

**CTA:** "Continue →"

---

### Step 2 — Your Situation
**Heading:** "What best describes you right now?"  
**Subtext:** "There are no wrong answers — this helps us show you what's most useful."

**Options (large illustrated cards, one selectable):**
| Card Label | Subtext | Maps To |
|---|---|---|
| 🎓 Full-time student | "Preparing is my main focus right now." | `occupation: 'Student'`, `hasAttemptedBefore: false` |
| 💼 Working & preparing | "I study alongside my job." | `occupation: 'Working Professional'` |
| 🔁 I've attempted before | "This isn't my first attempt." | `hasAttemptedBefore: true` |

**CTA:** "Continue →"

---

### Step 3 — Your Time
**Heading:** "How much time can you give daily?"  
**Subtext:** "Be realistic — we'll build a plan that actually fits your life."

**Options (large cards):**
| Card | Maps To |
|---|---|
| ⚡ Less than 2 hours | `LESS_THAN_2_HOURS` |
| 📚 2–4 hours | `TWO_TO_FOUR_HOURS` |
| 🔥 More than 4 hours | `MORE_THAN_4_HOURS` |

**CTA:** "Continue →"

---

### Step 4 — About You *(Optional — Skippable)*
**Heading:** "A little more about you"  
**Subtext:** "Totally optional — skip anytime. You can always fill this in your profile later."

**Fields (all optional):**
- `age` — Number input (min 15, max 45)
- `gender` — Select: Male / Female / Other / Prefer not to say
- `educationLevel` — Select: High School / Undergraduate / Postgraduate / Other
- `city` — Text input
- `incomeRange` — Select: "< 3 LPA" / "3–6 LPA" / "6–10 LPA" / "> 10 LPA" / "Prefer not to say"

**CTAs:**
- "Skip for now" (ghost/secondary button) — submits with only the required fields
- "Let's go! →" (primary button) — submits all data

---

## State Management

Onboarding state is managed locally in the page component (not in Zustand) since it is a one-time flow.

```typescript
// Local state within onboarding page
const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
const [formData, setFormData] = useState<OnboardingInput>({
  targetExam: null,
  examYear: null,
  occupation: '',
  hasAttemptedBefore: false,
  dailyStudyTime: null,
  // demographics are all optional
});
```

---

## API Call — On Submit

On the final step submission (or skip), the client calls:

```
POST /api/v1/users/onboarding
Body: { ...formData }
```

On success:
1. Update the Zustand auth store: `setUser({ ...user, onboardingComplete: true, studyPersona: data.studyPersona })`
2. Redirect to `/dashboard`

---

## Design Notes

- **Progress:** Show a top progress bar (e.g., `Step 2 of 4`) — never a numbered list which feels like a long form.
- **Back Button:** Available on steps 2–4 to allow changes without losing state.
- **Animations:** Slide-in from right on "Continue", slide-out to left. Must respect `prefers-reduced-motion`.
- **Mobile-first:** Each step is a full-screen centered card on mobile. On desktop, it is a centered modal-like card (`max-w-2xl`) over an ambient gradient background.

---

## Component Tree

```
app/onboarding/
└── page.tsx                    # Main wizard controller
    ├── OnboardingLayout        # Progress bar + back button shell
    ├── StepGoal.tsx            # Step 1
    ├── StepSituation.tsx       # Step 2
    ├── StepTime.tsx            # Step 3
    └── StepAboutYou.tsx        # Step 4 (optional)
```

---

## Related Documents

| Document | Location |
|---|---|
| User Personas | `ssc-api/docs/product/user-personas.md` |
| Personalization API | `ssc-api/docs/product/personalization-api.md` |
| UX/UI Guidelines | `docs/frontend-and-ux/2026-08-03-ux-architecture-and-standards/ux-ui-guidelines.md` |
| Theme System | `docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md` |
