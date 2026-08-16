# System-Wide UI Consistency & Error Boundaries

## Overview
This document outlines the changes made to enforce UI/UX consistency across the application and the implementation of robust Error Boundaries with Zero-Friction Crash Reporting.

## 1. UI/UX Consistency (Dark Mode Strategy)
- **Semantic Tokens:** The application now strictly adheres to semantic design tokens (`bg-background`, `bg-card`, `text-primary`, etc.) instead of raw Tailwind colors (`slate-900`, `emerald-600`).
- **Dark Mode Implementation:** Inline `dark:` modifiers have been removed. Dark mode is handled seamlessly via CSS variables toggled by the `next-themes` `<ThemeProvider>`.
- **Mode Toggle:** A `ModeToggle` component has been integrated into the `FloatingNav` (dashboard layout) to allow users to manually switch between Light, Dark, and System themes, mirroring the functionality in the admin repository.

## 2. Zero-Friction Crash Reporting
Per the UX guidelines, fatal runtime errors are no longer swallowed or met with a blank screen.

- **Global Error Boundaries:** Implemented `app/global-error.tsx` (for root layout crashes) and `app/error.tsx` (for route-level crashes).
- **Inline Feedback Collection:** When an error occurs, the user is presented with an immediate, inline text area asking what they were doing before the crash.
- **Silent Telemetry:** Upon submitting the feedback, the system silently bundles the error stack trace, route URL, and error digest, sending a `CRASH` type report to the `POST /feedback` endpoint for the engineering team to debug.
