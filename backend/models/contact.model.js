const { execute, sql } = require('../database/db');

function mapContact(row) {
  return {
    id: row.EnquiryId,
    name: row.Name,
    email: row.Email,
    phone: row.Phone,
    subject: row.Subject,
    message: row.Message,
    status: row.Status,
    created_at: row.CreatedAt
  };
}

async function findAll() {
  const result = await execute('SELECT * FROM dbo.contact_enquiries ORDER BY CreatedAt DESC, EnquiryId DESC');
  return result.recordset.map(mapContact);
}

async function create(payload) {
  const result = await execute(
    `INSERT INTO dbo.contact_enquiries (Name, Email, Phone, Subject, Message)
     OUTPUT INSERTED.*
     VALUES (@name, @email, @phone, @subject, @message)`,
    [
      { name: 'name', type: sql.NVarChar(160), value: payload.name },
      { name: 'email', type: sql.NVarChar(255), value: payload.email },
      { name: 'phone', type: sql.NVarChar(30), value: payload.phone || null },
      { name: 'subject', type: sql.NVarChar(160), value: payload.subject },
      { name: 'message', type: sql.NVarChar(sql.MAX), value: payload.message }
    ]
  );
  return mapContact(result.recordset[0]);
}

module.exports = { findAll, create };
