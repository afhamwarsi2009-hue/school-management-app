import { useState } from 'react';
import { apiClient } from '../services/apiClient.js';

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout. Please try again.'));
    document.body.appendChild(script);
  });
}

export function PaymentForm() {
  const [form, setForm] = useState({ studentId: '', studentName: '', class: '', amount: '' });
  const [verification, setVerification] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isChecking, setIsChecking] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setVerification(null);
    setStatus({ type: '', message: '' });
  }

  function getPayload() {
    return {
      student_id: Number(form.studentId),
      student_name: form.studentName.trim(),
      class: form.class.trim() || null
    };
  }

  async function verifyStudent() {
    setIsChecking(true);
    setStatus({ type: 'info', message: 'Checking student records...' });

    try {
      const result = await apiClient('/verify-student', {
        method: 'POST',
        body: JSON.stringify(getPayload())
      });
      setVerification(result.student);
      setStatus({ type: 'success', message: `Verified ${result.student.name} from Class ${result.student.class}.` });
      return result.student;
    } catch (error) {
      setVerification(null);
      setStatus({ type: 'error', message: error.message || 'Student not registered' });
      return null;
    } finally {
      setIsChecking(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsPaying(true);
    setStatus({ type: 'info', message: 'Verifying student before payment...' });

    try {
      const verifiedStudent = verification || await verifyStudent();
      if (!verifiedStudent) return;

      setStatus({ type: 'info', message: 'Creating secure Razorpay order...' });
      const order = await apiClient('/create-payment-order', {
        method: 'POST',
        body: JSON.stringify({
          ...getPayload(),
          amount: Number(form.amount)
        })
      });

      await loadRazorpayCheckout();

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Gurugram Public School',
        description: `Fee payment for ${order.student.name}`,
        order_id: order.order_id,
        prefill: {
          name: order.student.name
        },
        handler: async (response) => {
          setStatus({ type: 'info', message: 'Confirming payment with school server...' });
          const result = await apiClient('/payment-success', {
            method: 'POST',
            body: JSON.stringify(response)
          });
          setStatus({
            type: 'success',
            message: `Payment successful. Transaction ID: ${result.payment.razorpay_payment_id}`
          });
        },
        modal: {
          ondismiss: () => {
            setStatus({ type: 'error', message: 'Payment was cancelled. No fee record was marked successful.' });
            setIsPaying(false);
          }
        },
        theme: {
          color: '#0f766e'
        }
      });

      checkout.open();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <form className="premium-form" onSubmit={handleSubmit}>
      <label>Student ID<input type="number" placeholder="1" value={form.studentId} onChange={(event) => update('studentId', event.target.value)} required /></label>
      <label>Student Name<input type="text" placeholder="Student full name" value={form.studentName} onChange={(event) => update('studentName', event.target.value)} required /></label>
      <label>Class<input type="text" placeholder="Optional, e.g. 10-A" value={form.class} onChange={(event) => update('class', event.target.value)} /></label>
      <label>Amount<input type="number" min="1" placeholder="25000" value={form.amount} onChange={(event) => update('amount', event.target.value)} required /></label>
      <div className="payment-actions">
        <button type="button" className="secondary-button dark" onClick={verifyStudent} disabled={isChecking || isPaying}>
          {isChecking ? 'Checking...' : 'Verify Student'}
        </button>
        <button type="submit" className="primary-button" disabled={isChecking || isPaying}>
          {isPaying ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
      {verification && (
        <div className="verification-card">
          <strong>Student verified</strong>
          <span>{verification.name} - Class {verification.class}</span>
        </div>
      )}
      {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
    </form>
  );
}
