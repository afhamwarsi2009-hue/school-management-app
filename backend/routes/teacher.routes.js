const router = require('express').Router();
const controller = require('../controllers/teacher.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const { teacherSchema } = require('../validation/teacher.validation');

router.get('/', requireAuth(['admin']), asyncHandler(controller.list));
router.post('/', requireAuth(['admin']), validate(teacherSchema), asyncHandler(controller.create));
router.put('/:id', requireAuth(['admin']), validate(teacherSchema), asyncHandler(controller.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(controller.remove));

module.exports = router;
