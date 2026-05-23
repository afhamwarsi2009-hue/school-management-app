const router = require('express').Router();
const controller = require('../controllers/timetable.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const { timetableSchema } = require('../validation/academic.validation');

router.get('/', requireAuth(['admin', 'teacher', 'student', 'parent']), asyncHandler(controller.list));
router.post('/', requireAuth(['admin']), validate(timetableSchema), asyncHandler(controller.create));
router.put('/:id', requireAuth(['admin']), validate(timetableSchema), asyncHandler(controller.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(controller.remove));

module.exports = router;
