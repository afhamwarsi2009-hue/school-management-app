const router = require('express').Router();
const controller = require('../controllers/admission.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const { admissionSchema } = require('../validation/admission.validation');

router.post('/', validate(admissionSchema), asyncHandler(controller.submit));
router.get('/', requireAuth(['admin']), asyncHandler(controller.list));
router.put('/:id', requireAuth(['admin']), validate(admissionSchema), asyncHandler(controller.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(controller.remove));

module.exports = router;
