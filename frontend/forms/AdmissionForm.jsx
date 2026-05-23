import { useState } from 'react';
import { apiClient } from '../services/apiClient.js';

export function AdmissionForm() {
  const [form, setForm] = useState({ StudentName: '', ApplyingClass: '', ParentEmail: '', Phone: '', Message: '' });
  const [status, setStatus] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Submitting application...');
    try {
      await apiClient('/admissions', { method: 'POST', body: JSON.stringify(form) });
      setStatus('Application submitted successfully.');
      setForm({ StudentName: '', ApplyingClass: '', ParentEmail: '', Phone: '', Message: '' });
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <form className="premium-form" onSubmit={handleSubmit}>
      <label>Student Name<input type="text" name="studentName" placeholder="Enter full name" value={form.StudentName} onChange={(event) => update('StudentName', event.target.value)} required /></label>
      <label>Applying Class<input type="text" name="className" placeholder="Grade VI" value={form.ApplyingClass} onChange={(event) => update('ApplyingClass', event.target.value)} required /></label>
      <label>Parent Email<input type="email" name="email" placeholder="parent@example.com" value={form.ParentEmail} onChange={(event) => update('ParentEmail', event.target.value)} required /></label>
      <label>Phone Number<input type="tel" name="phone" placeholder="+91 98765 43210" value={form.Phone} onChange={(event) => update('Phone', event.target.value)} required /></label>
      <label>Message<textarea name="message" rows="4" placeholder="Tell us about the student" value={form.Message} onChange={(event) => update('Message', event.target.value)} /></label>
      <button type="submit" className="primary-button">Submit Application</button>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
