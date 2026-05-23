const contentService = require('../services/content.service');

module.exports = {
  publicContent: async (req, res) => res.json(await contentService.publicContent()),
  notices: async (req, res) => res.json(await contentService.listNotices()),
  createNotice: async (req, res) => res.status(201).json(await contentService.createNotice(req.body)),
  updateNotice: async (req, res) => res.json(await contentService.updateNotice(req.params.id, req.body)),
  deleteNotice: async (req, res) => res.json(await contentService.deleteNotice(req.params.id)),
  events: async (req, res) => res.json(await contentService.listEvents()),
  createEvent: async (req, res) => res.status(201).json(await contentService.createEvent(req.body)),
  updateEvent: async (req, res) => res.json(await contentService.updateEvent(req.params.id, req.body)),
  deleteEvent: async (req, res) => res.json(await contentService.deleteEvent(req.params.id))
};
