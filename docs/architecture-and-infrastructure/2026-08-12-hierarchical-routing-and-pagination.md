# Hierarchical Routing & Article Pagination

**Date**: 2026-08-12

## 1. Hierarchical Routing for Lessons
- **Route Structure**: `/dashboard/learn/[subjectSlug]/[chapterSlug]/[lessonSlug]`
- We no longer use a flat `/dashboard/lessons/[slug]` route because `Lesson.slug` is no longer globally unique. It is only unique per `chapterId`.
- **Chapter Router**: The `/dashboard/learn/[subjectSlug]/[chapterSlug]` page acts as a router. When visited, it fetches the first lesson of the chapter and instantly redirects the user to it.
- **Curriculum View**: The `/dashboard/subjects/[slug]/chapters/[chapterSlug]` page is the chapter overview page, which displays all lessons inside a chapter.

## 2. Frontend-Driven Article Pagination
- **Pagination Logic**: Article lessons (HTML content) are split into multiple "pages" dynamically on the client side using the `<hr/>` tag as a delimiter.
- **UI Progress**: The `ArticleViewer` component manages the state for the current page (`currentPage`). The "Mark as Complete" button is disabled until the user reaches the final page of the article.
- **Typography**: `@tailwindcss/typography` is installed and used (`prose` classes) to render the article content beautifully in the viewer.
