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

1. **Reduce Anxiety, Build Confidence** — Avoid red as dominant color in study flow. Use progress indicators liberally.
2. **Focus Over Feature Discovery** — Focus Mode during tests: strip all navigation, reduce chrome to zero.
3. **Immediate Feedback Loops** — Practice set responses: show correct/incorrect immediately after selection.
4. **Mobile-First, Touch-Friendly** — 44px minimum touch targets. No hover-dependent interactions.
5. **Respect Long Study Sessions** — Dark mode must work perfectly. Avoid pure white.

---

## Color & Theme

### Primary Brand Color

`--primary = oklch(0.55 0.20 275)` → **CodeZest Indigo**

The client app is slightly more expressive than the admin (up to 20% brand in hero areas) but still disciplined.

**Red is not the brand color.** Red only appears as `--destructive` in error/danger states and test review (incorrect answers use `--incorrect` token, not `--destructive`).

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
