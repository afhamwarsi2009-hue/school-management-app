const Joi = require('joi');

const studentSchema = Joi.object({
  name: Joi.string().trim().max(120).required(),
  email: Joi.string().email().required(),
  class: Joi.string().trim().max(40).required(),
  roll_number: Joi.string().trim().max(40).required(),
  total_fees: Joi.number().min(0).required(),
  paid_fees: Joi.number().min(0).default(0),
  password: Joi.string().min(8).optional()
});

module.exports = { studentSchema };
