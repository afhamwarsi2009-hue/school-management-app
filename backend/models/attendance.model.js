const { execute, sql } = require('../database/db');

function mapAttendance(row) {
  return {
    id: row.AttendanceId,
    student_id: row.StudentId,
    attendance_date: row.AttendanceDate,
    status: row.Status,
    remarks: row.Remarks,
    created_at: row.CreatedAt
  };
}

async function findAll() {
  const result = await execute('SELECT * FROM dbo.attendance ORDER BY AttendanceDate DESC, AttendanceId DESC');
  return result.recordset.map(mapAttendance);
}

async function create(payload) {
  const result = await execute(
    `INSERT INTO dbo.attendance (StudentId, AttendanceDate, Status, Remarks)
     OUTPUT INSERTED.*
     VALUES (@studentId, @attendanceDate, @status, @remarks)`,
    [
      { name: 'studentId', type: sql.Int, value: payload.student_id },
      { name: 'attendanceDate', type: sql.Date, value: payload.attendance_date },
      { name: 'status', type: sql.NVarChar(20), value: payload.status },
      { name: 'remarks', type: sql.NVarChar(255), value: payload.remarks || null }
    ]
  );
  return mapAttendance(result.recordset[0]);
}

async function update(attendanceId, payload) {
  const result = await execute(
    `UPDATE dbo.attendance
     SET StudentId = @studentId,
         AttendanceDate = @attendanceDate,
         Status = @status,
         Remarks = @remarks
     OUTPUT INSERTED.*
     WHERE AttendanceId = @attendanceId`,
    [
      { name: 'attendanceId', type: sql.Int, value: Number(attendanceId) },
      { name: 'studentId', type: sql.Int, value: payload.student_id },
      { name: 'attendanceDate', type: sql.Date, value: payload.attendance_date },
      { name: 'status', type: sql.NVarChar(20), value: payload.status },
      { name: 'remarks', type: sql.NVarChar(255), value: payload.remarks || null }
    ]
  );
  return result.recordset[0] ? mapAttendance(result.recordset[0]) : null;
}

async function remove(attendanceId) {
  const result = await execute('DELETE FROM dbo.attendance WHERE AttendanceId = @attendanceId', [
    { name: 'attendanceId', type: sql.Int, value: Number(attendanceId) }
  ]);
  return result.rowsAffected[0] > 0;
}

module.exports = { findAll, create, update, remove };
