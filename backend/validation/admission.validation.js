const Joi = require('joi');

const admissionSchema = Joi.object({
  StudentName: Joi.string().max(160).required(),
  ApplyingClass: Joi.string().max(50).required(),
  ParentEmail: Joi.string().email().required(),
  Phone: Joi.string().max(30).required(),
  Message: Joi.string().max(2000).allow(null, ''),
  Status: Joi.string().valid('Submitted', 'Review', 'Approved', 'Rejected', 'Cancelled').default('Submitted')
});

const contactSchema = Joi.object({
  name: Joi.string().max(160).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(30).allow(null, ''),
  subject: Joi.string().max(160).required(),
  message: Joi.string().max(3000).required()
});

module.exports = { admissionSchema, contactSchema };
