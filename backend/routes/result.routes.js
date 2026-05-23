const router = require('express').Router();
const controller = require('../controllers/result.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const { resultSchema } = require('../validation/academic.validation');

router.get('/', requireAuth(['admin', 'student']), asyncHandler(controller.list));
router.get('/:studentId', requireAuth(['admin', 'student']), asyncHandler(controller.list));
router.post('/', requireAuth(['admin']), validate(resultSchema), asyncHandler(controller.create));

module.exports = router;
