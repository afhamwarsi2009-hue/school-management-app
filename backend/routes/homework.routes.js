const router = require('express').Router();
const homeworkController = require('../controllers/homework.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { homeworkSchema } = require('../validation/resource.validation');

router.get('/', requireAuth(['admin', 'student']), asyncHandler(homeworkController.list));
router.post('/', requireAuth(['admin']), validate(homeworkSchema), asyncHandler(homeworkController.create));
router.put('/:id', requireAuth(['admin']), validate(homeworkSchema), asyncHandler(homeworkController.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(homeworkController.remove));

module.exports = router;
