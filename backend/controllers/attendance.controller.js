const attendanceModel = require('../models/attendance.model');
const { createCrudController } = require('./crud.controller');

module.exports = createCrudController(attendanceModel, 'Attendance');
