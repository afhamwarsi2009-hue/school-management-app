import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Download, GraduationCap, Wallet } from 'lucide-react';
import { apiClient } from '../services/apiClient.js';

function money(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  async function loadDashboard() {
    const student = await apiClient('/students/me/profile');
    const paymentHistory = await apiClient(`/payments/history/${student.id}`);
    setProfile(student);
    setHistory(paymentHistory.payments);
    setAmount(student.remaining_fees > 0 ? student.remaining_fees : '');
  }

  useEffect(() => {
    loadDashboard().catch((error) => setStatus(error.message));
  }, []);

  useEffect(() => {
    const receiptId = params.get('receipt');
    if (receiptId) downloadReceipt(receiptId).catch((error) => setStatus(error.message));
  }, [params]);

  async function downloadReceipt(paymentId) {
    const blob = await apiClient(`/payments/receipt/${paymentId}`, { responseType: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${paymentId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!profile) return <section className="dashboard-panel">Loading dashboard...</section>;

  return (
    <section className="dashboard-stack">
      <div className="dashboard-heading">
        <div>
          <span>Student Dashboard</span>
          <h1>{profile.name}</h1>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card"><GraduationCap size={24} /><p>Class</p><h2>{profile.class}</h2></article>
        <article className="dashboard-card"><Wallet size={24} /><p>Total fees</p><h2>{money(profile.total_fees)}</h2></article>
        <article className="dashboard-card"><CreditCard size={24} /><p>Paid fees</p><h2>{money(profile.paid_fees)}</h2></article>
        <article className="dashboard-card"><CreditCard size={24} /><p>Remaining</p><h2>{money(profile.remaining_fees)}</h2></article>
      </div>

      <section className="management-layout">
        <div className="dashboard-panel">
          <h2>Pay fees</h2>
          <label>
            Amount
            <input type="number" min="1" max={profile.remaining_fees} value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          <button className="primary-button" type="button" onClick={() => navigate('/payments')} disabled={!Number(amount)}>
            <CreditCard size={18} /> Pay Online
          </button>
          {status && <p className="form-status">{status}</p>}
        </div>

        <div className="dashboard-panel table-panel">
          <h2>Payment history</h2>
          <table>
            <thead><tr><th>Amount</th><th>Payment ID</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {history.map((payment) => (
                <tr key={payment.id}>
                  <td>{money(payment.amount)}</td>
                  <td>{payment.razorpay_payment_id || payment.id}</td>
                  <td>{new Date(payment.created_at).toLocaleString()}</td>
                  <td><button type="button" onClick={() => downloadReceipt(payment.id)}><Download size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
