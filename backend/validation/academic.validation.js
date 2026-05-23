const Joi = require('joi');

const attendanceSchema = Joi.object({
  StudentId: Joi.number().integer().required(),
  AttendanceDate: Joi.date().required(),
  Status: Joi.string().valid('Present', 'Absent', 'Late', 'Excused').required(),
  Remarks: Joi.string().max(500).allow(null, '')
});

const resultSchema = Joi.object({
  student_id: Joi.number().integer().positive(),
  StudentId: Joi.number().integer().positive(),
  exam_name: Joi.string().max(120),
  ExamName: Joi.string().max(120),
  subject: Joi.string().max(120),
  Subject: Joi.string().max(120),
  marks_obtained: Joi.number().min(0),
  MarksObtained: Joi.number().min(0),
  max_marks: Joi.number().positive(),
  MaxMarks: Joi.number().positive(),
  grade: Joi.string().max(10).allow(null, ''),
  Grade: Joi.string().max(10).allow(null, '')
}).or('student_id', 'StudentId')
  .or('exam_name', 'ExamName')
  .or('subject', 'Subject')
  .or('marks_obtained', 'MarksObtained')
  .or('max_marks', 'MaxMarks');

const homeworkSchema = Joi.object({
  StudentId: Joi.number().integer().allow(null),
  ClassName: Joi.string().max(50).required(),
  Subject: Joi.string().max(120).required(),
  Title: Joi.string().max(160).required(),
  Description: Joi.string().required(),
  DueDate: Joi.date().required()
});

const timetableSchema = Joi.object({
  ClassName: Joi.string().max(50).required(),
  Section: Joi.string().max(10).allow(null, ''),
  DayOfWeek: Joi.string().max(20).required(),
  PeriodNo: Joi.number().integer().required(),
  Subject: Joi.string().max(120).required(),
  TeacherName: Joi.string().max(160).required(),
  StartTime: Joi.string().required(),
  EndTime: Joi.string().required()
});

module.exports = { attendanceSchema, resultSchema, homeworkSchema, timetableSchema };
