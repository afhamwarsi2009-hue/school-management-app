const { execute, sql } = require('../database/db');

function mapStudent(row) {
  return {
    id: row.StudentId,
    admission_number: row.AdmissionNumber,
    name: row.Name,
    email: row.Email,
    class: row.Class,
    roll_number: row.RollNumber,
    total_fees: row.TotalFees,
    paid_fees: row.PaidFees,
    remaining_fees: Number(row.TotalFees || 0) - Number(row.PaidFees || 0),
    created_at: row.CreatedAt,
    updated_at: row.UpdatedAt
  };
}

async function findAll() {
  const result = await execute('SELECT * FROM dbo.students ORDER BY StudentId DESC');
  return result.recordset.map(mapStudent);
}

async function findById(studentId) {
  const result = await execute('SELECT * FROM dbo.students WHERE StudentId = @studentId', [
    { name: 'studentId', type: sql.Int, value: Number(studentId) }
  ]);
  return result.recordset[0] ? mapStudent(result.recordset[0]) : null;
}

async function findByPaymentDetails({ studentId, studentName, studentClass }) {
  const result = await execute(
    `SELECT *
     FROM dbo.students
     WHERE StudentId = @studentId`,
    [{ name: 'studentId', type: sql.Int, value: Number(studentId) }]
  );

  const student = result.recordset[0] ? mapStudent(result.recordset[0]) : null;
  if (!student) return { ok: false, reason: 'Invalid Student ID' };

  const normalize = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  if (normalize(student.name) !== normalize(studentName)) {
    return { ok: false, reason: 'Student details do not match' };
  }

  if (studentClass && normalize(student.class) !== normalize(studentClass)) {
    return { ok: false, reason: 'Student details do not match' };
  }

  return { ok: true, student };
}

async function create(payload) {
  const result = await execute(
    `INSERT INTO dbo.students (AdmissionNumber, Name, Email, Class, RollNumber, PasswordHash, TotalFees, PaidFees)
     OUTPUT INSERTED.*
     VALUES (@admissionNumber, @name, @email, @class, @rollNumber, @passwordHash, @totalFees, @paidFees)`,
    [
      { name: 'admissionNumber', type: sql.NVarChar(50), value: payload.admission_number || payload.roll_number },
      { name: 'name', type: sql.NVarChar(120), value: payload.name },
      { name: 'email', type: sql.NVarChar(255), value: payload.email },
      { name: 'class', type: sql.NVarChar(40), value: payload.class },
      { name: 'rollNumber', type: sql.NVarChar(40), value: payload.roll_number },
      { name: 'passwordHash', type: sql.NVarChar(255), value: payload.password_hash || null },
      { name: 'totalFees', type: sql.Decimal(12, 2), value: payload.total_fees },
      { name: 'paidFees', type: sql.Decimal(12, 2), value: payload.paid_fees || 0 }
    ]
  );
  return mapStudent(result.recordset[0]);
}

async function update(studentId, payload) {
  const result = await execute(
    `UPDATE dbo.students
     SET AdmissionNumber = @admissionNumber,
         Name = @name,
         Email = @email,
         Class = @class,
         RollNumber = @rollNumber,
         PasswordHash = COALESCE(@passwordHash, PasswordHash),
         TotalFees = @totalFees,
         PaidFees = @paidFees,
         UpdatedAt = SYSUTCDATETIME()
     OUTPUT INSERTED.*
     WHERE StudentId = @studentId`,
    [
      { name: 'studentId', type: sql.Int, value: Number(studentId) },
      { name: 'admissionNumber', type: sql.NVarChar(50), value: payload.admission_number || payload.roll_number },
      { name: 'name', type: sql.NVarChar(120), value: payload.name },
      { name: 'email', type: sql.NVarChar(255), value: payload.email },
      { name: 'class', type: sql.NVarChar(40), value: payload.class },
      { name: 'rollNumber', type: sql.NVarChar(40), value: payload.roll_number },
      { name: 'passwordHash', type: sql.NVarChar(255), value: payload.password_hash || null },
      { name: 'totalFees', type: sql.Decimal(12, 2), value: payload.total_fees },
      { name: 'paidFees', type: sql.Decimal(12, 2), value: payload.paid_fees || 0 }
    ]
  );
  return result.recordset[0] ? mapStudent(result.recordset[0]) : null;
}

async function remove(studentId) {
  const result = await execute('DELETE FROM dbo.students WHERE StudentId = @studentId', [
    { name: 'studentId', type: sql.Int, value: Number(studentId) }
  ]);
  return result.rowsAffected[0] > 0;
}

module.exports = { findAll, findById, findByPaymentDetails, create, update, remove };
