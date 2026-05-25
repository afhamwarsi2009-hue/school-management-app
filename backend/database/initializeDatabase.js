const bcrypt = require('bcryptjs');
const { createPool, closePool } = require('../config/database');
const { execute, sql } = require('./db');

const DEFAULT_ADMIN = {
  name: process.env.ADMIN_NAME || 'GPS Admin',
  email: process.env.ADMIN_EMAIL || 'gurugarampublic.co.in@outlook.com',
  password: process.env.ADMIN_PASSWORD || '12345678'
};

async function ensureDatabaseExists() {
  const pool = await createPool(null);
  try {
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE || 'school_management'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    await pool.end();
  }
}

async function createTables() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS students (
      StudentId INT AUTO_INCREMENT PRIMARY KEY,
      AdmissionNumber VARCHAR(50) NOT NULL UNIQUE,
      Name VARCHAR(120) NOT NULL,
      Email VARCHAR(255) NOT NULL UNIQUE,
      Class VARCHAR(40) NOT NULL,
      RollNumber VARCHAR(40) NOT NULL UNIQUE,
      PasswordHash VARCHAR(255) NULL,
      TotalFees DECIMAL(12,2) NOT NULL DEFAULT 0,
      PaidFees DECIMAL(12,2) NOT NULL DEFAULT 0,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS admins (
      AdminId INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(120) NOT NULL,
      Email VARCHAR(255) NOT NULL UNIQUE,
      PasswordHash VARCHAR(255) NOT NULL,
      IsActive TINYINT(1) NOT NULL DEFAULT 1,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS contact_enquiries (
      EnquiryId INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(160) NOT NULL,
      Email VARCHAR(255) NOT NULL,
      Phone VARCHAR(30) NULL,
      Subject VARCHAR(160) NOT NULL,
      Message TEXT NOT NULL,
      Status VARCHAR(30) NOT NULL DEFAULT 'New',
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS fees (
      FeeId INT AUTO_INCREMENT PRIMARY KEY,
      StudentId INT NOT NULL,
      FeeType VARCHAR(80) NOT NULL DEFAULT 'Tuition',
      Amount DECIMAL(12,2) NOT NULL,
      DueDate DATE NULL,
      Status VARCHAR(30) NOT NULL DEFAULT 'Pending',
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT FK_fees_students FOREIGN KEY (StudentId) REFERENCES students(StudentId) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS payments (
      PaymentId INT AUTO_INCREMENT PRIMARY KEY,
      StudentId INT NOT NULL,
      StudentName VARCHAR(120) NULL,
      Class VARCHAR(40) NULL,
      Amount DECIMAL(12,2) NOT NULL,
      PaymentMode VARCHAR(40) NULL,
      RazorpayOrderId VARCHAR(120) NULL,
      RazorpayPaymentId VARCHAR(120) NULL,
      Status VARCHAR(30) NOT NULL DEFAULT 'Success',
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY UX_payments_RazorpayPaymentId (RazorpayPaymentId),
      CONSTRAINT FK_payments_students FOREIGN KEY (StudentId) REFERENCES students(StudentId) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS attendance (
      AttendanceId INT AUTO_INCREMENT PRIMARY KEY,
      StudentId INT NOT NULL,
      AttendanceDate DATE NOT NULL,
      Status VARCHAR(20) NOT NULL,
      Remarks VARCHAR(255) NULL,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY UQ_attendance_StudentDate (StudentId, AttendanceDate),
      CONSTRAINT FK_attendance_students FOREIGN KEY (StudentId) REFERENCES students(StudentId) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS homework (
      HomeworkId INT AUTO_INCREMENT PRIMARY KEY,
      StudentId INT NULL,
      Class VARCHAR(40) NOT NULL,
      Subject VARCHAR(80) NOT NULL,
      Title VARCHAR(160) NOT NULL,
      Description TEXT NULL,
      DueDate DATE NOT NULL,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT FK_homework_students FOREIGN KEY (StudentId) REFERENCES students(StudentId) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS results (
      ResultId INT AUTO_INCREMENT PRIMARY KEY,
      StudentId INT NOT NULL,
      ExamName VARCHAR(120) NOT NULL,
      Subject VARCHAR(120) NOT NULL,
      MarksObtained DECIMAL(6,2) NOT NULL,
      MaxMarks DECIMAL(6,2) NOT NULL,
      Grade VARCHAR(10) NULL,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT FK_results_students FOREIGN KEY (StudentId) REFERENCES students(StudentId) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS notices (
      NoticeId INT AUTO_INCREMENT PRIMARY KEY,
      Title VARCHAR(160) NOT NULL,
      Body TEXT NOT NULL,
      Audience VARCHAR(40) NOT NULL DEFAULT 'All',
      IsPublished TINYINT(1) NOT NULL DEFAULT 1,
      PublishedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS admissions (
      AdmissionId INT AUTO_INCREMENT PRIMARY KEY,
      StudentName VARCHAR(160) NOT NULL,
      ApplyingClass VARCHAR(50) NOT NULL,
      ParentEmail VARCHAR(255) NOT NULL,
      Phone VARCHAR(30) NOT NULL,
      Message TEXT NULL,
      Status VARCHAR(30) NOT NULL DEFAULT 'Submitted',
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      EventId INT AUTO_INCREMENT PRIMARY KEY,
      Title VARCHAR(160) NOT NULL,
      Description TEXT NULL,
      EventDate DATE NOT NULL,
      Location VARCHAR(160) NULL,
      IsPublished TINYINT(1) NOT NULL DEFAULT 1,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS teachers (
      TeacherId INT AUTO_INCREMENT PRIMARY KEY,
      FirstName VARCHAR(80) NOT NULL,
      LastName VARCHAR(80) NOT NULL,
      Email VARCHAR(255) NULL,
      Phone VARCHAR(30) NULL,
      Department VARCHAR(80) NULL,
      Designation VARCHAR(80) NULL,
      CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS timetable (
      TimetableId INT AUTO_INCREMENT PRIMARY KEY,
      ClassName VARCHAR(40) NOT NULL,
      Section VARCHAR(20) NULL,
      DayOfWeek VARCHAR(20) NOT NULL,
      PeriodNo INT NOT NULL,
      Subject VARCHAR(80) NOT NULL,
      TeacherName VARCHAR(160) NULL,
      StartTime TIME NULL,
      EndTime TIME NULL
    )`
  ];

  for (const statement of statements) {
    await execute(statement);
  }
}

async function seedDefaultAdminIfEmpty() {
  const existingAdmins = await execute('SELECT COUNT(1) AS adminCount FROM admins');
  if (existingAdmins.recordset[0].adminCount > 0) return;

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
  await execute(
    `INSERT INTO admins (Name, Email, PasswordHash, IsActive)
     VALUES (@name, @email, @passwordHash, 1)`,
    [
      { name: 'name', type: sql.NVarChar(120), value: DEFAULT_ADMIN.name },
      { name: 'email', type: sql.NVarChar(255), value: DEFAULT_ADMIN.email },
      { name: 'passwordHash', type: sql.NVarChar(255), value: passwordHash }
    ]
  );
}

async function testDatabaseConnection() {
  const result = await execute('SELECT DATABASE() AS databaseName, @@hostname AS serverName, UTC_TIMESTAMP() AS serverTime');
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
