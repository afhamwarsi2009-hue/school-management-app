const router = require('express').Router();
const { requireAuth } = require('../authentication/requireAuth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { studentRegistrationSchema, studentSchema } = require('../validation/resource.validation');
const studentController = require('../controllers/student.controller');

router.post('/register', validate(studentRegistrationSchema), asyncHandler(studentController.register));
router.get('/me/profile', requireAuth(['student']), asyncHandler(studentController.profile));
router.get('/', requireAuth(['admin']), asyncHandler(studentController.list));
router.post('/', requireAuth(['admin']), validate(studentSchema), asyncHandler(studentController.create));
router.get('/:studentId/profile', requireAuth(['student', 'admin']), asyncHandler(studentController.profile));
router.put('/:id', requireAuth(['admin']), validate(studentSchema), asyncHandler(studentController.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(studentController.remove));

module.exports = router;
