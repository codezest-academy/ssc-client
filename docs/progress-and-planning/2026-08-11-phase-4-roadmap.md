# Phase 4 Roadmap: Polish & Scale (Client)

**Date:** 2026-08-11
**Status:** Planning

With the MVP features (Phases 1-12) completed, `ssc-client` requires enhancements focused on UX polish, performance, and reliability.

## 1. UX & Internationalization
*   **Internationalization (i18n):**
    *   Integrate `next-intl` to support English and Hindi locales.
    *   Translate all UI elements, layout text, and onboarding flows.
*   **Progressive Web App (PWA):**
    *   Implement Service Workers.
    *   Enable offline caching for critical static assets and specific downloaded lessons/PDFs.

## 2. Code Quality & Reliability
*   **End-to-End (E2E) Testing:**
    *   Integrate **Playwright** or **Cypress**.
    *   Write E2E tests for the core critical path: Registration -> Subject Selection -> Attempting a Mock Test -> Viewing Analytics.
*   **Error Tracking:**
    *   Integrate **Sentry** (Next.js SDK) for real-time frontend crash reporting and performance monitoring.
*   **CI/CD Pipeline:**
    *   Create GitHub Actions workflow (`.github/workflows/client.yml`) for `vitest` and `eslint`.

## 3. Performance
*   **Advanced Data Fetching:**
    *   Implement aggressive pre-fetching with React Query to eliminate loading states during standard dashboard navigation.
*   **Bundle Optimization:**
    *   Analyze Next.js bundle size and lazy-load non-critical components (e.g., Heavy Recharts charts).
