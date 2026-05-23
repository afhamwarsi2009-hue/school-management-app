const crypto = require('crypto');
const Razorpay = require('razorpay');
const { env } = require('../config/env');
const { httpError } = require('../utils/httpError');

function getRazorpay() {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw httpError(500, 'Razorpay credentials are not configured');
  }

  return new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret
  });
}

async function createGatewayOrder({ amount, receipt }) {
  const razorpay = getRazorpay();
  return razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: 'INR',
    receipt,
    payment_capture: 1
  });
}

function verifyGatewaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const expectedSignature = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(String(razorpay_signature || ''));

  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

module.exports = { createGatewayOrder, verifyGatewaySignature };
