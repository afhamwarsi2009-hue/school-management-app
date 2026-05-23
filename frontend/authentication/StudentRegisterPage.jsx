import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiClient } from '../services/apiClient.js';

const emptyForm = {
  admission_number: '',
  name: '',
  email: '',
  class: '',
  roll_number: '',
  password: '',
  confirm_password: ''
};

export function StudentRegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirm_password) {
      setStatus('Passwords do not match.');
      return;
    }

    setStatus('Creating secure student account...');
    try {
      const result = await apiClient('/students/register', {
        method: 'POST',
        body: JSON.stringify({
          admission_number: form.admission_number,
          name: form.name,
          email: form.email,
          class: form.class,
          roll_number: form.roll_number,
          password: form.password
        })
      });
      signIn(result);
      navigate('/student');
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="auth-page registration-page">
      <form className="auth-card auth-card-wide" onSubmit={handleSubmit}>
        <span>Student Registration</span>
        <h1>Gurugram Public School ERP</h1>
        <div className="auth-grid">
          <label>
            Admission Number
            <input type="text" value={form.admission_number} onChange={(event) => update('admission_number', event.target.value)} required />
          </label>
          <label>
            Student Name
            <input type="text" value={form.name} onChange={(event) => update('name', event.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
          </label>
          <label>
            Class
            <input type="text" placeholder="10-A" value={form.class} onChange={(event) => update('class', event.target.value)} required />
          </label>
          <label>
            Roll Number
            <input type="text" value={form.roll_number} onChange={(event) => update('roll_number', event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" minLength="8" value={form.password} onChange={(event) => update('password', event.target.value)} required />
          </label>
          <label className="auth-grid-full">
            Confirm Password
            <input type="password" minLength="8" value={form.confirm_password} onChange={(event) => update('confirm_password', event.target.value)} required />
          </label>
        </div>
        <button type="submit" className="primary-button"><UserPlus size={18} /> Register and Enter Portal</button>
        <Link className="secondary-button dark" to="/login/student"><ShieldCheck size={18} /> Existing Student Login</Link>
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
}
