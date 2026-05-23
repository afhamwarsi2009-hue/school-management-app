const Joi = require('joi');

const studentSchema = Joi.object({
  admission_number: Joi.string().trim().max(50).optional(),
  name: Joi.string().trim().max(120).required(),
  email: Joi.string().email().required(),
  class: Joi.string().trim().max(40).required(),
  roll_number: Joi.string().trim().max(40).required(),
  total_fees: Joi.number().min(0).required(),
  paid_fees: Joi.number().min(0).default(0),
  password: Joi.string().min(8).optional()
});

const studentRegistrationSchema = Joi.object({
  admission_number: Joi.string().trim().max(50).required(),
  name: Joi.string().trim().max(120).required(),
  email: Joi.string().email().required(),
  class: Joi.string().trim().max(40).required(),
  roll_number: Joi.string().trim().max(40).required(),
  password: Joi.string().min(8).required(),
  total_fees: Joi.number().min(0).default(0),
  paid_fees: Joi.number().min(0).default(0)
});

const homeworkSchema = Joi.object({
  student_id: Joi.number().integer().positive().allow(null),
  class: Joi.string().trim().max(40).required(),
  subject: Joi.string().trim().max(80).required(),
  title: Joi.string().trim().max(160).required(),
  description: Joi.string().allow('', null),
  due_date: Joi.date().iso().required()
});

const attendanceSchema = Joi.object({
  student_id: Joi.number().integer().positive().required(),
  attendance_date: Joi.date().iso().required(),
  status: Joi.string().valid('Present', 'Absent', 'Late', 'Leave').required(),
  remarks: Joi.string().max(255).allow('', null)
});

const paymentSchema = Joi.object({
  student_id: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
  payment_mode: Joi.string().max(40).allow('', null),
  razorpay_order_id: Joi.string().max(120).allow('', null),
  razorpay_payment_id: Joi.string().max(120).allow('', null),
  status: Joi.string().valid('Success', 'Failed', 'Pending').default('Success')
});

const noticeSchema = Joi.object({
  title: Joi.string().trim().max(160).required(),
  body: Joi.string().trim().required(),
  audience: Joi.string().trim().max(40).default('All'),
  is_published: Joi.boolean().default(true),
  published_at: Joi.date().iso().allow(null)
});

module.exports = {
  studentSchema,
  studentRegistrationSchema,
  homeworkSchema,
  attendanceSchema,
  paymentSchema,
  noticeSchema
};
