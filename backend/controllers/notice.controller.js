const noticeModel = require('../models/notice.model');
const { createCrudController } = require('./crud.controller');

module.exports = createCrudController(noticeModel, 'Notice');
