# Dynamic Practice & Daily Target Strategy

## Overview
To increase user engagement and ensure users do not see repetitive content, the system now dynamically generates practice tests on the fly instead of relying on static Practice Sets.

## How it works

### The Dynamic Generation Engine (`ssc-api`)
- Endpoint: `POST /attempts/dynamic`
- The engine fetches all active questions that the user has **not yet answered correctly**.
- It filters by `subjectId` or `chapterId` if provided.
- The candidate questions are randomly shuffled to guarantee a unique test every time.
- The shuffled questions are sliced based on a `limit` parameter:
  - **Daily 10-Min Target**: Uses a limit of 10. If no subject is specified, it evenly distributes questions across all subjects in the curriculum.
  - **Practice Sets**: Uses a limit of 20 (or higher) to generate a full practice session for a specific subject or topic.

### UI Integration (`ssc-client`)
- **Daily Target**: Users can now click "Start Target" and select whether they want a "Mixed Bag" (all subjects) or a specific subject focus.
- **Practice Sets**: Rebuilt to resemble the PYQ explorer. Users drill down into subjects and topics to generate targeted, on-the-fly quizzes.
