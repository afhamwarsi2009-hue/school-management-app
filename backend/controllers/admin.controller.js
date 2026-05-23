const adminService = require('../admin-panel/admin.service');
const paymentModel = require('../models/payment.model');

module.exports = {
  overview: async (req, res) => res.json(await adminService.getAdminDashboardMetrics()),
  paymentHistory: async (req, res) => res.json(await paymentModel.findAll())
};
