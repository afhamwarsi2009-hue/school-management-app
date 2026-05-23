const Joi = require('joi');

const studentDetails = {
  student_id: Joi.number().integer().positive().required(),
  student_name: Joi.string().trim().max(120).required(),
  class: Joi.string().trim().max(40).allow('', null)
};

const verifyStudentSchema = Joi.object(studentDetails);

const createOrderSchema = Joi.object({
  ...studentDetails,
  amount: Joi.number().positive().required()
});

const verifyPaymentSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required()
});

module.exports = { verifyStudentSchema, createOrderSchema, verifyPaymentSchema };
