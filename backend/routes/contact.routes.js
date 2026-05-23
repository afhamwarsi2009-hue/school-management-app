const router = require('express').Router();
const controller = require('../controllers/contact.controller');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const { requireAuth } = require('../authentication/requireAuth');
const { contactSchema } = require('../validation/admission.validation');

router.post('/', validate(contactSchema), asyncHandler(controller.submit));
router.get('/', requireAuth(['admin']), asyncHandler(controller.list));

module.exports = router;
