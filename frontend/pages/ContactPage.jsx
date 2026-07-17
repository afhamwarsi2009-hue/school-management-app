import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader.jsx';
import { apiClient } from '../services/apiClient.js';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Sending enquiry...');
    try {
      await apiClient('/contact', { method: 'POST', body: JSON.stringify(form) });
      setStatus('Your enquiry has been sent.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="Contact Us" title="Admissions and support desk">
        Connect with our office for admissions, transport, payments, documents, or portal support.
      </SectionHeader>
      <div className="contact-layout">
        <form className="premium-form" onSubmit={handleSubmit}>
          <label>Name<input type="text" placeholder="Parent or student name" value={form.name} onChange={(event) => update('name', event.target.value)} required /></label>
          <label>Email<input type="email" placeholder="you@example.com" value={form.email} onChange={(event) => update('email', event.target.value)} required /></label>
          <label>Phone<input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label>
          <label>Subject<input type="text" placeholder="Admission enquiry" value={form.subject} onChange={(event) => update('subject', event.target.value)} required /></label>
          <label>Message<textarea rows="5" placeholder="How can we help?" value={form.message} onChange={(event) => update('message', event.target.value)} required /></label>
          <button type="submit" className="primary-button">Send Enquiry</button>
          {status && <p className="form-status">{status}</p>}
        </form>
        <aside className="policy-card">
          <p><MapPin size={18} /> Gurugram Public School Campus</p>
          <p><Phone size={18} /> +91 99553 67376, +91 93043 33219</p>
          <p><Mail size={18} /> info@gurugrambish.in</p>
        </aside>
      </div>
    </section>
  );
}


