const paymentModel = require('../models/payment.model');
const studentModel = require('../models/student.model');
const { createCrudController } = require('./crud.controller');
const { createReceiptPdf } = require('../utils/receiptPdf');
const { createGatewayOrder, verifyGatewaySignature } = require('../payment-gateway/paymentGateway.service');
const { env } = require('../config/env');
const { httpError } = require('../utils/httpError');

const baseController = createCrudController(paymentModel, 'Payment');

async function verifyStudentDetails(payload) {
  const result = await studentModel.findByPaymentDetails({
    studentId: payload.student_id || payload.studentId,
    studentName: payload.student_name || payload.studentName,
    studentClass: payload.class || payload.student_class || payload.studentClass
  });

  if (!result.ok) {
    throw httpError(result.reason === 'Invalid Student ID' ? 404 : 400, result.reason);
  }

  return result.student;
}

module.exports = {
  ...baseController,
  verifyStudent: async (req, res) => {
    const student = await verifyStudentDetails(req.body);
    res.json({
      verified: true,
      message: 'Student verified',
      student: {
        id: student.id,
        name: student.name,
        class: student.class,
        remaining_fees: student.remaining_fees
      }
    });
  },
  createPaymentOrder: async (req, res) => {
    const student = await verifyStudentDetails(req.body);
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw httpError(400, 'Payment amount must be greater than zero');
    }

    const order = await createGatewayOrder({
      amount,
      receipt: `fees-${student.id}-${Date.now()}`
    });

    const pendingPayment = await paymentModel.create({
      student_id: student.id,
      student_name: student.name,
      class: student.class,
      amount,
      payment_mode: 'Online',
      razorpay_order_id: order.id,
      status: 'Pending'
    });

    res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: env.razorpay.keyId,
      payment_record_id: pendingPayment.id,
      student: {
        id: student.id,
        name: student.name,
        class: student.class
      }
    });
  },
  paymentSuccess: async (req, res) => {
    const isValid = verifyGatewaySignature(req.body);
    if (!isValid) {
      throw httpError(400, 'Payment verification failed');
    }

    const pendingPayment = await paymentModel.findByOrderId(req.body.razorpay_order_id);
    if (!pendingPayment) {
      throw httpError(404, 'Payment order not found');
    }

    const payment = await paymentModel.markSuccessByOrderId(req.body.razorpay_order_id, {
      razorpay_payment_id: req.body.razorpay_payment_id
    });

    res.json({
      message: 'Payment successful',
      payment_status: 'SUCCESS',
      payment
    });
  },
  create: async (req, res) => {
    const studentId = req.user?.role === 'student' ? req.user.studentId : req.body.student_id;
    res.status(201).json(await paymentModel.create({ ...req.body, student_id: studentId }));
  },
  history: async (req, res) => {
    const studentId = req.user?.role === 'student' ? req.user.studentId : req.params.studentId;
    res.json({ studentId: Number(studentId), payments: await paymentModel.findByStudent(studentId) });
  },
  receipt: async (req, res) => {
    const stream = await createReceiptPdf(req.params.paymentId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${req.params.paymentId}.pdf`);
    stream.pipe(res);
  }
};
