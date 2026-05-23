import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiClient } from '../services/apiClient.js';

export function LoginPage() {
  const { role = 'student' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', admission_number: '', password: '' });
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Signing in...');
    try {
      const result = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(role === 'student'
          ? { admission_number: form.admission_number.trim(), password: form.password, role }
          : { email: form.email.trim().toLowerCase(), password: form.password, role: 'admin' })
      });
      signIn(result);
      const redirectTo = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/student');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span>Secure Login</span>
        <h1>{role} portal</h1>
        {role === 'student' ? (
          <label>
            Admission Number
            <input type="text" value={form.admission_number} onChange={(event) => setForm({ ...form, admission_number: event.target.value })} required />
          </label>
        ) : (
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
        )}
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <button type="submit" className="primary-button"><LogIn size={18} /> Sign In</button>
        {role === 'student' && <Link className="secondary-button dark" to="/register/student">Create Student Account</Link>}
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
}
