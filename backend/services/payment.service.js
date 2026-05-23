const paymentModel = require('../models/payment.model');

module.exports = {
  listPayments: paymentModel.findAll,
  getPaymentHistory: async (studentId) => ({ studentId: Number(studentId), payments: await paymentModel.findByStudent(studentId) }),
  createPayment: paymentModel.create,
  updatePayment: paymentModel.update,
  deletePayment: paymentModel.remove
};
