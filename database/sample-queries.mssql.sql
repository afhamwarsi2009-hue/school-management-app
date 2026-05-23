USE school_management;
GO

INSERT INTO dbo.students (AdmissionNumber, Name, Email, Class, RollNumber, TotalFees, PaidFees)
VALUES (N'GPS-2026-001', N'Aarav Sharma', N'aarav@example.com', N'10-A', N'10A-01', 50000, 15000);
GO

INSERT INTO dbo.homework (StudentId, Class, Subject, Title, Description, DueDate)
VALUES (1, N'10-A', N'Mathematics', N'Algebra Worksheet', N'Complete exercises 1 to 20.', '2026-05-15');
GO

INSERT INTO dbo.attendance (StudentId, AttendanceDate, Status, Remarks)
VALUES (1, CAST(GETDATE() AS DATE), N'Present', N'On time');
GO

INSERT INTO dbo.payments (StudentId, StudentName, Class, Amount, PaymentMode, RazorpayOrderId, RazorpayPaymentId, Status)
VALUES (1, N'Aarav Sharma', N'10-A', 5000, N'UPI', N'order_demo_001', N'pay_demo_001', N'Success');
GO

UPDATE dbo.students
SET PaidFees = CASE WHEN PaidFees + 5000 > TotalFees THEN TotalFees ELSE PaidFees + 5000 END
WHERE StudentId = 1;
GO

INSERT INTO dbo.notices (Title, Body, Audience)
VALUES (N'Parent Teacher Meeting', N'PTM will be held this Saturday at 10 AM.', N'All');
GO

INSERT INTO dbo.contact_enquiries (Name, Email, Phone, Subject, Message)
VALUES (N'Parent Demo', N'parent@example.com', N'9955367376', N'Admission enquiry', N'I want admission details.');
GO

SELECT * FROM dbo.students;
SELECT * FROM dbo.homework;
SELECT * FROM dbo.attendance;
SELECT * FROM dbo.payments;
SELECT * FROM dbo.notices;
SELECT * FROM dbo.contact_enquiries;
GO
