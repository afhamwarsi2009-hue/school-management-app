# Database Relationships

- `Users.UserId` to `Students.ParentUserId`: one parent account can be linked to student records.
- `Students.StudentId` to `Payments.StudentId`: one student can have many fee payment records.
- `Students.StudentId` to `Attendance.StudentId`: one student can have many attendance records.
- `Students.StudentId` to `Results.StudentId`: one student can have many result rows.
- `Students.StudentId` to `Homework.StudentId`: homework can target a student or be class-wide when null.
- `Users.Role` controls admin, teacher, student, and parent authorization paths.
