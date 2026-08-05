# API Response Shapes & Client Data Models

**Date:** 2026-07-26
**Status:** 🔴 Draft — to be updated as API routes are implemented
**Author:** CVS Charan
**Source:** `ssc-api` → `src/modules/*/`

---

## Purpose

This document records the API response shapes and client-side TypeScript interfaces the `ssc-client` should use. It is updated whenever a new API route is finalized.

---

## Standard API Response Envelope

All API responses follow this envelope:

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "string"
}

// Error
{
  "success": false,
  "error": "string",
  "details": { ... }   // Zod validation errors, if applicable
}

// Paginated
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

---

## Auth

### `POST /api/v1/auth/login` Response
```typescript
interface LoginResponse {
  accessToken: string;        // JWT, 15 min
  user: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT';
    avatarUrl: string | null;
    targetExam: ExamType | null;
    isEmailVerified: boolean;
    subscriptionTier: 'FREE' | 'PRO' | 'ELITE';
  };
}
```
> Refresh token is set automatically as an httpOnly cookie — no client handling needed.

---

## Subjects

### `GET /api/v1/subjects` Response
```typescript
interface Subject {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  description: string | null;
  examTypes: ExamType[];
  order: number;
}
```

---

## Lessons

### `GET /api/v1/chapters/:chapterId/lessons` Response
```typescript
interface Lesson {
  id: string;
  title: string;
  slug: string;
  type: 'VIDEO' | 'ARTICLE' | 'PDF';
  videoUrl: string | null;
  articleHtml: string | null;
  pdfUrl: string | null;
  durationMins: number | null;
  thumbnailUrl: string | null;
  isFree: boolean;
  order: number;
  isCompleted: boolean;    // injected server-side based on logged-in student's progress
}
```

---

## Practice Sets

### `GET /api/v1/practice-sets/:id` Response
```typescript
interface PracticeSet {
  id: string;
  title: string;
  description: string;
  subject?: { name: string };
  chapter?: { name: string };
  isFree: boolean;
  questions: any[];
}
```

---

## Mock Tests

### `GET /api/v1/mock-tests/:id` Response
```typescript
interface MockTest {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  examType: string;
  isFree: boolean;
  sections: any[];
}
```

---

## Test Attempts

### `POST /api/v1/attempts/start` Request Body
```typescript
interface StartAttemptBody {
  type: 'PRACTICE' | 'MOCK';
  referenceId: string;    // practiceSetId or mockTestId
}
```

### `POST /api/v1/attempts/:id/submit` Request Body
```typescript
interface SubmitAttemptBody {
  responses: {
    questionId: string;
    selectedOption: 'A' | 'B' | 'C' | 'D' | null;  // null = skipped
    timeTakenSeconds: number;
  }[];
}
```

---

## Leaderboard

### `GET /api/v1/analytics/leaderboard/global` Response
```typescript
interface LeaderboardEntry {
  rank: number;
  student: {
    id: string;
    name: string;
  };
  totalScore: number;
  averageAccuracy: number;
  testsTaken: number;
}
// Returns: LeaderboardEntry[] inside the data envelope
```

### `GET /api/v1/analytics/leaderboard/mock-tests/:mockTestId` Response
```typescript
interface MockTestLeaderboardEntry {
  rank: number;
  id: string;
  marksObtained: number;
  accuracy: number;
  timeTakenSeconds: number;
  student: {
    id: string;
    name: string;
  };
}
// Returns: MockTestLeaderboardEntry[] inside the data envelope
```

---

*(Add new response shapes here as API routes are implemented)*
