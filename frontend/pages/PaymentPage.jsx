import { CreditCard, FileCheck, RotateCcw, ShieldCheck } from 'lucide-react';
import { PaymentForm } from '../forms/PaymentForm.jsx';
import { SectionHeader } from '../components/SectionHeader.jsx';

export function PaymentPage() {
  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="Secure Fees" title="Online fee payment gateway">
        Tuition, admission, exam, and transport fees with duplicate payment checks and receipt generation.
      </SectionHeader>
      <div className="payment-layout">
        <PaymentForm />
        <aside className="policy-card">
          <p><ShieldCheck size={18} /> HTTPS-ready secure payment flow with encrypted gateway tokens.</p>
          <p><FileCheck size={18} /> Receipts are generated after verified success callbacks.</p>
          <p><RotateCcw size={18} /> Duplicate payments are reviewed and resolved within 7 working days.</p>
          <p><CreditCard size={18} /> UPI, card, net banking, and wallet providers are supported by gateway adapters.</p>
        </aside>
      </div>
    </section>
  );
}
