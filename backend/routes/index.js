const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const {
  verifyStudentSchema,
  createOrderSchema,
  verifyPaymentSchema
} = require('../validation/payment.validation');

router.use('/auth', require('./auth.routes'));
router.use('/admissions', require('./admission.routes'));
router.use('/contact', require('./contact.routes'));
router.post('/verify-student', validate(verifyStudentSchema), asyncHandler(paymentController.verifyStudent));
router.post('/create-payment-order', validate(createOrderSchema), asyncHandler(paymentController.createPaymentOrder));
router.post('/payment-success', validate(verifyPaymentSchema), asyncHandler(paymentController.paymentSuccess));
router.use('/students', require('./student.routes'));
router.use('/student', require('./student.routes'));
router.use('/homework', require('./homework.routes'));
router.use('/attendance', require('./attendance.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/payment', require('./payment.routes'));
router.use('/notices', require('./notice.routes'));
router.use('/results', require('./result.routes'));
router.use('/content', require('./content.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
