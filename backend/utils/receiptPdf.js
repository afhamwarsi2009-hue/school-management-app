const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const path = require('path');
const { execute, sql } = require('../database/db');
const { env } = require('../config/env');
const { httpError } = require('./httpError');

const receiptLogoPath = path.join(__dirname, '..', 'assets', 'school-logo.png');

async function createReceiptPdf(paymentId) {
  const result = await execute(
    `SELECT p.*, s.Name AS StudentName, s.Class, s.RollNumber
     FROM dbo.payments p
     INNER JOIN dbo.students s ON s.StudentId = p.StudentId
     WHERE p.PaymentId = @paymentId`,
    [{ name: 'paymentId', type: sql.Int, value: Number(paymentId) }]
  );

  const payment = result.recordset[0];
  if (!payment) throw httpError(404, 'Payment not found');

  const doc = new PDFDocument({ margin: 48, size: 'A4' });
  const stream = new PassThrough();
  doc.pipe(stream);

  doc.image(receiptLogoPath, doc.page.width / 2 - 44, 38, { width: 88 });
  doc.moveDown(4.5);
  doc.fontSize(22).text(env.schoolName, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).text('Fee Payment Receipt', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(12);
  doc.text(`Student Name: ${payment.StudentName}`);
  doc.text(`Class: ${payment.Class}`);
  doc.text(`Roll Number: ${payment.RollNumber}`);
  doc.moveDown();
  doc.text(`Amount: INR ${Number(payment.Amount).toFixed(2)}`);
  doc.text(`Payment ID: ${payment.RazorpayPaymentId || payment.PaymentId}`);
  doc.text(`Order ID: ${payment.RazorpayOrderId || 'Manual payment'}`);
  doc.text(`Status: ${payment.Status}`);
  doc.text(`Date: ${new Date(payment.CreatedAt).toLocaleString('en-IN')}`);
  doc.moveDown(2);
  doc.text('This is a computer-generated receipt.', { align: 'center' });
  doc.end();

  return stream;
}

module.exports = { createReceiptPdf };
