const router = require('express').Router();
const noticeController = require('../controllers/notice.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { noticeSchema } = require('../validation/resource.validation');

router.get('/', asyncHandler(noticeController.list));
router.post('/', requireAuth(['admin']), validate(noticeSchema), asyncHandler(noticeController.create));
router.put('/:id', requireAuth(['admin']), validate(noticeSchema), asyncHandler(noticeController.update));
router.delete('/:id', requireAuth(['admin']), asyncHandler(noticeController.remove));

module.exports = router;
