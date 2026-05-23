const admissionService = require('../services/admission.service');

module.exports = {
  list: async (req, res) => res.json(await admissionService.listAdmissions()),
  submit: async (req, res) => res.status(201).json(await admissionService.submitAdmission(req.body)),
  update: async (req, res) => res.json(await admissionService.updateAdmission(req.params.id, req.body)),
  remove: async (req, res) => res.json(await admissionService.deleteAdmission(req.params.id))
};
