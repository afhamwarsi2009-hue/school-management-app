const router = require('express').Router();
const attendanceController = require('../controllers/attendance.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { attendanceSchema } = require('../validation/resource.validation');

router.get('/', requireAuth(['admin', 'student']), asyncHandler(attendanceController.list));
router.post('/', requireAuth(['admin']), validate(attendanceSchema), asyncHandler(attendanceController.create));
router.put('/:id', requireAuth(['admin']), validate(attendanceSchema), asyncHandler(attendanceController.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(attendanceController.remove));

module.exports = router;
