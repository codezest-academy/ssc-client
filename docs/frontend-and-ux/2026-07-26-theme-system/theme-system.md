# CodeZest — Theme System (Client App)

> **Written from a Principal UI/UX Engineering perspective.**
> This document is the single source of truth for how color, typography, motion, and visual identity work in the `ssc-client` — the student-facing application where aspirants study, practice, and attempt mock tests.

---

## Table of Contents

1. [Why This Differs From the Admin Portal](#1-why-this-differs-from-the-admin-portal)
2. [Student Psychology & Design Principles](#2-student-psychology--design-principles)
3. [The Design Token Hierarchy](#3-the-design-token-hierarchy)
4. [The 60-30-10 Rule (Client Context)](#4-the-60-30-10-rule-client-context)
5. [Token Reference: What Every Variable Means](#5-token-reference-what-every-variable-means)
6. [Subject Color System](#6-subject-color-system)
7. [Exam Color System](#65-exam-color-system)
8. [Test State Token System](#7-test-state-token-system)
9. [Motivational UI Tokens (Streaks, Progress, Achievements)](#8-motivational-ui-tokens-streaks-progress-achievements)
10. [Focus Mode: The Test-Taking Experience](#9-focus-mode-the-test-taking-experience)
11. [Typography System](#10-typography-system)
12. [Motion & Animation System](#11-motion--animation-system)
13. [The Golden Rules for Developers](#12-the-golden-rules-for-developers)
14. [Common Mistakes and How to Fix Them](#13-common-mistakes-and-how-to-fix-them)
15. [Audit Checklist](#14-audit-checklist)
16. [Accessibility Contract](#15-accessibility-contract)
17. [Component Token Contracts](#16-component-token-contracts)
18. [Mobile-First Constraints](#17-mobile-first-constraints)
19. [Enforcement & Tooling](#18-enforcement--tooling)

---

## 1. Why This Differs From the Admin Portal

The `ssc-client` serves a fundamentally different user with completely different emotional needs than the admin portal.

| Dimension | Admin Portal | Client (Student App) |
|:---|:---|:---|
| **User goal** | Manage content efficiently | Pass the SSC exam |
| **Emotional state** | Professional, task-focused | Anxious, motivated, aspirational |
| **Session length** | 2–4 hours of content work | 20 min study + 2 hr mock test |
| **Device** | Primarily desktop | **Primarily mobile (60–70%)** |
| **UI density** | High — data tables, bulk actions | Medium — readable cards, clear options |
| **Feedback needed** | Confirmation of save/delete | Immediate correct/incorrect, progress |
| **Brand expression** | Restrained (10% color) | Warm, motivating (up to 20% in hero areas) |
| **Motion** | Minimal — operational focus | Purposeful — celebrates wins, indicates progress |
| **Dark mode** | Professional preference | **Critical** — late-night study sessions |

The client app is part productivity tool, part motivational coach. The design must make aspirants feel capable and guided — not overwhelmed.

---

## 2. Student Psychology & Design Principles

These principles are derived from the psychology of exam preparation and learning motivation. Every design decision should map back to one of these.

### Principle 1: Reduce Anxiety, Build Confidence

SSC aspirants face immense competitive pressure. The UI should never feel intimidating.
- **Brand Trust:** Use **CodeZest Indigo** as the primary interactive color. It promotes calm focus and professional trust.
- **Strictly Semantic Red:** Avoid red as a dominant color in the study flow. In education, Red = "Incorrect/Danger". Reserve `--destructive` strictly for wrong answers and deleting data.
- Use progress indicators liberally — partial completion feels like achievement.
- Celebrate small wins (lesson complete, streak maintained, personal best score).

### Principle 2: Focus Over Feature Discovery

When a student is studying or mid-test, nothing should distract them.
- **Focus Mode** during tests: strip all navigation, reduce chrome to zero
- No promotional banners or upgrade CTAs during an active test attempt
- The test UI should feel like a clean exam hall, not a web app

### Principle 3: Immediate Feedback Loops

Learning retention is tied to how quickly feedback arrives.
- Practice set responses: show correct/incorrect **immediately** after selection
- Explanation section revealed **instantly** on submit — no page navigation
- Progress bar updates **in real-time** during lesson completion

### Principle 4: Mobile-First, Touch-Friendly

Most SSC aspirants study on budget-to-mid-range Android phones.
- **44px minimum touch targets** — non-negotiable
- MCQ options must be large enough to tap without zooming
- No hover-dependent interactions (hover doesn't exist on touch)

### Principle 5: Respect Long Study Sessions

Students may spend 4–6 hours in the app.
- **Dark mode must work perfectly** — the most common reason students switch is eye strain
- Avoid pure white backgrounds even in light mode (`bg-background` is slightly warm, not `#FFFFFF`)
- Font sizes must be readable at arm's length on a phone

---

## 3. The Design Token Hierarchy

Same 3-tier approach as the admin portal — but the client extends it with two additional semantic layers: **Test State Tokens** and **Motivational Tokens**.

```
Tier 1: Primitives (Raw OKLCH values — never used in components)
  └── oklch(0.55 0.20 275)   — CodeZest indigo

Tier 2: Alias Tokens (Semantic meaning — defined in index.css)
  └── --primary      = oklch(0.55 0.20 275)
  └── --correct      = oklch(0.65 0.18 150)   ← correct answer
  └── --incorrect    = oklch(0.58 0.20 25)    ← wrong answer
  └── --skipped      = (uses --muted family)  ← unanswered
  └── --streak       = oklch(0.72 0.18 55)    ← streak/fire amber
  └── --achievement  = oklch(0.80 0.16 90)    ← gold for badges

Tier 3: Component Usage
  └── bg-correct, text-correct, border-correct
  └── bg-incorrect, text-incorrect, border-incorrect
  └── text-streak, bg-streak/10
```

---

## 4. The 60-30-10 Rule (Client Context)

The client is slightly more expressive than the admin portal, but still disciplined.

```
60% — Surface and background (bg-background, bg-card)
       Warm neutral, not pure gray. Slightly cream in light mode.
       Deep slate in dark mode — never pure black (#000).

30% — Structure and hierarchy (text-foreground, border-border, bg-muted)
       Chapter names, lesson titles, dividers, secondary labels.

10% — Brand + Subject/Exam accent (bg-primary, --subject-*, --exam-* colors)
       Subject/Exam pills, active nav items, progress bars, CTAs.
       EXCEPTION: Hero areas (subject banners) may use up to 15%
       for warmth and motivation — justified by emotional design goals.
```

### What this looks like in practice

**Correct — Subject chapter list:**
- `bg-background` canvas
- `bg-card` lesson cards
- Subject color (e.g., `text-subject-quant`) only on the subject pill and progress bar fill
- Single `bg-primary` "Continue Studying" CTA button

**Wrong — Over-colored subject page:**
- Full-width `bg-subject-quant` header banner with white text
- Subject color on lesson titles, icons, and progress numbers
- `border-subject-quant` on every card

---

## 5. Token Reference: What Every Variable Means

### Core Structural Tokens (Same as Admin)

| CSS Variable | Tailwind Class | When to Use |
|:---|:---|:---|
| `--background` | `bg-background` | Page canvas |
| `--foreground` | `text-foreground` | Primary body text |
| `--card` | `bg-card` | Lesson cards, chapter cards, MCQ option containers |
| `--card-foreground` | `text-card-foreground` | Text inside cards |
| `--popover` | `bg-popover` | Bottom sheets, tooltips, explanation panels |
| `--muted` | `bg-muted` | Skip badges, disabled options, section dividers |
| `--muted-foreground` | `text-muted-foreground` | Question numbers, timestamps, secondary labels |
| `--border` | `border-border` | Card outlines, MCQ option borders (unselected) |
| `--ring` | `ring-ring` | Focus rings on MCQ options (keyboard navigation) |

### Brand / Interactive Tokens

| CSS Variable | Tailwind Class | When to Use |
|:---|:---|:---|
| `--primary` | `bg-primary` | "Start Test", "Submit", "Continue" CTAs |
| `--primary` | `text-primary` | Active nav items, selected tab indicators |
| `--primary` | `border-primary` | Active/selected state on card outlines |
| `--primary-foreground` | `text-primary-foreground` | Text on primary buttons |
| `--accent` | `bg-accent` | Hover states on nav items |

### Test State Tokens (Client-Exclusive)

> These tokens do not exist in the admin portal. They are the most important tokens in the student test-taking experience.

| CSS Variable | Tailwind Class | Meaning |
|:---|:---|:---|
| `--correct` | `bg-correct`, `text-correct`, `border-correct` | Selected answer is correct |
| `--incorrect` | `bg-incorrect`, `text-incorrect`, `border-incorrect` | Selected answer is wrong |
| `--skipped` | Uses `--muted` family | Question not answered (neutral, not alarming) |
| `--option-selected` | `bg-option-selected`, `border-option-selected` | Currently selected option (before submission) |

### Motivational Tokens (Client-Exclusive)

| CSS Variable | Tailwind Class | Meaning |
|:---|:---|:---|
| `--streak` | `text-streak`, `bg-streak/10` | Daily streak fire indicator |
| `--achievement` | `text-achievement`, `bg-achievement/10` | Gold badge / milestone color |
| `--progress-fill` | `bg-progress-fill` | Progress bar fill (lesson / chapter completion) |
| `--rank-gold` | `text-rank-gold` | Rank #1–3 leaderboard positions |
| `--rank-silver` | `text-rank-silver` | Rank #4–10 |

---

## 6. Subject Color System

Identical palette to admin — consistency matters since admins and students see the same subject names.

```
Subject → Token           → Color           → Personality
────────────────────────────────────────────────────────────────────
Quantitative Aptitude  → --subject-quant   → Amber/Orange   Analytical, energetic
English Language       → --subject-english → Sky Blue       Communication, clarity
General Awareness      → --subject-ga      → Violet         Knowledge, depth
Reasoning              → --subject-reason  → Emerald Green  Logic, growth
General Science        → --subject-science → Cyan/Teal      Exploration, science
```

### Subject Color Usage in the Client

```tsx
// Chapter card — subject color on icon + progress bar only
<div className="bg-card border border-border rounded-2xl p-4">
  <div className="flex items-center gap-3 mb-3">
    {/* Subject color on icon background */}
    <div className="h-10 w-10 rounded-xl bg-subject-quant/10 flex items-center justify-center">
      <CalculatorIcon className="h-5 w-5 text-subject-quant" />
    </div>
    <div>
      <p className="font-semibold text-foreground">Number System</p>
      <p className="text-xs text-muted-foreground">12 lessons · 3h 20m</p>
    </div>
  </div>
  {/* Subject color on progress bar fill only */}
  <div className="h-1.5 w-full bg-muted rounded-full">
    <div className="h-full bg-subject-quant rounded-full" style={{ width: '40%' }} />
  </div>
  <p className="mt-1 text-xs text-muted-foreground">4 / 12 lessons complete</p>
</div>
```

---

## 6.5 Exam Color System

Similar to Subject Colors, the Exam Color System provides a consistent visual identity for different target examinations across the platform.

```
Exam → Token           → Color           → Personality
────────────────────────────────────────────────────────────────────
SSC CGL → --exam-cgl    → Indigo/Blue    Authoritative, premium
SSC CHSL→ --exam-chsl   → Teal/Green     Fresh, accessible
SSC MTS → --exam-mts    → Orange/Amber   Energetic, foundational
SSC CPO → --exam-cpo    → Purple         Disciplined, sharp
SSC GD  → --exam-gd     → Pink/Rose      Dynamic, active
```

### Exam Color Usage

Exam colors are primarily used in user profile preferences, dashboard targets, and filtering. Like subject colors, they should be used sparingly as background tints with high-contrast text.

```tsx
// Exam selection card
<div className="bg-card border border-exam-cgl/30 rounded-2xl p-6">
  {/* Exam color on background tint with matching text */}
  <div className="bg-exam-cgl/10 text-exam-cgl px-3 py-1 rounded-full font-bold">
    SSC CGL
  </div>
</div>
```

---

## 7. Test State Token System

This is the most critical part of the client theme system. Getting this right determines whether students clearly understand their performance.

### MCQ Option States

An MCQ option moves through these states during an attempt:

```
Unselected    →  bg-card border-border text-card-foreground
               (default — neutral, inviting selection)

Selected      →  bg-option-selected/10 border-option-selected text-foreground
               (primary-tinted — shows the student's active choice)

Correct ✅    →  bg-correct/10 border-correct text-correct
               (after submission — green, celebratory but not overwhelming)

Incorrect ❌  →  bg-incorrect/10 border-incorrect text-incorrect
               (after submission — red, clear but not alarming)

Skipped ⬜    →  bg-muted/50 border-border text-muted-foreground
               (unanswered — neutral gray, not punitive)

Disabled      →  bg-muted/30 border-border/50 text-muted-foreground/50
               (after submission — non-selected options fade out)
```

### Implementation Pattern

```tsx
function MCQOption({ option, state }: { option: Option; state: OptionState }) {
  const stateClasses: Record<OptionState, string> = {
    unselected: 'bg-card border-border text-card-foreground hover:bg-accent hover:border-primary/30',
    selected:   'bg-option-selected/10 border-option-selected text-foreground',
    correct:    'bg-correct/10 border-correct text-correct',
    incorrect:  'bg-incorrect/10 border-incorrect text-incorrect',
    skipped:    'bg-muted/50 border-border text-muted-foreground',
    disabled:   'bg-muted/30 border-border/50 text-muted-foreground/50 cursor-not-allowed',
  };

  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-left',
        stateClasses[state]
      )}
    >
      <span className="font-mono font-semibold w-6 shrink-0">{option.key}.</span>
      <span>{option.text}</span>
    </button>
  );
}
```

### Correct/Incorrect Visual Hierarchy (After Submission)

After a practice set question is submitted, the visual hierarchy must tell the story clearly:

1. **Correct answer** — always highlighted in `--correct` regardless of what the student selected
2. **Student's wrong selection** — highlighted in `--incorrect`
3. **All other options** — fade to `disabled` state
4. **Explanation panel** — slides in below with `bg-muted` background and `text-foreground` explanation text

---

## 8. Motivational UI Tokens (Streaks, Progress, Achievements)

### Streak Counter

```tsx
// Daily streak indicator in header/dashboard
<div className="flex items-center gap-1.5 bg-streak/10 text-streak rounded-full px-3 py-1">
  <FlameIcon className="h-4 w-4" />
  <span className="text-sm font-semibold">7 day streak</span>
</div>
```

### Progress Bars

- **Lesson completion:** `bg-progress-fill` (maps to `--primary` by default)
- **Chapter completion:** Subject color fill (`bg-subject-quant`, etc.)
- **Mock test time remaining:** Changes from `--success` → `--warning` → `--destructive` as time decreases

```tsx
// Time-remaining progress bar — color shifts with urgency
function TimeBar({ percentRemaining }: { percentRemaining: number }) {
  const colorClass =
    percentRemaining > 50 ? 'bg-success' :
    percentRemaining > 20 ? 'bg-warning' :
    'bg-destructive';

  return (
    <div className="h-1.5 w-full bg-muted rounded-full">
      <div
        className={cn('h-full rounded-full transition-all', colorClass)}
        style={{ width: `${percentRemaining}%` }}
      />
    </div>
  );
}
```

### Achievement Badges

```tsx
// Gold achievement badge — milestone reached
<div className="flex items-center gap-2 bg-achievement/10 text-achievement border border-achievement/20 rounded-full px-3 py-1.5">
  <TrophyIcon className="h-4 w-4" />
  <span className="text-sm font-semibold">First Mock Test Complete!</span>
</div>
```

---

## 9. Focus Mode: The Test-Taking Experience

When a student is inside an active test attempt, the UI enters **Focus Mode**. This is a distinct visual context, not just a fullscreen toggle.

### Focus Mode Rules

| Element | Normal State | Focus Mode |
|:---|:---|:---|
| Top navigation | Visible (Home, Practice, Tests, Analytics) | **Hidden** |
| Bottom tab bar (mobile) | Visible | **Hidden** |
| Sidebar (if desktop) | Visible | **Hidden** |
| Header | Logo + user menu | **Test title + timer only** |
| Background | `bg-background` | `bg-background` (unchanged) |
| Accent colors | `--primary` | `--primary` (unchanged — consistency) |
| Promotional CTAs | Visible | **Completely removed** |
| Browser back button | Works normally | **Warn on exit — "Your progress may be lost"** |

### Focus Mode Layout

```tsx
// Focus mode layout — replaces AppShell during an active test
function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header — no navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="text-sm font-semibold text-foreground truncate">SSC CGL Mock Test #3</h1>
          <TestTimer />  {/* Timer component with urgency color logic */}
        </div>
      </header>

      {/* Question content */}
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        {children}
      </main>

      {/* Minimal navigation footer — question navigator only */}
      <footer className="sticky bottom-0 bg-card border-t border-border px-4 py-3">
        <QuestionNavigator />
      </footer>
    </div>
  );
}
```

---

## 10. Typography System

### Font Stack

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### Type Scale (Mobile-First)

| Use | Mobile Size | Desktop Size | Weight | Token |
|:---|:---|:---|:---|:---|
| Question text | 16px | 17px | 400 | `text-base lg:text-[17px]` |
| MCQ option text | 15px | 16px | 400 | `text-[15px] lg:text-base` |
| Section/chapter title | 18px | 20px | 600 | `text-lg lg:text-xl` |
| Page title | 20px | 24px | 700 | `text-xl lg:text-2xl` |
| Dashboard stat number | 28px | 32px | 700 | `text-3xl lg:text-4xl` |
| Caption / hint | 12px | 12px | 400 | `text-xs` |
| Streak/badge text | 13px | 14px | 600 | `text-[13px] lg:text-sm` |

### Question Text Rules

Question text is the most-read content in the app. It has special rules:

1. **Minimum 16px** — never smaller, regardless of screen size
2. **Line height `leading-relaxed`** — questions with multiple clauses need breathing room
3. **`font-mono` for numbers and calculations** — `144 ÷ 12 = ?` should use monospace
4. **Never truncate question text** — use `break-words` to handle long words on mobile
5. **Math expressions** — use KaTeX when implemented; until then, use `<code>` with `font-mono`

---

## 11. Motion & Animation System

The client app uses purposeful motion. Every animation must answer "why?" — if it cannot, it should be removed.

### Approved Animations

| Animation | Purpose | Token / Class |
|:---|:---|:---|
| MCQ option selection | Confirms tap/click was registered | `transition-colors duration-150` |
| Correct answer reveal | Celebrates correct answer | `animate-bounce-once` (custom, 400ms) |
| Progress bar fill | Shows completion growth | `transition-[width] duration-500 ease-out` |
| Lesson completion checkmark | Rewards completion | Scale-in keyframe, 300ms |
| Streak counter increment | Motivates continuation | Number count-up, 600ms |
| Screen transition (study → test) | Signals mode change | Slide-in from right, 250ms |
| Score reveal | Dramatic reveal of final score | Staggered fade-in, children 100ms apart |
| Explanation panel reveal | Shows answer context | `animate-in slide-in-from-bottom-2 duration-200` |

### Forbidden Animations

- Background blur circles / radial gradient animations — visual noise during study
- Infinite pulse/spin on non-loading elements — distracting during test
- Anything `>600ms` on a tap interaction — feels laggy on mid-range Android devices
- Page transition animations during an active test — disorienting

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations must respect this media query. **Status: Must be added to `index.css` before launch.** ⚠️

---

## 12. The Golden Rules for Developers

### Rule 1: Never hardcode a color

```tsx
// ❌ NEVER
<div className="bg-green-100 text-green-700 border-green-300">Correct!</div>
<div className="bg-red-100 text-red-700 border-red-300">Incorrect</div>

// ✅ ALWAYS
<div className="bg-correct/10 text-correct border border-correct/20">Correct!</div>
<div className="bg-incorrect/10 text-incorrect border border-incorrect/20">Incorrect</div>
```

### Rule 2: Touch targets are 44px minimum — everywhere

```tsx
// ❌ Too small — will cause mis-taps on mobile
<button className="h-8 w-8 p-1">
  <ChevronLeftIcon className="h-4 w-4" />
</button>

// ✅ Correct — 44px minimum, icon centered
<button className="h-11 w-11 flex items-center justify-center rounded-lg hover:bg-accent">
  <ChevronLeftIcon className="h-5 w-5" />
</button>
```

### Rule 3: No hover-only interactions

Touch screens do not have hover states. Any functionality triggered by hover must also be accessible via tap.

```tsx
// ❌ Tooltip only visible on hover — invisible to mobile users
<div className="group relative">
  <InfoIcon />
  <span className="hidden group-hover:block absolute ...">Explanation</span>
</div>

// ✅ Tap to toggle — works on all devices
<Popover>
  <PopoverTrigger asChild>
    <button className="h-11 w-11 ..."><InfoIcon /></button>
  </PopoverTrigger>
  <PopoverContent>Explanation text</PopoverContent>
</Popover>
```

### Rule 4: Test state tokens are read-only after submission

Once a test is submitted, no UI element should allow re-selection. The `disabled` + `cursor-not-allowed` state is mandatory on all MCQ options.

### Rule 5: The explanation panel never uses brand color

The explanation is educational content — it uses `bg-muted`, `text-foreground`, and `text-muted-foreground`. Brand color in explanations would signal "action" when the student should be reading.

### Rule 6: Subject color ≠ primary color

Subject colors are for identification. The `--primary` token is for calls-to-action. These should never be the same value.

---

## 13. Common Mistakes and How to Fix Them

### Mistake: MCQ options too small to tap comfortably

**Fix:** Each option must be `min-h-[52px]` with `py-3 px-4` padding. Test on a 375px viewport.

---

### Mistake: "Correct" state uses brand primary instead of `--correct`

**Cause:** Developer used `bg-primary/10 text-primary` for selected + correct state.

**Fix:** Use `bg-correct/10 text-correct border-correct`. Primary signals "active brand interaction"; correct signals "right answer" — these must be distinct.

---

### Mistake: Dark mode test screen looks washed out

**Cause:** `bg-card` and option borders are too similar in dark mode.

**Fix:** Increase `border-border` contrast in dark mode CSS variables. Option borders should be `border-2` (not `border`) in the test UI for better separation.

---

### Mistake: Progress percentage shows 100% before animation completes

**Cause:** State updated before CSS transition runs.

**Fix:** Separate data state from animation state. Update the underlying data immediately; drive the visual width via `transition-[width]` CSS with a slight delay.

---

### Mistake: Streak counter shows on the test screen

**Fix:** All motivational UI elements (streak, badges, achievements) must be **removed** in Focus Mode. They belong on the dashboard and lesson completion screens only.

---

## 14. Audit Checklist

```
[ ] No hardcoded hex colors anywhere in JSX
[ ] No raw Tailwind palette classes (emerald, amber, rose, indigo, green, red...)
[ ] All MCQ options meet 44px minimum touch target height
[ ] Correct/Incorrect states use --correct / --incorrect tokens (not --success / --destructive)
[ ] No hover-only interactions — all functionality accessible via tap
[ ] Subject colors use --subject-* tokens
[ ] Progress bars use appropriate fill token (primary / subject / urgency-aware)
[ ] Test-taking screen enters Focus Mode (nav hidden, distractions removed)
[ ] Explanation panel uses muted/neutral tokens, not primary
[ ] Streak and achievement UI absent in Focus Mode
[ ] Dark mode tested thoroughly — question text readable, option borders visible
[ ] Reduced motion preference respected (all transitions respect prefers-reduced-motion)
[ ] Mobile tested at 375px viewport (iPhone SE baseline)
[ ] Touch targets at 375px: all interactive elements ≥ 44px
```

---

## 15. Accessibility Contract

### Text Contrast (WCAG 2.1 AA)

| Context | Requirement | Token Approach |
|:---|:---|:---|
| Question text on card | 4.5:1 minimum | `text-card-foreground` on `bg-card` — verified |
| MCQ option text (unselected) | 4.5:1 | `text-foreground` on `bg-card` — verified |
| Correct state text | 4.5:1 | `text-correct` on `bg-correct/10` — verify in dark mode |
| Incorrect state text | 4.5:1 | `text-incorrect` on `bg-incorrect/10` — verify in dark mode |
| Muted secondary text | 3:1 (large/UI) | `text-muted-foreground` — may need dark mode boost |

### Touch Targets (WCAG 2.5.5 — Target Size)

| Element | Minimum | Approach |
|:---|:---|:---|
| MCQ option buttons | 44px height | `min-h-[52px]` — exceeds minimum |
| Navigation tab items | 44 × 44px | Full-width bottom tab with `py-3` |
| Question navigator buttons | 36 × 36px (compact) | Exception — must use `p-1.5` minimum |
| CTA buttons (Start Test, Submit) | 48px height | `h-12` — prominent action |
| Lesson complete button | 52px height | Prominent celebration moment |

### Screen Reader Support

- MCQ option buttons must have `aria-pressed` to communicate selection state
- Correct/incorrect announcement: use `aria-live="polite"` region for result feedback
- Timer must update `aria-label` to announce time remaining at 10-minute, 5-minute, and 1-minute marks

---

## 16. Component Token Contracts

| Component | Allowed Tokens | Forbidden |
|:---|:---|:---|
| MCQ option (unselected) | `--card`, `--border`, `--foreground` | `--primary`, raw palette |
| MCQ option (selected) | `--option-selected` | `--primary`, `--correct` |
| MCQ option (correct) | `--correct` | `--success`, `--primary` |
| MCQ option (incorrect) | `--incorrect` | `--destructive`, raw red |
| MCQ option (skipped) | `--muted` family | `--warning`, raw palette |
| Submit / CTA button | `--primary`, `--primary-foreground` | Raw palette |
| Subject pill / badge | `--subject-*` family | `--primary`, raw palette |
| Exam pill / card | `--exam-*` family | Raw palette gradients |
| Progress bar (lesson) | `--progress-fill` (= `--primary`) | Raw palette |
| Progress bar (chapter) | Subject color token | `--primary` |
| Timer (normal) | `--success` | `--primary` |
| Timer (warning) | `--warning` | `--primary` |
| Timer (critical) | `--destructive` | Raw red |
| Streak counter | `--streak` | `--warning`, raw amber |
| Achievement badge | `--achievement` | `--warning`, raw gold |
| Explanation panel | `--muted`, `--foreground`, `--muted-foreground` | `--primary`, brand tokens |
| Leaderboard rank #1–3 | `--rank-gold` | Raw yellow |
| Score card | `--correct` (marks), `--incorrect` (wrong), `--muted` (skipped) | Raw palette |

---

## 17. Mobile-First Constraints

### Viewport Baselines

| Baseline | Width | Test Scenario |
|:---|:---|:---|
| Minimum | 375px | iPhone SE, budget Android |
| Primary target | 390px | iPhone 14 (most common student device) |
| Mid-range | 430px | iPhone Plus / large Android |
| Desktop | 1280px+ | Admin-like fallback; some students use tablet |

### Mobile-Specific Rules

1. **No horizontal scroll** on any screen at 375px — use `w-full`, avoid fixed widths
2. **MCQ option text wraps** — never truncate with `truncate` or `whitespace-nowrap`
3. **Bottom tab navigation** — standard mobile pattern; no sidebar on mobile
4. **Safe area insets** — use `pb-safe` (Tailwind safe area plugin) to avoid home bar overlap
5. **Font sizes in `rem`** — never `px` for font-size; respects user's accessibility text scaling
6. **No `overflow-x-hidden` on body** — breaks `position: sticky` on mobile Safari

### Performance Constraints

Budget Android devices may have low CPU/GPU. Animation rules:
- Max 1 concurrent animation per screen
- No `filter: blur()` — GPU intensive, causes jank on low-end devices
- `will-change: transform` only on elements that actually animate
- Lazy-load lesson content (videos, PDFs) — never auto-load

---

## 18. Enforcement & Tooling

### ESLint Rule: No Raw Palette Classes

```javascript
// eslint.config.js
{
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/\\b(bg|text|border|ring|fill|stroke)-(slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/]',
        message:
          '[Theme] Raw Tailwind palette class detected. Use semantic tokens. See docs/frontend-and-ux/theme-system.md',
      },
    ],
  },
}
```

### Grep Audit Commands

```bash
# Raw palette violations
grep -rn '\(bg\|text\|border\)-\(emerald\|amber\|rose\|indigo\|green\|red\|blue\)' src/ --include='*.tsx'

# Hardcoded hex colors
grep -rn '#[0-9a-fA-F]\{3,6\}' src/ --include='*.tsx' --include='*.css'

# Hover-only interactions (potential mobile issue)
grep -rn 'group-hover:block\|group-hover:flex\|hover:block\|hover:flex' src/ --include='*.tsx'

# Touch target violations (looking for h-6, h-7, h-8 on button elements)
grep -rn '<button.*className.*h-[678]\b' src/ --include='*.tsx'
```

---

## Related Documents

- [Theme System (Admin Web)](../../../ssc-admin-web/docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md) — Admin portal theme system
- [API Response Shapes](../database-and-schema/2026-07-26-client-data-models/client-data-models.md) — Data models that drive UI state
- [Master Progress Tracker](../progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md) — Phase status

---

## 19. Central Design System Documentation Hub

While this document outlines the rules for the client app specifically, the interactive visual reference for all shared structural and semantic tokens (colors, buttons, badges) is available at `/design-system` within the `ssc-admin-web` application.
That hub serves as the **production-ready documentation site** containing:
- **Interactive Token Editor**: A sidebar that lets you test Hue, Chroma, and Border Radius live with WCAG contrast checking.
- **Visual Token Governance**: Concrete "Do / Don't" UI patterns demonstrating strict adherence to semantic tokens over raw Tailwind classes.
- **Dual-Theme Previews**: Instantly verify how tokens render in light and dark modes side-by-side.
- **Subject Tokens**: Visual representation of the `--subject-*` color family.

If you are porting a component from the admin web or adding a new shared token, always refer to the Admin `/design-system` hub as the visual source of truth.
