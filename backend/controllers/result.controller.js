const academicService = require('../services/academic.service');

module.exports = {
  list: async (req, res) => {
    const studentId = req.params.studentId || req.query.student_id || (req.user?.role === 'student' ? req.user.studentId : null);
    res.json(await academicService.listResults(studentId));
  },
  create: async (req, res) => res.status(201).json(await academicService.createResult(req.body))
};
