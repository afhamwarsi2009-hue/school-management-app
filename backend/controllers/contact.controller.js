const { sendContactFormEmail } = require('../services/email.service');
const contactModel = require('../models/contact.model');

async function submit(req, res) {
  const enquiry = await contactModel.create(req.body);
  const emailResult = await sendContactFormEmail(enquiry);
  res.status(201).json({ enquiry, email: emailResult });
}

async function list(req, res) {
  res.json(await contactModel.findAll());
}

module.exports = { submit, list };
