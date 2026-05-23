const studentModel = require('../models/student.model');
const bcrypt = require('bcryptjs');
const authService = require('../services/auth.service');
const { createCrudController } = require('./crud.controller');
const { httpError } = require('../utils/httpError');

const baseController = createCrudController(studentModel, 'Student');

module.exports = {
  ...baseController,
  register: async (req, res) => {
    res.status(201).json(await authService.registerStudent(req.body));
  },
  create: async (req, res) => {
    const passwordHash = req.body.password ? await bcrypt.hash(req.body.password, 12) : null;
    const student = await studentModel.create({ ...req.body, password_hash: passwordHash });
    res.status(201).json(student);
  },
  update: async (req, res) => {
    const passwordHash = req.body.password ? await bcrypt.hash(req.body.password, 12) : null;
    const student = await studentModel.update(req.params.id, { ...req.body, password_hash: passwordHash });
    if (!student) throw httpError(404, 'Student not found');
    res.json(student);
  },
  profile: async (req, res) => {
    const studentId = req.user?.role === 'student' ? req.user.studentId : req.params.studentId;
    const student = await studentModel.findById(studentId);
    if (!student) throw httpError(404, 'Student not found');
    res.json(student);
  }
};
