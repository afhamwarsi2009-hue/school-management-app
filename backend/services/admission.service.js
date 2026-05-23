const crud = require('../database/crudRepository');
const { sendAdmissionEnquiryEmail } = require('./email.service');

async function submitAdmission(payload) {
  const admission = await crud.create('Admissions', { ...payload, Status: payload.Status || 'Submitted' });
  await sendAdmissionEnquiryEmail(admission);
  return admission;
}

module.exports = {
  listAdmissions: () => crud.list('Admissions'),
  submitAdmission,
  updateAdmission: (id, payload) => crud.update('Admissions', id, payload),
  deleteAdmission: (id) => crud.remove('Admissions', id)
};
