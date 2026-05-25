const crud = require('../database/crudRepository');
const { execute, sql } = require('../database/db');

async function listAttendance(studentId) {
  const where = studentId ? 'WHERE StudentId = @studentId' : '';
  const params = studentId ? [{ name: 'studentId', type: sql.Int, value: Number(studentId) }] : [];
  const result = await execute(`SELECT * FROM dbo.attendance ${where} ORDER BY AttendanceDate DESC`, params);
  return result.recordset;
}

async function markAttendance(payload) {
  await execute(
    `INSERT INTO dbo.attendance (StudentId, AttendanceDate, Status, Remarks)
     VALUES (@StudentId, @AttendanceDate, @Status, @Remarks)
     ON DUPLICATE KEY UPDATE Status = VALUES(Status), Remarks = VALUES(Remarks)`,
    [
      { name: 'StudentId', type: sql.Int, value: payload.StudentId },
      { name: 'AttendanceDate', type: sql.Date, value: payload.AttendanceDate },
      { name: 'Status', type: sql.NVarChar(20), value: payload.Status },
      { name: 'Remarks', type: sql.NVarChar(500), value: payload.Remarks || null }
    ]
  );
  const result = await execute(
    `SELECT * FROM dbo.attendance WHERE StudentId = @StudentId AND AttendanceDate = @AttendanceDate`,
    [
      { name: 'StudentId', type: sql.Int, value: payload.StudentId },
      { name: 'AttendanceDate', type: sql.Date, value: payload.AttendanceDate }
    ]
  );
  return result.recordset[0];
}

async function listResults(studentId) {
  const where = studentId ? 'WHERE r.StudentId = @studentId' : '';
  const params = studentId ? [{ name: 'studentId', type: sql.Int, value: Number(studentId) }] : [];
  const result = await execute(
    `SELECT r.*, s.Name AS StudentName
     FROM dbo.results r
     INNER JOIN dbo.students s ON s.StudentId = r.StudentId
     ${where}
     ORDER BY r.ResultId DESC`,
    params
  );
  return result.recordset;
}

async function createResult(payload) {
  const studentId = payload.student_id || payload.StudentId;
  const examName = payload.exam_name || payload.ExamName;
  const marksObtained = payload.marks_obtained ?? payload.MarksObtained;
  const maxMarks = payload.max_marks ?? payload.MaxMarks;
  const result = await execute(
    `INSERT INTO dbo.results (StudentId, ExamName, Subject, MarksObtained, MaxMarks, Grade)
     OUTPUT INSERTED.*
     VALUES (@StudentId, @ExamName, @Subject, @MarksObtained, @MaxMarks, @Grade)`,
    [
      { name: 'StudentId', type: sql.Int, value: studentId },
      { name: 'ExamName', type: sql.NVarChar(120), value: examName },
      { name: 'Subject', type: sql.NVarChar(120), value: payload.subject || payload.Subject },
      { name: 'MarksObtained', type: sql.Decimal(6, 2), value: marksObtained },
      { name: 'MaxMarks', type: sql.Decimal(6, 2), value: maxMarks },
      { name: 'Grade', type: sql.NVarChar(10), value: payload.grade || payload.Grade || null }
    ]
  );
  return result.recordset[0];
}

module.exports = {
  listAttendance,
  markAttendance,
  listResults,
  createResult,
  listHomework: () => crud.list('Homework'),
  createHomework: (payload) => crud.create('Homework', payload),
  updateHomework: (id, payload) => crud.update('Homework', id, payload),
  deleteHomework: (id) => crud.remove('Homework', id),
  listTimetable: () => crud.list('Timetable'),
  createTimetable: (payload) => crud.create('Timetable', payload),
  updateTimetable: (id, payload) => crud.update('Timetable', id, payload),
  deleteTimetable: (id) => crud.remove('Timetable', id)
};
