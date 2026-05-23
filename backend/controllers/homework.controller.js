const homeworkModel = require('../models/homework.model');
const { createCrudController } = require('./crud.controller');

module.exports = createCrudController(homeworkModel, 'Homework');
