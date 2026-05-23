const Joi = require('joi');

const noticeSchema = Joi.object({
  Title: Joi.string().max(160).required(),
  Body: Joi.string().required(),
  Audience: Joi.string().valid('Public', 'Admin', 'Teacher', 'Student', 'Parent', 'All').required(),
  PublishedAt: Joi.date().allow(null),
  IsPublished: Joi.boolean().default(false)
});

const eventSchema = Joi.object({
  Title: Joi.string().max(160).required(),
  Description: Joi.string().required(),
  EventDate: Joi.date().required(),
  Location: Joi.string().max(160).allow(null, ''),
  IsPublished: Joi.boolean().default(false)
});

module.exports = { noticeSchema, eventSchema };
