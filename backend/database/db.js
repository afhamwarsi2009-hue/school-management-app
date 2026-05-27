const { getPool, sql } = require('../config/database');

function normalizeParams(params = []) {
  const values = {};
  params.forEach((param) => {
    values[param.name] = param.value;
  });
  return values;
}

function convertSql(queryText, params = []) {
  const valuesByName = normalizeParams(params);
  const values = [];
  let text = queryText
    .replace(/\bdbo\./gi, '')
    .replace(/SYSUTCDATETIME\(\)/gi, 'UTC_TIMESTAMP()')
    .replace(/SYSDATETIME\(\)/gi, 'UTC_TIMESTAMP()')
    .replace(/DB_NAME\(\)/gi, 'DATABASE()')
    .replace(/@@SERVERNAME/gi, '@@hostname')
    .replace(/CAST\('([^']*)'\s+AS\s+NVARCHAR\(\d+\)\)/gi, "'$1'")
    .replace(/SELECT\s+TOP\s+(\d+)/gi, 'SELECT');

  const topMatch = queryText.match(/SELECT\s+TOP\s+(\d+)/i);
  if (topMatch && !/\bLIMIT\s+\d+/i.test(text)) {
    text = `${text.trim().replace(/;$/, '')} LIMIT ${topMatch[1]}`;
  }

  text = text.replace(/(?<!@)@([A-Za-z_][A-Za-z0-9_]*)/g, (match, name) => {
    values.push(valuesByName[name]);
    return '?';
  });

  return { text, values };
}

function extractOutputSelect(originalSql, changedSql, params, result) {
  const outputMatch = originalSql.match(/\bOUTPUT\s+([\s\S]*?)\s+(VALUES|WHERE)\b/i);
  if (!outputMatch) return null;

  const tableMatch = originalSql.match(/\b(?:INSERT\s+INTO|UPDATE)\s+(?:dbo\.)?([A-Za-z_][A-Za-z0-9_]*)/i);
  if (!tableMatch) return null;

  const table = tableMatch[1];
  const insertedColumns = originalSql.match(/\bOUTPUT\s+INSERTED\.\*/i)
    ? '*'
    : outputMatch[1]
      .replace(/INSERTED\./gi, '')
      .replace(/CAST\('([^']*)'\s+AS\s+NVARCHAR\(\d+\)\)\s+AS\s+([A-Za-z_][A-Za-z0-9_]*)/gi, "'$1' AS $2");

  if (/^\s*INSERT\b/i.test(originalSql)) {
    return { query: `SELECT ${insertedColumns} FROM ${table} WHERE ${primaryKeyFor(table)} = @insertId`, params: [{ name: 'insertId', value: result.insertId }] };
  }

  const whereMatch = originalSql.match(/\bWHERE\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*@([A-Za-z_][A-Za-z0-9_]*)/i);
  if (!whereMatch) return null;
  const param = params.find((item) => item.name === whereMatch[2]);
  return { query: `SELECT ${insertedColumns} FROM ${table} WHERE ${whereMatch[1]} = @${whereMatch[2]}`, params: param ? [param] : [] };
}

function primaryKeyFor(table) {
  const keys = {
    students: 'StudentId',
    admins: 'AdminId',
    contact_enquiries: 'EnquiryId',
    fees: 'FeeId',
    payments: 'PaymentId',
    attendance: 'AttendanceId',
    homework: 'HomeworkId',
    results: 'ResultId',
    notices: 'NoticeId',
    admissions: 'AdmissionId',
    events: 'EventId',
    teachers: 'TeacherId',
    timetable: 'TimetableId'
  };
  return keys[table] || keys[table.toLowerCase()] || 'id';
}

function stripOutput(queryText) {
  return queryText.replace(/\s+OUTPUT\s+[\s\S]*?\s+(VALUES|WHERE)\b/i, ' $1');
}

async function execute(queryText, params = [], connection = null) {
  const pool = connection || await getPool();
  const outputQuery = /\bOUTPUT\s+INSERTED\./i.test(queryText);
  const runnableSql = outputQuery ? stripOutput(queryText) : queryText;
  const { text, values } = convertSql(runnableSql, params);
  const [rows] = await pool.execute(text, values);

  if (Array.isArray(rows)) {
    return { recordset: rows, rowsAffected: [rows.length] };
  }

  if (outputQuery) {
    const select = extractOutputSelect(queryText, runnableSql, params, rows);
    if (select) return execute(select.query, select.params, connection);
  }

  return {
    recordset: [],
    rowsAffected: [rows.affectedRows || 0],
    insertId: rows.insertId
  };
}

async function query(queryText, params = []) {
  const result = await execute(queryText, params);
  return result.recordset;
}

async function transaction(work) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await work({
      request(params = []) {
        return {
          query(queryText) {
            return execute(queryText, params, connection);
          }
        };
      }
    });
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { execute, query, transaction, sql, convertSql };
