const { env } = require('../config/env');
const { createPool, closePool } = require('../config/database');
const bcrypt = require('bcryptjs');
const { execute, sql } = require('./db');

const DEFAULT_ADMIN = {
  name: 'GPS Admin',
  email: 'gurugarampublic.co.in@outlook.com',
  password: '12345678'
};

function safeDatabaseName(databaseName) {
  return databaseName.replace(/]/g, ']]');
}

async function ensureDatabaseExists() {
  const masterPool = await createPool('master');
  try {
    const databaseName = safeDatabaseName(env.db.database);
    await masterPool.request()
      .input('databaseName', env.db.database)
      .query(`
        IF DB_ID(@databaseName) IS NULL
        BEGIN
          EXEC('CREATE DATABASE [${databaseName}]');
        END
      `);
  } finally {
    await masterPool.close();
  }
}

async function createTables() {
  await execute(`
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

    IF COL_LENGTH('dbo.students', 'AdmissionNumber') IS NULL
    BEGIN
      ALTER TABLE dbo.students ADD AdmissionNumber NVARCHAR(50) NULL;
      EXEC('UPDATE dbo.students SET AdmissionNumber = RollNumber WHERE AdmissionNumber IS NULL');
      ALTER TABLE dbo.students ALTER COLUMN AdmissionNumber NVARCHAR(50) NOT NULL;
    END;

    IF COL_LENGTH('dbo.students', 'PasswordHash') IS NULL
    BEGIN
      ALTER TABLE dbo.students ADD PasswordHash NVARCHAR(255) NULL;
    END;

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_students_AdmissionNumber' AND object_id = OBJECT_ID('dbo.students'))
    BEGIN
      CREATE UNIQUE INDEX UQ_students_AdmissionNumber ON dbo.students (AdmissionNumber);
    END;

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

    IF COL_LENGTH('dbo.admins', 'Name') IS NULL
    BEGIN
      ALTER TABLE dbo.admins ADD Name NVARCHAR(120) NOT NULL CONSTRAINT DF_admins_Name DEFAULT 'Admin';
    END;

    IF COL_LENGTH('dbo.admins', 'Email') IS NULL
    BEGIN
      ALTER TABLE dbo.admins ADD Email NVARCHAR(255) NULL;
    END;

    IF COL_LENGTH('dbo.admins', 'PasswordHash') IS NULL
    BEGIN
      ALTER TABLE dbo.admins ADD PasswordHash NVARCHAR(255) NULL;
    END;

    IF COL_LENGTH('dbo.admins', 'IsActive') IS NULL
    BEGIN
      ALTER TABLE dbo.admins ADD IsActive BIT NOT NULL CONSTRAINT DF_admins_IsActive DEFAULT 1;
    END;

    IF COL_LENGTH('dbo.admins', 'CreatedAt') IS NULL
    BEGIN
      ALTER TABLE dbo.admins ADD CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_admins_CreatedAt DEFAULT SYSUTCDATETIME();
    END;

    IF COL_LENGTH('dbo.admins', 'UpdatedAt') IS NULL
    BEGIN
      ALTER TABLE dbo.admins ADD UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_admins_UpdatedAt DEFAULT SYSUTCDATETIME();
    END;

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_admins_Email' AND object_id = OBJECT_ID('dbo.admins'))
    BEGIN
      CREATE UNIQUE INDEX UQ_admins_Email ON dbo.admins (Email) WHERE Email IS NOT NULL;
    END;

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

    IF OBJECT_ID('dbo.ContactEnquiries', 'U') IS NOT NULL
    BEGIN
      INSERT INTO dbo.contact_enquiries (Name, Email, Phone, Subject, Message, Status, CreatedAt)
      SELECT old.Name, old.Email, old.Phone, old.Subject, old.Message, old.Status, old.CreatedAt
      FROM dbo.ContactEnquiries old
      WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.contact_enquiries next
        WHERE next.Email = old.Email
          AND next.Subject = old.Subject
          AND next.Message = old.Message
          AND next.CreatedAt = old.CreatedAt
      );
    END;

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

    IF COL_LENGTH('dbo.payments', 'StudentName') IS NULL
    BEGIN
      ALTER TABLE dbo.payments ADD StudentName NVARCHAR(120) NULL;
    END;

    IF COL_LENGTH('dbo.payments', 'Class') IS NULL
    BEGIN
      ALTER TABLE dbo.payments ADD Class NVARCHAR(40) NULL;
    END;

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_payments_RazorpayPaymentId' AND object_id = OBJECT_ID('dbo.payments'))
    BEGIN
      CREATE UNIQUE INDEX UX_payments_RazorpayPaymentId
      ON dbo.payments (RazorpayPaymentId)
      WHERE RazorpayPaymentId IS NOT NULL;
    END;

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
  `);
}

async function seedDefaultAdminIfEmpty() {
  const existingAdmins = await execute('SELECT COUNT(1) AS adminCount FROM dbo.admins');
  if (existingAdmins.recordset[0].adminCount > 0) return;

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
  await execute(
    `INSERT INTO dbo.admins (Name, Email, PasswordHash, IsActive)
     VALUES (@name, @email, @passwordHash, 1)`,
    [
      { name: 'name', type: sql.NVarChar(120), value: DEFAULT_ADMIN.name },
      { name: 'email', type: sql.NVarChar(255), value: DEFAULT_ADMIN.email },
      { name: 'passwordHash', type: sql.NVarChar(255), value: passwordHash }
    ]
  );
}

async function testDatabaseConnection() {
  const result = await execute('SELECT DB_NAME() AS databaseName, @@SERVERNAME AS serverName, SYSDATETIME() AS serverTime');
  return result.recordset[0];
}

async function initializeDatabase() {
  await closePool();
  await ensureDatabaseExists();
  await createTables();
  await seedDefaultAdminIfEmpty();
  return testDatabaseConnection();
}

module.exports = { initializeDatabase, testDatabaseConnection };

