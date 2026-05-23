# Core Table Structure

## Users
- Stores admin, teacher, student, and parent login identities.
- Passwords must be stored as hashes only.
- Role controls portal access and admin protection.

## Students
- Stores admission number, class, section, and parent relationship.
- Linked to attendance, homework, results, fee ledgers, and downloads.

## Payments
- Stores all payment attempts and successful settlements.
- Uses `IdempotencyKey` to prevent duplicate payment processing.
- Receipt numbers are generated only after gateway success verification.

## Academic Operations
- `Attendance` stores one status per student per date.
- `Results` stores exam and subject-level marks.
- `Homework` supports class-wide or student-specific assignments.
- `Timetable` stores class, section, period, teacher, and time slots.

## Content And Admissions
- `Notices` and `Events` power public pages and portal announcements.
- `Admissions` tracks submitted admission forms from review through approval or cancellation.
