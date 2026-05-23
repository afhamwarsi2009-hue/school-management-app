IF DB_ID(N'school_management') IS NULL
BEGIN
  CREATE DATABASE school_management;
END;
GO

USE school_management;
GO

IF OBJECT_ID('dbo.students', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.students (
    StudentId INT IDENTITY(1,1) PRIMARY KEY,
    AdmissionNumber NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(120) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Class NVARCHAR(40) NOT NULL,
    RollNumber NVARCHAR(40) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NULL,
    TotalFees DECIMAL(12,2) NOT NULL DEFAULT 0,
    PaidFees DECIMAL(12,2) NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO

IF COL_LENGTH('dbo.students', 'AdmissionNumber') IS NULL
BEGIN
  ALTER TABLE dbo.students ADD AdmissionNumber NVARCHAR(50) NULL;
  EXEC('UPDATE dbo.students SET AdmissionNumber = RollNumber WHERE AdmissionNumber IS NULL');
  ALTER TABLE dbo.students ALTER COLUMN AdmissionNumber NVARCHAR(50) NOT NULL;
END;
GO

IF COL_LENGTH('dbo.students', 'PasswordHash') IS NULL
BEGIN
  ALTER TABLE dbo.students ADD PasswordHash NVARCHAR(255) NULL;
END;
GO

IF OBJECT_ID('dbo.admins', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.admins (
    AdminId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(120) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO

IF OBJECT_ID('dbo.contact_enquiries', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.contact_enquiries (
    EnquiryId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(160) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(30) NULL,
    Subject NVARCHAR(160) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'New',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO

IF OBJECT_ID('dbo.fees', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.fees (
    FeeId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    FeeType NVARCHAR(80) NOT NULL DEFAULT 'Tuition',
    Amount DECIMAL(12,2) NOT NULL,
    DueDate DATE NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_fees_students FOREIGN KEY (StudentId) REFERENCES dbo.students(StudentId) ON DELETE CASCADE
  );
END;
GO

IF OBJECT_ID('dbo.payments', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.payments (
    PaymentId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    StudentName NVARCHAR(120) NULL,
    Class NVARCHAR(40) NULL,
    Amount DECIMAL(12,2) NOT NULL,
    PaymentMode NVARCHAR(40) NULL,
    RazorpayOrderId NVARCHAR(120) NULL,
    RazorpayPaymentId NVARCHAR(120) NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Success',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_payments_students FOREIGN KEY (StudentId) REFERENCES dbo.students(StudentId) ON DELETE CASCADE
  );
END;
GO

IF COL_LENGTH('dbo.payments', 'StudentName') IS NULL
BEGIN
  ALTER TABLE dbo.payments ADD StudentName NVARCHAR(120) NULL;
END;
GO

IF COL_LENGTH('dbo.payments', 'Class') IS NULL
BEGIN
  ALTER TABLE dbo.payments ADD Class NVARCHAR(40) NULL;
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_payments_RazorpayPaymentId' AND object_id = OBJECT_ID('dbo.payments'))
BEGIN
  CREATE UNIQUE INDEX UX_payments_RazorpayPaymentId
  ON dbo.payments (RazorpayPaymentId)
  WHERE RazorpayPaymentId IS NOT NULL;
END;
GO

IF OBJECT_ID('dbo.attendance', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.attendance (
    AttendanceId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    AttendanceDate DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Present', 'Absent', 'Late', 'Leave')),
    Remarks NVARCHAR(255) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_attendance_students FOREIGN KEY (StudentId) REFERENCES dbo.students(StudentId) ON DELETE CASCADE,
    CONSTRAINT UQ_attendance_StudentDate UNIQUE (StudentId, AttendanceDate)
  );
END;
GO

IF OBJECT_ID('dbo.homework', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.homework (
    HomeworkId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NULL,
    Class NVARCHAR(40) NOT NULL,
    Subject NVARCHAR(80) NOT NULL,
    Title NVARCHAR(160) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    DueDate DATE NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_homework_students FOREIGN KEY (StudentId) REFERENCES dbo.students(StudentId) ON DELETE SET NULL
  );
END;
GO

IF OBJECT_ID('dbo.results', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.results (
    ResultId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    ExamName NVARCHAR(120) NOT NULL,
    Subject NVARCHAR(120) NOT NULL,
    MarksObtained DECIMAL(6,2) NOT NULL,
    MaxMarks DECIMAL(6,2) NOT NULL,
    Grade NVARCHAR(10) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_results_students FOREIGN KEY (StudentId) REFERENCES dbo.students(StudentId) ON DELETE CASCADE
  );
END;
GO

IF OBJECT_ID('dbo.notices', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.notices (
    NoticeId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(160) NOT NULL,
    Body NVARCHAR(MAX) NOT NULL,
    Audience NVARCHAR(40) NOT NULL DEFAULT 'All',
    IsPublished BIT NOT NULL DEFAULT 1,
    PublishedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO

IF OBJECT_ID('dbo.admissions', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.admissions (
    AdmissionId INT IDENTITY(1,1) PRIMARY KEY,
    StudentName NVARCHAR(160) NOT NULL,
    ApplyingClass NVARCHAR(50) NOT NULL,
    ParentEmail NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(30) NOT NULL,
    Message NVARCHAR(2000) NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Submitted',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO

IF OBJECT_ID('dbo.events', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.events (
    EventId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(160) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    EventDate DATE NOT NULL,
    Location NVARCHAR(160) NULL,
    IsPublished BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO
