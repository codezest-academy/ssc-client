# SSC Client Web

The student-facing application for the SSC Competitive Exam Education Platform. 
Used by `STUDENT` roles to browse lessons, attempt practice sets, take mock tests, and view analytics.

## 🚀 Features
- **Student Dashboard:** View enrolled mock tests, upcoming exams, and progress.
- **Mock Test Engine:** Timed exam simulation with multiple sections, tracking attempts, and auto-submit.
- **Content Access:** Role and payment-gated content locking via Razorpay.
- **Responsive UI:** Fully responsive Next.js application leveraging Shadcn UI components.
- **Programmatic SEO:** Dynamic SSR routes and sitemap generation for indexing Previous Year Questions (PYQs).

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router)
- **State Management:** Zustand (for Auth), TanStack Query (React Query for server state)
- **Forms & Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (Customized to match strict brand theme)
- **API Client:** Axios (with JWT interceptors)

## 📋 Prerequisites
- **Node.js**: >= 18.x
- **npm** or **yarn**
- **Backend API**: Running instance of `ssc-api`

## ⚙️ Environment Variables
Create a `.env.local` file in the root. Key variables include:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | Yes (default: `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID | Yes (for payments) |

## 🚀 Getting Started

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts
- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Builds the application for production.
- `npm start` - Starts the production server.
- `npm run lint` - Runs ESLint.
- `npm run typecheck` - Validates TypeScript types.

## 📂 Project Structure
```text
ssc-client/
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           # Reusable React components (UI, Gates, Shared)
├── lib/                  # Utilities (Axios client, Theme utils)
├── types/                # Global TypeScript definitions & API models
├── docs/                 # Documentation & Architecture records
└── package.json
```

## 📚 Documentation
- [Core Architecture](docs/architecture-and-infrastructure/2026-07-26-core-architecture/core-architecture.md)
- [Theme System](docs/frontend-and-ux/2026-07-26-theme-system/theme-system.md)
- [Progress Tracker](docs/progress-and-planning/2026-07-26-master-progress-tracker/progress-tracker.md)

## 🤖 AI Assistant Guidelines
Please refer to [GEMINI.md](GEMINI.md) and [CLAUDE.md](CLAUDE.md) for strict architectural and typing rules (e.g., no `any` types allowed).
