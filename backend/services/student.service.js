const studentModel = require('../models/student.model');

module.exports = {
  listStudents: studentModel.findAll,
  createStudent: studentModel.create,
  updateStudent: studentModel.update,
  deleteStudent: studentModel.remove,
  getProfile: studentModel.findById
};
