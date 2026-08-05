# Architecture & Best Practices Audit Report

**Date:** 2026-08-05
**Scope:** `ssc-api`, `ssc-client`, `ssc-admin-web`, and `schema.prisma`
**Author:** AI Tech Lead

---

## 1. Database Schema (`Prisma` & `PostgreSQL`)

### ✅ Strengths
- **Enums & Types:** Excellent use of enums (`Role`, `SubscriptionTier`, `Difficulty`, `ExamType`) ensuring data integrity at the database level.
- **Indexing:** Essential foreign keys (`subjectId`, `chapterId`, `studentId`) are properly indexed, which is crucial for read-heavy operations like dashboards.
- **Normalization vs Denormalization:** Denormalizing `subjectId` onto the `Lesson` model is a smart choice for faster subject-level querying without deep joins.

### ⚠️ Areas for Improvement
- **Soft Deletes vs. Cascade Deletes:** Currently, many relations use `onDelete: Cascade`. In an ed-tech platform, hard-deleting records (especially `Questions`, `Lessons`, or `Users`) is dangerous because it can orphan or destroy historical analytics data (e.g., if a question is deleted, old test attempts will lose data). 
  - *Recommendation:* Implement a soft-delete pattern (e.g., `deletedAt: DateTime?` or relying strictly on the existing `isActive: Boolean`) for core entities and remove `onDelete: Cascade` where historical retention is necessary.
- **JSON Options:** The `options` field in `Question` is stored as `Json`. Ensure this maps to `jsonb` in PostgreSQL to allow for efficient querying if search inside options is ever needed.

---

## 2. Backend API (`ssc-api` / Express)

### ✅ Strengths
- **Security Middleware:** Uses `helmet` for security headers and `cors` properly configured for credentials (essential for httpOnly cookies).
- **Architecture:** Clean, modular structure (`src/modules/*`) separating routes, controllers, and services.

### ⚠️ Areas for Improvement
- **Global Rate Limiting:** The global rate limit is set to `100 requests per 15 minutes` in `app.ts`. For a modern SPA/Next.js app, a single page load might trigger 3-5 API calls (user profile, dashboard stats, leaderboard, notifications). A user will hit 100 requests very quickly, leading to false-positive blocks.
  - *Recommendation:* Increase global limit to `1000 per 15 mins`, and apply strict limiters (e.g., `5 per 15 mins`) specifically to `/auth/login` and `/auth/register`.
- **Validation:** Ensure that all incoming request bodies and query params are strictly validated using a schema library like **Zod** before hitting the service layer.
- **Pagination:** As the platform grows, endpoints like `/leaderboard` or `/questions` will need cursor-based or offset-based pagination to prevent memory exhaustion on the server.

---

## 3. Student Client (`ssc-client` / Next.js)

### ✅ Strengths
- **Modern Stack:** Next.js App Router, TailwindCSS v4, Zustand, and `shadcn/ui` represent the bleeding-edge industry standard for highly interactive, accessible web apps.
- **Rich Media Support:** Using `KaTeX` for math rendering is the absolute best practice for competitive exam portals.

### ⚠️ Areas for Improvement
- **Server Components (RSC):** Currently, pages like `LessonViewer` use `"use client"` and fetch data via `useEffect` + `axios`. 
  - *Recommendation:* To vastly improve SEO (for free lessons) and Initial Page Load times, fetch public/free data on the server using Next.js Server Components, and pass the initial data to client components.
- **Token Storage:** Storing the `accessToken` in Zustand is acceptable, but ensure the `refreshToken` is handled exclusively via `httpOnly` cookies to protect against XSS (which seems to be the plan based on the API).
- **Error Boundaries:** Wrap major dashboard sections in React Error Boundaries (`error.tsx` in Next.js) so if a single API call fails, the entire dashboard doesn't crash.

---

## 4. Admin Portal (`ssc-admin-web` / Vite)

### ✅ Strengths
- **Tooling:** Vite is the perfect choice for an Admin SPA. It provides lightning-fast HMR and build times.
- **Rich Text & Drag-and-Drop:** Using `@tiptap/react` for WYSIWYG editing and `@hello-pangea/dnd` for reordering chapters/lessons are excellent, robust library choices.

### ⚠️ Areas for Improvement
- **Data Mutability & State:** Admin panels are heavily reliant on data tables and forms. Ensure you are using `@tanstack/react-query` aggressively for caching, background refetching, and optimistic UI updates when reordering lessons or updating questions.
- **File Uploads:** When admins upload PDFs or images for questions, ensure the uploads go directly to a cloud bucket (AWS S3 / GCP Cloud Storage) using presigned URLs, rather than piping large binary files through the Node.js API server to save memory and bandwidth.

---

## Conclusion

The platform is **architecturally very sound** and adheres to modern web standards. The modular monolith approach on the backend combined with separated React frontends is exactly how modern SaaS products scale effectively.

### Next Steps Action Plan
1. Adjust API Rate Limits to prevent user blocks.
2. Review Prisma `onDelete: Cascade` behavior for core models.
3. Strategize migrating key Next.js client pages to Server Components for performance.
