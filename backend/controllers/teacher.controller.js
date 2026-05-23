const teacherService = require('../services/teacher.service');

module.exports = {
  list: async (req, res) => res.json(await teacherService.listTeachers()),
  create: async (req, res) => res.status(201).json(await teacherService.createTeacher(req.body)),
  update: async (req, res) => res.json(await teacherService.updateTeacher(req.params.id, req.body)),
  remove: async (req, res) => res.json(await teacherService.deleteTeacher(req.params.id))
};
