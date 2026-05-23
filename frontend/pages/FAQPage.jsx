import { SectionHeader } from '../components/SectionHeader.jsx';

const faqs = [
  ['How do admissions work?', 'Submit the online form, upload required documents, and track the application from the portal.'],
  ['Can parents pay fees online?', 'Yes. Tuition, admission, exam, and transport fees are supported through Razorpay integration.'],
  ['Where can students see homework?', 'Homework, timetable, results, attendance, and downloads are available in the student portal.'],
  ['How are duplicate payments handled?', 'Duplicate transactions are matched by idempotency key and resolved by refund or adjustment.']
];

export function FAQPage() {
  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="FAQ" title="Answers for families">
        Clear guidance for admissions, portals, payments, academics, and school communication.
      </SectionHeader>
      <div className="faq-list">
        {faqs.map(([question, answer]) => (
          <details key={question} open>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
