import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download } from 'lucide-react';

export function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const paymentId = params.get('paymentId');

  return (
    <section className="status-page success">
      <CheckCircle2 size={46} />
      <h1>Payment successful</h1>
      <p>Your fees have been updated and the receipt is ready.</p>
      <div className="hero-actions">
        {paymentId && <Link className="primary-button" to={`/student?receipt=${paymentId}`}><Download size={18} /> Download Receipt</Link>}
        <Link className="secondary-button dark" to="/student">Back to dashboard</Link>
      </div>
    </section>
  );
}
