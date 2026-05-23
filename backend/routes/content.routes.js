const router = require('express').Router();
const contentController = require('../controllers/content.controller');
const { requireAuth } = require('../authentication/requireAuth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/asyncHandler');
const { noticeSchema, eventSchema } = require('../validation/content.validation');

router.get('/public', asyncHandler(contentController.publicContent));
router.get('/notices', asyncHandler(contentController.notices));
router.post('/notices', requireAuth(['admin']), validate(noticeSchema), asyncHandler(contentController.createNotice));
router.put('/notices/:id', requireAuth(['admin']), validate(noticeSchema), asyncHandler(contentController.updateNotice));
router.delete('/notices/:id', requireAuth(['admin']), asyncHandler(contentController.deleteNotice));
router.get('/events', asyncHandler(contentController.events));
router.post('/events', requireAuth(['admin']), validate(eventSchema), asyncHandler(contentController.createEvent));
router.put('/events/:id', requireAuth(['admin']), validate(eventSchema), asyncHandler(contentController.updateEvent));
router.delete('/events/:id', requireAuth(['admin']), asyncHandler(contentController.deleteEvent));

module.exports = router;
