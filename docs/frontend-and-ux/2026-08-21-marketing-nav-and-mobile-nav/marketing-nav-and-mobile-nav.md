# Marketing Navigation & Mobile Bottom Nav

**Date:** 2026-08-21
**Status:** ✅ Complete
**Authors:** Engineering

---

## 1. Overview

This document describes the public-facing navigation architecture (`<MarketingNav />`), the `(marketing)` Next.js route group, the authenticated dashboard's floating navigation (`<FloatingNav />`), its mobile bottom navigation bar, and the **Freemium PYQ Papers** strategy.

---

## 2. Route Group Architecture

The `ssc-client` app is divided into distinct **route groups** that share layout shells without affecting the URL structure.

```
app/
├── (auth)/            # Login, Register, Forgot Password — no nav
├── (marketing)/       # Public pages — MarketingNav + MarketingFooter
│   ├── layout.tsx     # Injects <MarketingNav /> + <MarketingFooter />
│   ├── page.tsx       # / — Home (landing page)
│   ├── pricing/       # /pricing
│   ├── about/         # /about
│   ├── blog/          # /blog
│   ├── contact/       # /contact
│   ├── privacy/       # /privacy
│   ├── terms/         # /terms
│   ├── [examSlug]-mock-tests/  # /ssc-cgl-mock-tests, etc. (SEO pages)
│   └── pyq/           # /pyq — PYQ browser (moved from app/pyq/)
│       ├── page.tsx   # Subject index
│       ├── [subject]/ # Chapter list per subject
│       ├── sitemap.ts # Programmatic SEO sitemap
│       └── papers/    # Full paper viewer — Freemium gated
│           └── [examSlug]/[year]/[shift]/[subject]/page.tsx
├── (onboarding)/      # Onboarding wizard — no nav
├── (learn)/           # Learn flow — no nav (full-screen)
├── dashboard/         # Authenticated area — FloatingNav
├── tests/             # Test engine — no nav (focus mode)
├── profile/           # Profile settings — FloatingNav
└── syllabus/          # Syllabus browser — FloatingNav
```

> **IMPORTANT:** Route group names (in parentheses) **do NOT appear in the URL**. `app/(marketing)/pricing/page.tsx` resolves to `/pricing` in the browser.

---

## 3. `<MarketingNav />` Component

**File:** `components/layout/MarketingNav.tsx`
**Type:** Client Component (`"use client"`)

### 3.1 Behaviour

The `MarketingNav` is a sticky top header rendered on all pages inside the `(marketing)` route group via `app/(marketing)/layout.tsx`.

**Auth-aware rendering** — the right-side CTA buttons adapt based on authentication state:

| State | Rendered |
|---|---|
| `isHydrated = false` (SSR/flash) | Empty right section (prevents hydration mismatch) |
| `isHydrated = true`, `user = null` | "Log In" (ghost button) + "Get Started" (primary pill) |
| `isHydrated = true`, `user` exists | "Go to Dashboard →" (primary pill) |

### 3.2 Structure

```
<header sticky top-0 z-50>
  <div container max-w-7xl>
    [Logo: GraduationCap + "Code Zest Academy"]
    [Nav links: Features · Pricing · Blog]        ← hidden on mobile
    [Auth CTA: conditional (see 3.1)]
  </div>
</header>
```

### 3.3 Hydration Safety Pattern

```tsx
"use client";
export function MarketingNav() {
  const { user, isHydrated } = useAuthStore();

  return (
    <header>
      {/* logo + nav */}
      <div>
        {isHydrated && user ? (
          <Link href="/dashboard"><Button>Go to Dashboard <ArrowRight /></Button></Link>
        ) : isHydrated ? (
          <>
            <Link href="/login"><Button variant="ghost">Log In</Button></Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </>
        ) : null /* SSR: render nothing to avoid hydration mismatch */}
      </div>
    </header>
  );
}
```

---

## 4. `(marketing)/layout.tsx` — Rules

```tsx
export default function MarketingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />
      <main className="flex-1 flex flex-col">{children}</main>
      <MarketingFooter />
    </div>
  );
}
```

> **WARNING — Double-wrapping is BANNED:**
> Do NOT add `min-h-screen` or `flex flex-col` wrappers inside individual marketing page components. The layout already provides the full-height shell.

**✅ Correct:**
```tsx
export default function PricingPage() {
  return <section className="py-24">...</section>;
}
```

**❌ Wrong:**
```tsx
export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col"> {/* BANNED */}
      <main>...</main>
    </div>
  );
}
```

---

## 5. `<FloatingNav />` — Dashboard Navigation

**File:** `components/layout/FloatingNav.tsx`
**Type:** Client Component

### 5.1 Nav Link Arrays

Two separate arrays are defined — desktop uses all 7, mobile uses only 5:

**`navLinks` — desktop (7 tabs, `lg:flex`):**

| Label | Route | Icon |
|---|---|---|
| Curriculum | `/dashboard` | `BookOpen` |
| Syllabus | `/dashboard/syllabus` | `Map` |
| Practice | `/dashboard/practice-sets` | `Target` |
| Tests | `/dashboard/mock-tests` | `PenTool` |
| Analytics | `/dashboard/analytics` | `BarChart3` |
| Leaderboard | `/dashboard/leaderboard` | `Trophy` |
| Alerts | `/alerts` | `Bell` |

