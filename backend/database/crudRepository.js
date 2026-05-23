const { execute, sql } = require('./db');

const tableConfig = {
  Students: { id: 'StudentId', writable: ['AdmissionNo', 'FirstName', 'LastName', 'ClassName', 'Section', 'ParentUserId'] },
  Teachers: { id: 'TeacherId', writable: ['FirstName', 'LastName', 'Email', 'Phone', 'Department', 'Designation'] },
  Notices: { id: 'NoticeId', writable: ['Title', 'Body', 'Audience', 'PublishedAt', 'IsPublished'] },
  Events: { id: 'EventId', writable: ['Title', 'Description', 'EventDate', 'Location', 'IsPublished'] },
  Homework: { id: 'HomeworkId', writable: ['StudentId', 'ClassName', 'Subject', 'Title', 'Description', 'DueDate'] },
  Timetable: { id: 'TimetableId', writable: ['ClassName', 'Section', 'DayOfWeek', 'PeriodNo', 'Subject', 'TeacherName', 'StartTime', 'EndTime'] },
  Admissions: { id: 'AdmissionId', writable: ['StudentName', 'ApplyingClass', 'ParentEmail', 'Phone', 'Message', 'Status'] }
};

function assertTable(tableName) {
  const config = tableConfig[tableName];
  if (!config) throw new Error(`Unsupported table ${tableName}`);
  return config;
}

function toParam(name, value) {
  if (typeof value === 'number') return { name, type: sql.Decimal(18, 2), value };
  if (typeof value === 'boolean') return { name, type: sql.Bit, value };
  if (value instanceof Date) return { name, type: sql.DateTime2, value };
  return { name, type: sql.NVarChar(sql.MAX), value };
}

async function list(tableName) {
  const { id } = assertTable(tableName);
  const result = await execute(`SELECT * FROM dbo.${tableName} ORDER BY ${id} DESC`);
  return result.recordset;
}

async function findById(tableName, idValue) {
  const { id } = assertTable(tableName);
  const result = await execute(`SELECT * FROM dbo.${tableName} WHERE ${id} = @id`, [
    { name: 'id', type: sql.Int, value: Number(idValue) }
  ]);
  return result.recordset[0] || null;
}

async function create(tableName, payload) {
  const config = assertTable(tableName);
  const fields = config.writable.filter((field) => payload[field] !== undefined);
  const columns = fields.join(', ');
  const values = fields.map((field) => `@${field}`).join(', ');
  const params = fields.map((field) => toParam(field, payload[field]));

  const result = await execute(
    `INSERT INTO dbo.${tableName} (${columns}) OUTPUT INSERTED.* VALUES (${values})`,
    params
  );
  return result.recordset[0];
}

async function update(tableName, idValue, payload) {
  const config = assertTable(tableName);
  const fields = config.writable.filter((field) => payload[field] !== undefined);
  const assignments = fields.map((field) => `${field} = @${field}`).join(', ');
  const params = fields.map((field) => toParam(field, payload[field]));
  params.push({ name: 'id', type: sql.Int, value: Number(idValue) });

  const result = await execute(
    `UPDATE dbo.${tableName} SET ${assignments} OUTPUT INSERTED.* WHERE ${config.id} = @id`,
    params
  );
  return result.recordset[0] || null;
}

async function remove(tableName, idValue) {
  const { id } = assertTable(tableName);
  await execute(`DELETE FROM dbo.${tableName} WHERE ${id} = @id`, [
    { name: 'id', type: sql.Int, value: Number(idValue) }
  ]);
  return { deleted: true };
}

module.exports = { list, findById, create, update, remove };
