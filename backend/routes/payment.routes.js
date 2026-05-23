const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const { paymentSchema } = require('../validation/resource.validation');

router.get('/', requireAuth(['admin']), asyncHandler(paymentController.list));
router.post('/', requireAuth(['admin']), validate(paymentSchema), asyncHandler(paymentController.create));
router.get('/history/:studentId', requireAuth(['student', 'admin']), asyncHandler(paymentController.history));
router.get('/receipt/:paymentId', requireAuth(['student', 'admin']), asyncHandler(paymentController.receipt));
router.put('/:id', requireAuth(['admin']), validate(paymentSchema), asyncHandler(paymentController.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(paymentController.remove));

module.exports = router;
