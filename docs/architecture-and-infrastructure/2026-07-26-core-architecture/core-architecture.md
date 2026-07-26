# Core Client Architecture

**Date:** 2026-07-26
**Status:** 🔴 Planned
**Author:** CVS Charan

---

## Context

The `ssc-client` is the student-facing application where `STUDENT` users login, study learning content (videos, articles, PDFs), attempt practice sets and mock tests, and track their progress and leaderboard rank.

---

## Decisions

*(To be filled in when frontend development begins)*

### Planned Stack
- **Framework:** React (Vite) or React Native — TBD based on web-only vs mobile requirement
- **State Management:** TBD (Zustand / React Query)
- **API Client:** Axios with typed wrappers
- **Auth:** Access token in memory; refresh token in httpOnly cookie (handled by API)

---

## Key User Flows (Planned)

| Flow | Description |
|---|---|
| Onboarding | Register → Verify Email → Select Target Exam → Dashboard |
| Learning | Browse Subjects → Chapters → Lessons (video/article/PDF) → Mark Complete |
| Practice | Browse Practice Sets → Attempt MCQs → View Instant Result |
| Mock Test | Browse Mock Tests → Timed Full Test → Submit → Detailed Scorecard |
| Analytics | Dashboard — accuracy by subject, streak, rank, recent attempts |
| Leaderboard | Top students per mock test |

---

## Consequences

*(To be documented after architecture is finalized)*
