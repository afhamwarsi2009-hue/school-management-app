const crud = require('../database/crudRepository');
const { execute } = require('../database/db');
const { env } = require('../config/env');

async function publicContent() {
  const notices = await execute("SELECT TOP 5 * FROM dbo.notices WHERE IsPublished = 1 AND Audience IN ('Public', 'All') ORDER BY PublishedAt DESC");
  const events = await execute('SELECT TOP 5 * FROM dbo.events WHERE IsPublished = 1 ORDER BY EventDate DESC');
  return {
    schoolName: env.schoolName,
    principalMessage: 'Excellence with empathy.',
    notices: notices.recordset,
    events: events.recordset
  };
}

module.exports = {
  publicContent,
  listNotices: () => crud.list('Notices'),
  createNotice: (payload) => crud.create('Notices', payload),
  updateNotice: (id, payload) => crud.update('Notices', id, payload),
  deleteNotice: (id) => crud.remove('Notices', id),
  listEvents: () => crud.list('Events'),
  createEvent: (payload) => crud.create('Events', payload),
  updateEvent: (id, payload) => crud.update('Events', id, payload),
  deleteEvent: (id) => crud.remove('Events', id)
};
