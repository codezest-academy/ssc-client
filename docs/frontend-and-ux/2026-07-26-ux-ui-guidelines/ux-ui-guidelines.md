# UX/UI Guidelines — Client App

**Date:** 2026-07-26
**Updated:** 2026-07-28
**Status:** 🟢 Active
**Author:** CVS Charan

---

## Purpose

Defines design principles, component conventions, and interaction patterns for the `ssc-client` student-facing app.

---

## Design Principles

1. **Reduce Anxiety, Build Confidence** — Use Indigo as the primary brand color to promote focus and trust. Avoid red as a dominant color in the study flow; reserve `--destructive` strictly for wrong answers. Use progress indicators liberally.
2. **Focus Over Feature Discovery** — Focus Mode during tests: strip all navigation, reduce chrome to zero.
3. **Immediate Feedback Loops** — Practice set responses: show correct/incorrect immediately after selection.
4. **Mobile-First, Touch-Friendly** — 44px minimum touch targets. No hover-dependent interactions.
5. **Respect Long Study Sessions** — Dark mode must work perfectly. Avoid pure white.

---

## Color & Theme

### Primary Brand Color

`--primary = oklch(0.55 0.20 275)` → **CodeZest Indigo**

The client app is slightly more expressive than the admin (up to 20% brand in hero areas) but still disciplined. Indigo promotes professional trust and calm focus, which is essential for studying.

**Red is strictly semantic (not the brand color).** Red only appears as `--destructive` in error/danger states and test review (incorrect answers use `--incorrect` token, not `--destructive`). Red = "Wrong", so using it for primary actions induces anxiety.

See `theme-system.md` for full token reference including Test State Tokens and Motivational Tokens.

---

## Layout Conventions

### Student Shell

- **Bottom Nav** (mobile): 5 items max. Dashboard, Subjects, Practice, Mock Tests, Profile.
- **Side Nav** (desktop, 768px+): Collapsible, same indigo active state as admin sidebar.
- **Focus Mode** (during test): No navigation visible. Top bar = timer + submit only.

---

## Icon System (Standardized — Lucide React only)

### Navigation

| Route | Icon |
|---|---|
| Dashboard / Home | `Home` |
| Subjects | `BookOpen` |
| Practice Sets | `ClipboardList` |
| Mock Tests | `FileCheck` |
| Leaderboard | `Trophy` |
| Profile | `UserCircle` |

### Actions

| Action | Icon |
|---|---|
| Start Test | `Play` |
| Submit | `CheckCircle` |
| Back | `ArrowLeft` |
| Next | `ArrowRight` |
| Bookmark | `Bookmark` |
| Loading | `Loader2` |

### Test State Icons

| State | Icon | Token |
|---|---|---|
| Correct answer | `CheckCircle` | `text-correct` |
| Wrong answer | `XCircle` | `text-incorrect` |
| Skipped | `MinusCircle` | `text-muted-foreground` |
| Streak | `Flame` | `text-streak` |
| Achievement | `Trophy` | `text-achievement` |

---

## Test Engine Architecture

> **Added:** 2026-07-28

The Mock Test Engine is the core interactive product. It lives at `app/tests/[id]/attempt/page.tsx` and is composed of the following components in `components/test-engine/`.

### Focus Mode

During an active test, the standard app shell (bottom nav, sidebar, header) is completely hidden. The `TestLayout` component provides a stripped-down shell:

- **Header**: Logo + Test Title + `TestTimer` + Submit button only
- **Main**: `QuestionViewer` — full height, scrollable
- **Right Sidebar (desktop)**: `QuestionPalette` (320px fixed)
- **Mobile Drawer**: `QuestionPalette` accessible via the palette grid icon, slides in from right

### Question Palette States

The palette uses **perfectly circular, softly colored** indicators (not harsh legacy squares). Each indicator maps to a Zustand state:

| State | Shape & Color | Token Used |
|---|---|---|
| Not Visited | ⚪ Gray outline circle | `border-muted-foreground/30` |
| Not Answered | 🟠 Soft Coral/Amber circle | `bg-amber-100 text-amber-700` |
| Answered | 🟢 Mint/Emerald circle | `bg-emerald-100 text-emerald-700` |
| Marked for Review | 🟣 Deep Indigo circle | `bg-primary/10 text-primary` |
| Answered & Marked | 🟣+✨ Indigo + Star icon | `bg-primary text-primary-foreground` + `Star` icon overlay |

### Anti-Cheat

A `beforeunload` event listener fires when `status === 'IN_PROGRESS'`. The browser will show a confirmation dialog if the student tries to refresh, navigate away, or close the tab. This is disabled automatically once the test is submitted.

### State Management

State lives in `store/useTestEngineStore.ts` (Zustand). Key actions:

| Action | Effect |
|---|---|
| `saveAndNext()` | Marks question ANSWERED or NOT_ANSWERED, advances to next |
| `markForReviewAndNext()` | Marks MARKED_FOR_REVIEW or ANSWERED_MARKED_FOR_REVIEW, advances |
| `clearResponse()` | Removes the selected answer for the current question |
| `jumpToQuestion(index)` | Jumps directly; marks destination as NOT_ANSWERED if NOT_VISITED |
| `tickTimer()` | Called every second via `setInterval` in `TestTimer`; auto-submits at 0 |
| `submitTest()` | Sets `status = 'SUBMITTED'`, shows the submission screen |

