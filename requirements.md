# Shared acceptance criteria

As a student, I want to check whether Room 101 is available at a future start time for a selected duration, so that I can plan my study session without changing existing bookings.

Room 101, Engineering Block. The demo clock is fixed at 08:30. Existing bookings are 09:00–10:00 (CS Dept) and 12:00–13:00 (Math Dept).

Inputs: start time (HH:MM), duration in whole minutes and blocked flag. Outputs: availability boolean, reason code (FREE, OVERLAP, BLOCKED or INVALID) and a visible message.

| ID | Acceptance criterion |
|---|---|
| AC1 | Start time must be later than 08:30 on the same day. |
| AC2 | Duration must be a whole number from 1 to 120 minutes. The interval must end by midnight. |
| AC3 | Reject a request that overlaps an existing booking. Allow it to start when a booking ends. |
| AC4 | Return Unavailable when Room 101 is blocked, even if the interval is free. |
| AC5 | Show the decision and a reason. Keep both existing bookings unchanged. |
| AC6 | Give a readable validation message for an invalid start time or duration. |
