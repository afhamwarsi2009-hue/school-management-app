const nodemailer = require('nodemailer');
const { env } = require('../config/env');

function createTransport() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transport = createTransport();
  if (!transport) {
    return { queued: false, skipped: true, reason: 'SMTP is not configured', to, subject };
  }

  const info = await transport.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html
  });

  return { queued: true, messageId: info.messageId };
}

function sendAdmissionEnquiryEmail(admission) {
  return sendEmail({
    to: admission.ParentEmail,
    subject: `${env.schoolShortName} admission enquiry received`,
    text: `Dear Parent,\n\nYour admission enquiry for ${admission.StudentName} has been received.\nApplication ID: ${admission.AdmissionId}\n\n${env.schoolName}`
  });
}

function sendContactFormEmail(enquiry) {
  return sendEmail({
    to: env.smtp.contactTo,
    subject: `Website contact: ${enquiry.subject || enquiry.Subject}`,
    text: `${enquiry.name || enquiry.Name} (${enquiry.email || enquiry.Email})\n${enquiry.phone || enquiry.Phone || ''}\n\n${enquiry.message || enquiry.Message}`
  });
}

function sendFeeReceiptEmail({ to, studentName, paymentId, amount }) {
  return sendEmail({
    to,
    subject: `${env.schoolShortName} fee receipt #${paymentId}`,
    text: `Dear ${studentName},\n\nYour fee payment of INR ${amount} has been recorded.\nReceipt ID: ${paymentId}\n\n${env.schoolName}`
  });
}

function sendPasswordResetEmail({ to, resetUrl }) {
  return sendEmail({
    to,
    subject: `${env.schoolShortName} password reset`,
    text: `Use this link to reset your password:\n${resetUrl}\n\nIf you did not request this, please contact the school office.`
  });
}

module.exports = {
  sendEmail,
  sendAdmissionEnquiryEmail,
  sendContactFormEmail,
  sendFeeReceiptEmail,
  sendPasswordResetEmail
};
