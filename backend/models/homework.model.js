const { execute, sql } = require('../database/db');

function mapHomework(row) {
  return {
    id: row.HomeworkId,
    student_id: row.StudentId,
    class: row.Class,
    subject: row.Subject,
    title: row.Title,
    description: row.Description,
    due_date: row.DueDate,
    created_at: row.CreatedAt
  };
}

async function findAll() {
  const result = await execute('SELECT * FROM dbo.homework ORDER BY DueDate DESC, HomeworkId DESC');
  return result.recordset.map(mapHomework);
}

async function create(payload) {
  const result = await execute(
    `INSERT INTO dbo.homework (StudentId, Class, Subject, Title, Description, DueDate)
     OUTPUT INSERTED.*
     VALUES (@studentId, @class, @subject, @title, @description, @dueDate)`,
    [
      { name: 'studentId', type: sql.Int, value: payload.student_id || null },
      { name: 'class', type: sql.NVarChar(40), value: payload.class },
      { name: 'subject', type: sql.NVarChar(80), value: payload.subject },
      { name: 'title', type: sql.NVarChar(160), value: payload.title },
      { name: 'description', type: sql.NVarChar(sql.MAX), value: payload.description || null },
      { name: 'dueDate', type: sql.Date, value: payload.due_date }
    ]
  );
  return mapHomework(result.recordset[0]);
}

async function update(homeworkId, payload) {
  const result = await execute(
    `UPDATE dbo.homework
     SET StudentId = @studentId,
         Class = @class,
         Subject = @subject,
         Title = @title,
         Description = @description,
         DueDate = @dueDate
     OUTPUT INSERTED.*
     WHERE HomeworkId = @homeworkId`,
    [
      { name: 'homeworkId', type: sql.Int, value: Number(homeworkId) },
      { name: 'studentId', type: sql.Int, value: payload.student_id || null },
      { name: 'class', type: sql.NVarChar(40), value: payload.class },
      { name: 'subject', type: sql.NVarChar(80), value: payload.subject },
      { name: 'title', type: sql.NVarChar(160), value: payload.title },
      { name: 'description', type: sql.NVarChar(sql.MAX), value: payload.description || null },
      { name: 'dueDate', type: sql.Date, value: payload.due_date }
    ]
  );
  return result.recordset[0] ? mapHomework(result.recordset[0]) : null;
}

async function remove(homeworkId) {
  const result = await execute('DELETE FROM dbo.homework WHERE HomeworkId = @homeworkId', [
    { name: 'homeworkId', type: sql.Int, value: Number(homeworkId) }
  ]);
  return result.rowsAffected[0] > 0;
}

module.exports = { findAll, create, update, remove };
