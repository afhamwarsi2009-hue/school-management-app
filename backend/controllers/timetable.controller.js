const academicService = require('../services/academic.service');

module.exports = {
  list: async (req, res) => res.json(await academicService.listTimetable()),
  create: async (req, res) => res.status(201).json(await academicService.createTimetable(req.body)),
  update: async (req, res) => res.json(await academicService.updateTimetable(req.params.id, req.body)),
  remove: async (req, res) => res.json(await academicService.deleteTimetable(req.params.id))
};
