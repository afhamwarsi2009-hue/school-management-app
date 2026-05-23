const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { execute, sql } = require('../database/db');
const { httpError } = require('../utils/httpError');

function publicUser(user) {
  return {
    id: user.UserId || user.AdminId || user.StudentId,
    name: user.Name || null,
    email: user.Email,
    role: user.Role,
    studentId: user.StudentId || null,
    admission_number: user.AdmissionNumber || null
  };
}

function publicStudent(user) {
  if (user.Role !== 'student') return null;
  return {
    id: user.StudentId,
    admission_number: user.AdmissionNumber,
    name: user.Name,
    email: user.Email,
    class: user.Class,
    roll_number: user.RollNumber,
    total_fees: user.TotalFees,
    paid_fees: user.PaidFees,
    remaining_fees: Number(user.TotalFees || 0) - Number(user.PaidFees || 0)
  };
}

function issueToken(user) {
  const safeUser = publicUser(user);
  return {
    token: jwt.sign(safeUser, env.jwtSecret, { expiresIn: env.jwtExpiresIn }),
    user: safeUser
  };
}

async function login({ email, admission_number, admissionNumber, password, role }) {
  const normalizedEmail = email ? email.trim().toLowerCase() : '';
  const identifier = (admission_number || admissionNumber || '').trim();
  const result = role === 'student'
    ? await execute(
      `SELECT TOP 1
         StudentId AS UserId,
         StudentId,
         Name,
         Email,
         AdmissionNumber,
         Class,
         RollNumber,
         TotalFees,
         PaidFees,
         PasswordHash,
         CAST('student' AS NVARCHAR(30)) AS Role
       FROM dbo.students
       WHERE AdmissionNumber = @identifier OR Email = @email`,
      [
        { name: 'identifier', type: sql.NVarChar(50), value: identifier },
        { name: 'email', type: sql.NVarChar(255), value: normalizedEmail }
      ]
    )
    : await execute(
      `SELECT TOP 1
         AdminId AS UserId,
         AdminId,
         Name,
         Email,
         PasswordHash,
         CAST('admin' AS NVARCHAR(30)) AS Role
       FROM dbo.admins
       WHERE LOWER(Email) = @email AND IsActive = 1`,
      [{ name: 'email', type: sql.NVarChar(255), value: normalizedEmail }]
    );

  const user = result.recordset[0];
  if (!user || !user.PasswordHash) throw httpError(401, 'Invalid credentials');

  const validPassword = await bcrypt.compare(password, user.PasswordHash);
  if (!validPassword) throw httpError(401, 'Invalid credentials');

  const response = issueToken(user);
  if (role === 'student') response.student = publicStudent(user);
  if (role === 'admin') response.admin = response.user;
  return response;
}

async function registerStudent(payload) {
  const admissionNumber = payload.admission_number;
  const duplicate = await execute(
    `SELECT TOP 1 AdmissionNumber, Email, RollNumber
     FROM dbo.students
     WHERE AdmissionNumber = @admissionNumber
        OR Email = @email
        OR RollNumber = @rollNumber`,
    [
      { name: 'admissionNumber', type: sql.NVarChar(50), value: admissionNumber },
      { name: 'email', type: sql.NVarChar(255), value: payload.email },
      { name: 'rollNumber', type: sql.NVarChar(40), value: payload.roll_number }
    ]
  );

  const existing = duplicate.recordset[0];
  if (existing?.AdmissionNumber?.toLowerCase() === admissionNumber.toLowerCase()) {
    throw httpError(409, 'Admission number already registered');
  }
  if (existing?.Email?.toLowerCase() === payload.email.toLowerCase()) {
    throw httpError(409, 'Email already registered');
  }
  if (existing?.RollNumber?.toLowerCase() === payload.roll_number.toLowerCase()) {
    throw httpError(409, 'Roll number already registered');
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const result = await execute(
    `INSERT INTO dbo.students (AdmissionNumber, Name, Email, Class, RollNumber, PasswordHash, TotalFees, PaidFees)
     OUTPUT
       INSERTED.StudentId AS UserId,
       INSERTED.StudentId,
       INSERTED.Name,
       INSERTED.Email,
       INSERTED.AdmissionNumber,
       INSERTED.Class,
       INSERTED.RollNumber,
       INSERTED.TotalFees,
       INSERTED.PaidFees,
       CAST('student' AS NVARCHAR(30)) AS Role
     VALUES (@admissionNumber, @name, @email, @class, @rollNumber, @passwordHash, @totalFees, @paidFees)`,
    [
      { name: 'admissionNumber', type: sql.NVarChar(50), value: admissionNumber },
      { name: 'name', type: sql.NVarChar(120), value: payload.name },
      { name: 'email', type: sql.NVarChar(255), value: payload.email },
      { name: 'class', type: sql.NVarChar(40), value: payload.class },
      { name: 'rollNumber', type: sql.NVarChar(40), value: payload.roll_number },
      { name: 'passwordHash', type: sql.NVarChar(255), value: passwordHash },
      { name: 'totalFees', type: sql.Decimal(12, 2), value: payload.total_fees || 0 },
      { name: 'paidFees', type: sql.Decimal(12, 2), value: payload.paid_fees || 0 }
    ]
  );

  const user = result.recordset[0];
  return {
    message: 'Student registered successfully',
    ...issueToken(user),
    student: publicStudent(user)
  };
}

async function createUser({ email, password, role, studentId = null }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = role === 'admin'
    ? await execute(
      `INSERT INTO dbo.admins (Name, Email, PasswordHash)
       OUTPUT INSERTED.AdminId AS UserId, INSERTED.AdminId, INSERTED.Name, INSERTED.Email, CAST('admin' AS NVARCHAR(30)) AS Role
       VALUES (@name, @email, @passwordHash)`,
      [
        { name: 'name', type: sql.NVarChar(120), value: email.split('@')[0] },
        { name: 'email', type: sql.NVarChar(255), value: email },
        { name: 'passwordHash', type: sql.NVarChar(255), value: passwordHash }
      ]
    )
    : await execute(
      `UPDATE dbo.students
       SET PasswordHash = @passwordHash,
           UpdatedAt = SYSUTCDATETIME()
       OUTPUT INSERTED.StudentId AS UserId, INSERTED.StudentId, INSERTED.Name, INSERTED.Email, INSERTED.AdmissionNumber, CAST('student' AS NVARCHAR(30)) AS Role
       WHERE StudentId = @studentId`,
      [
        { name: 'passwordHash', type: sql.NVarChar(255), value: passwordHash },
        { name: 'studentId', type: sql.Int, value: studentId || null }
      ]
    );

  return publicUser(result.recordset[0]);
}

module.exports = { login, registerStudent, createUser };
