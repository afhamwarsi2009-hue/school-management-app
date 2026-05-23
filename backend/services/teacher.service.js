const crud = require('../database/crudRepository');

module.exports = {
  listTeachers: () => crud.list('Teachers'),
  createTeacher: (payload) => crud.create('Teachers', payload),
  updateTeacher: (id, payload) => crud.update('Teachers', id, payload),
  deleteTeacher: (id) => crud.remove('Teachers', id)
};
