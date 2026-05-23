const Joi = require('joi');

const teacherSchema = Joi.object({
  FirstName: Joi.string().max(100).required(),
  LastName: Joi.string().max(100).required(),
  Email: Joi.string().email().required(),
  Phone: Joi.string().max(30).allow(null, ''),
  Department: Joi.string().max(120).required(),
  Designation: Joi.string().max(120).required()
});

module.exports = { teacherSchema };
