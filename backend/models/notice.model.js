const { execute, sql } = require('../database/db');

function mapNotice(row) {
  return {
    id: row.NoticeId,
    title: row.Title,
    body: row.Body,
    audience: row.Audience,
    is_published: row.IsPublished,
    published_at: row.PublishedAt,
    created_at: row.CreatedAt
  };
}

async function findAll() {
  const result = await execute('SELECT * FROM dbo.notices ORDER BY PublishedAt DESC, NoticeId DESC');
  return result.recordset.map(mapNotice);
}

async function create(payload) {
  const result = await execute(
    `INSERT INTO dbo.notices (Title, Body, Audience, IsPublished, PublishedAt)
     OUTPUT INSERTED.*
     VALUES (@title, @body, @audience, @isPublished, COALESCE(@publishedAt, SYSUTCDATETIME()))`,
    [
      { name: 'title', type: sql.NVarChar(160), value: payload.title },
      { name: 'body', type: sql.NVarChar(sql.MAX), value: payload.body },
      { name: 'audience', type: sql.NVarChar(40), value: payload.audience || 'All' },
      { name: 'isPublished', type: sql.Bit, value: payload.is_published !== false },
      { name: 'publishedAt', type: sql.DateTime2, value: payload.published_at || null }
    ]
  );
  return mapNotice(result.recordset[0]);
}

async function update(noticeId, payload) {
  const result = await execute(
    `UPDATE dbo.notices
     SET Title = @title,
         Body = @body,
         Audience = @audience,
         IsPublished = @isPublished,
         PublishedAt = COALESCE(@publishedAt, PublishedAt)
     OUTPUT INSERTED.*
     WHERE NoticeId = @noticeId`,
    [
      { name: 'noticeId', type: sql.Int, value: Number(noticeId) },
      { name: 'title', type: sql.NVarChar(160), value: payload.title },
      { name: 'body', type: sql.NVarChar(sql.MAX), value: payload.body },
      { name: 'audience', type: sql.NVarChar(40), value: payload.audience || 'All' },
      { name: 'isPublished', type: sql.Bit, value: payload.is_published !== false },
      { name: 'publishedAt', type: sql.DateTime2, value: payload.published_at || null }
    ]
  );
  return result.recordset[0] ? mapNotice(result.recordset[0]) : null;
}

async function remove(noticeId) {
  const result = await execute('DELETE FROM dbo.notices WHERE NoticeId = @noticeId', [
    { name: 'noticeId', type: sql.Int, value: Number(noticeId) }
  ]);
  return result.rowsAffected[0] > 0;
}

module.exports = { findAll, create, update, remove };
