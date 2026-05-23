import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function PaymentFailurePage() {
  return (
    <section className="status-page failure">
      <XCircle size={46} />
      <h1>Payment failed</h1>
      <p>No fees were updated. Please try again from your dashboard.</p>
      <Link className="primary-button" to="/student">Try Again</Link>
    </section>
  );
}
