# SSC Client Web

The student-facing application for the SSC Competitive Exam Education Platform.  
Used by `STUDENT` roles to browse lessons, attempt practice sets, take mock tests, and view analytics.

## 🚀 Features
- **Student Dashboard:** Persona-aware dashboard showing curriculum, progress, streaks, and upcoming mock tests.
- **Mock Test Engine:** Timed exam simulation with multiple sections, question palette, and auto-submit.
- **Practice Sets:** Chapter-level MCQ practice with instant results, per-question explanations, and Danger Zone analytics.
- **Analytics Dashboard:** Accuracy, streak, time-per-question, and chapter-level performance breakdowns.
- **Leaderboard:** All-India student ranking by score and streak.
- **PYQ Explorer:** Topic-wise Previous Year Question practice with instant test generation.
- **Content Access:** Role and payment-gated content via Razorpay integration.
- **Skeleton Loading UI:** All loading states use layout-aware animated skeletons — no plain text spinners.
- **Empty States:** All zero-data screens show polished `<EmptyState />` components with icons and context.
- **Programmatic SEO:** Dynamic SSR routes and sitemap generation for indexing PYQs.
- **KaTeX Math Rendering:** `<QuestionRenderer />` handles all LaTeX math across question and explanation content.

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router)
- **State Management:** Zustand (auth), TanStack Query / React Query (server state)
- **Forms & Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (customized to match strict brand theme)
- **API Client:** Axios (with JWT interceptors + token refresh queue)
- **Notifications:** Sonner (toast notifications for user actions)
- **Math Rendering:** KaTeX via `<QuestionRenderer />`

## 📋 Prerequisites
- **Node.js**: >= 18.x
- **bun** (preferred) or npm
- **Backend API**: Running instance of `ssc-api`

## ⚙️ Environment Variables
Create a `.env.local` file in the root:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | Yes (default: `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID | Yes (for payments) |

## 🚀 Getting Started

1. **Install dependencies**
```bash
bun install
```

2. **Start development server**
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts
- `bun run dev` - Starts the Next.js development server.
- `bun run build` - Builds the application for production.
- `bun run typecheck` - Validates TypeScript types (also run on every commit via Husky).
- `bun run lint` - Runs ESLint.

## 📂 Project Structure
```text
ssc-client/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, Register, Forgot Password
│   ├── (onboarding)/           # Onboarding wizard
│   ├── (marketing)/            # Public pages (planned route group)
│   ├── dashboard/              # Protected student dashboard
│   │   ├── analytics/
│   │   ├── leaderboard/
│   │   ├── mock-tests/
│   │   ├── practice-sets/
│   │   ├── pyq/
│   │   └── subjects/
│   ├── tests/                  # Test engine (attempt, review)
│   └── pyq/                    # Public PYQ explorer
├── components/
│   ├── layout/                 # FloatingNav, MarketingNav (planned)
│   ├── test-engine/            # QuestionViewer, QuestionPalette, TestTimer
│   └── ui/                     # Shared UI: EmptyState, Skeleton, ErrorState (planned), ...
├── lib/                        # axios.ts, utils.ts, razorpay.ts
├── store/                      # Zustand stores (auth)
├── types/                      # Global TypeScript interfaces
└── docs/                       # Architecture & planning docs
```

## 📚 Documentation
- [Core Architecture](docs/architecture-and-infrastructure/2026-07-26-core-architecture/core-architecture.md)
- [Theme System](docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md)
- [UX/UI Guidelines](docs/frontend-and-ux/2026-08-03-ux-architecture-and-standards/ux-ui-guidelines.md)
- [Phase 4 Roadmap](docs/progress-and-planning/2026-08-12-phase-4-roadmap.md)
- [Progress Tracker](docs/progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md)

## 🤖 AI Assistant Guidelines
Refer to [GEMINI.md](GEMINI.md) for strict design system, TypeScript, and semantic token rules.  
No `any` types. No raw Tailwind colors. No `dark:` class modifiers. Use semantic tokens only.

## 🆕 Recent Updates (2026-08-12)
- **Skeleton Loading:** All loading states replaced with layout-aware animated `<Skeleton />` components.
- **Empty States:** `<EmptyState />` component rolled out across all pages that previously showed blank/text-only empty views.
- **Question Shuffling:** Fisher-Yates shuffling for both questions (Practice Sets) and MCQ options (all tests).
- **Danger Zone Analytics:** Post-test flags chapters with < 50% accuracy AND > 30s average time.
- **PYQ Rendering:** `<QuestionRenderer />` with KaTeX support applied across all PYQ pages.
- **Practice Sets on Chapter Pages:** Practice sets now surfaced directly on Chapter detail pages.
