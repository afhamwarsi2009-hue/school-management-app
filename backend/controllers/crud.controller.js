const { httpError } = require('../utils/httpError');

function createCrudController(model, resourceName) {
  return {
    list: async (req, res) => {
      res.json(await model.findAll(req.query));
    },
    create: async (req, res) => {
      res.status(201).json(await model.create(req.body));
    },
    update: async (req, res) => {
      const updated = await model.update(req.params.id, req.body);
      if (!updated) throw httpError(404, `${resourceName} not found`);
      res.json(updated);
    },
    remove: async (req, res) => {
      const deleted = await model.remove(req.params.id);
      if (!deleted) throw httpError(404, `${resourceName} not found`);
      res.json({ deleted: true });
    }
  };
}

module.exports = { createCrudController };