**`mobileNavLinks` — mobile bottom bar (5 tabs, `< lg`):**

| Label | Route | Icon |
|---|---|---|
| Home | `/dashboard` | `BookOpen` |
| Practice | `/dashboard/practice-sets` | `Target` |
| Tests | `/dashboard/mock-tests` | `PenTool` |
| Analytics | `/dashboard/analytics` | `BarChart3` |
| Leaderboard | `/dashboard/leaderboard` | `Trophy` |

> **Rationale:** Syllabus and Alerts are secondary features (low daily usage). Mobile bottom bars should surface only the highest-frequency daily actions.

### 5.2 Streak Counter — Semantic Tokens

```tsx
// ✅ Correct (semantic):
className="bg-warning/10 text-warning border-warning/20"

// ❌ Never use (raw Tailwind):
className="bg-orange-50 text-orange-600 border-orange-100"
```

### 5.3 Mobile Bottom Nav Bar Structure

```
[fixed bottom-0 left-0 right-0 z-50]
[bg-card/80 backdrop-blur-md border-t border-border]
[pb-4 pt-2]  ← safe area padding for iOS home indicator

  [Home]  [Practice]  [Tests]  [Analytics]  [Leaderboard]
   icon      icon      icon       icon          icon
  label     label     label      label         label
```

- Renders only when `user` exists (`FloatingNav` returns `null` otherwise)
- Never shown inside `/tests/*` routes (separate layout)
- Active state: `text-primary bg-primary/5`
- Inactive: `text-muted-foreground hover:text-foreground hover:bg-accent`

---

## 6. PYQ Freemium Strategy

### 6.1 Route Architecture

All PYQ routes live under `app/(marketing)/pyq/` to inherit MarketingNav + Footer.

```
/pyq                                              — Subject index (fully public, SEO)
/pyq/[subject]                                    — Chapter list (fully public, SEO)
/pyq/papers/[examSlug]/[year]/[shift]/[subject]  — Full paper (freemium gated)
```

### 6.2 Access Tiers

| User State | Access Level |
|---|---|
| Not logged in | **Preview** — first 2 questions visible, rest gated → CTA to `/register` |
| Logged in, FREE | **Preview** — first 2 questions visible, rest gated → CTA to `/dashboard/upgrade` |
| Logged in, PRO or ELITE | **Full access** — all questions + solutions visible |

### 6.3 `<FreemiumPaperCTA />` Component

Rendered inline on the papers page when the user cannot access the full content:

```
┌─────────────────────────────────────────────────────┐
│  🔒  Unlock the Full Paper                           │
│                                                       │
│  Sign in free to view all questions with detailed    │
│  distractor rationales and trap analysis.            │
│                                                       │
│  [Sign in Free]    [Upgrade to Pro]                  │
└─────────────────────────────────────────────────────┘
```

Tokens: `bg-muted border border-border rounded-xl p-8`

### 6.4 Implementation Architecture

The papers page is a **Server Component** (for SEO metadata + data fetch). The freemium gate is a nested `"use client"` child component that reads `useAuthStore`:

```tsx
// app/(marketing)/pyq/papers/.../page.tsx  → Server Component
// Fetches all questions server-side

// <FreemiumPaperGate /> → "use client"
// Slices questions array: shows first 2 always, gates rest
// Reads useAuthStore for user/subscriptionTier
```

> **Future:** Backend can be updated to return only 2 questions for unauthenticated requests and all questions for PRO users. The UI gate will then reflect real data without any frontend changes.

---

## 7. Design System Compliance

### Color Token Reference

| Banned (Raw Tailwind) | Correct (Semantic Token) |
|---|---|
| `text-slate-900` | `text-foreground` |
| `text-slate-600`, `text-slate-500`, `text-slate-400` | `text-muted-foreground` |
| `hover:bg-slate-50` | `hover:bg-accent` |
| `bg-slate-100` | `bg-muted` |
| `bg-white` | `bg-card` |
| `border-slate-100` | `border-border` |
| `bg-orange-50 text-orange-600 border-orange-100` | `bg-warning/10 text-warning border-warning/20` |

No `dark:` modifier overrides are used — all semantic tokens auto-adapt.

---

## 8. Related Documents

| Document | Link |
|---|---|
| Theme System | [theme-system.md](../2026-07-26-theme-system/theme-system.md) |
| UX/UI Guidelines | [ux-ui-guidelines.md](../2026-08-03-ux-architecture-and-standards/ux-ui-guidelines.md) |
| Error Handling Standards | [error-handling.md](../2026-08-12-error-handling-standards/) |
| Go-To-Market Playbook | [ssc_cgl_go_to_market_playbook.md](../../product-strategy/ssc_cgl_go_to_market_playbook.md) |
| Phase 4 Roadmap | [2026-08-12-phase-4-roadmap.md](../../progress-and-planning/2026-08-12-phase-4-roadmap.md) |
