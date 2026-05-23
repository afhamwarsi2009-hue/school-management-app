const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email(),
  admission_number: Joi.string().trim().max(50),
  admissionNumber: Joi.string().trim().max(50),
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'student').required()
}).or('email', 'admission_number', 'admissionNumber');

const adminSchema = Joi.object({
  name: Joi.string().trim().max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'student').required(),
  studentId: Joi.number().integer().positive().allow(null)
});

module.exports = { loginSchema, registerSchema, adminSchema };
