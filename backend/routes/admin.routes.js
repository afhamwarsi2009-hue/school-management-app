const router = require('express').Router();
const { requireAuth } = require('../authentication/requireAuth');
const { asyncHandler } = require('../middleware/asyncHandler');
const adminController = require('../controllers/admin.controller');

router.get('/overview', requireAuth(['admin']), asyncHandler(adminController.overview));
router.get('/stats', requireAuth(['admin']), asyncHandler(adminController.overview));
router.get('/payment-history', requireAuth(['admin']), asyncHandler(adminController.paymentHistory));
router.get('/payments', requireAuth(['admin']), asyncHandler(adminController.paymentHistory));

module.exports = router;
