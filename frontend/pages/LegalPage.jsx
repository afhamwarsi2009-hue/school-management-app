import { useEffect } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { Download, FileText, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

const lastUpdated = '18 May 2026';
const ugcPdfUrl = '/assets/documents/UGC_RefundPolicy.pdf';

const school = {
  website: 'gurugrambush.com',
  name: 'Gurugram Public School',
  owner: 'Mr. Prabhat Kumar',
  type: 'School',
  address: 'NH33, Sheetal Kunj, Hearngunj, Hazaribagh, Jharkhand - 825301',
  country: 'India',
  state: 'Jharkhand',
  email: 'gurugramhbag@gmail.com',
  phone: '+91 9955367376',
  gateway: 'Razorpay',
  razorpayAccount: 'Afham Warsi'
};

const policyNav = [
  ['Privacy Policy', '/privacy-policy', 'privacy-policy'],
  ['Refund Policy', '/refund-policy', 'refund-policy'],
  ['Terms & Conditions', '/terms-and-conditions', 'terms-and-conditions'],
  ['Disclaimer', '/disclaimer', 'disclaimer'],
  ['Cancellation Policy', '/cancellation-policy', 'cancellation-policy']
];

const policies = {
  'privacy-policy': {
    title: 'Privacy Policy',
    eyebrow: 'Data Protection',
    summary: 'How Gurugram Public School collects, uses, protects, updates, and deletes personal information submitted through gurugrambush.com.',
    seo: 'Privacy Policy for Gurugram Public School, Hazaribagh, covering admission data, student verification, payment security, and user rights.',
    sections: [
      {
        heading: 'Information We Collect',
        body: [
          'We may collect student name, parent or guardian phone number, email address, residential address, class or admission details, and payment reference information submitted through forms or the school portal.',
          'Payment card, UPI, banking, and wallet details are processed through Razorpay. The school website does not intentionally store sensitive payment instrument details.'
        ]
      },
      {
        heading: 'Purpose of Collection',
        list: [
          'Processing admission enquiries and admission applications.',
          'Verifying student identity before fee payment.',
          'Managing school fee records, receipts, and payment support.',
          'Contacting parents or students for school-related communication.'
        ]
      },
      {
        heading: 'Payment and Database Security',
        body: [
          'Online payments are routed through Razorpay secure payment infrastructure. Payment records stored by the school are limited to transaction identifiers, order references, payment status, amount, and linked student details.',
          'Reasonable technical and administrative safeguards are used to protect school records, including controlled database access and secure server-side validation.'
        ]
      },
      {
        heading: 'Data Correction and Deletion',
        body: [
          `Parents, guardians, and eligible users may request correction, deletion, or modification of personal information by contacting ${school.email}. Certain records may be retained where required for fee, audit, legal, or academic administration.`
        ]
      }
    ]
  },
  'refund-policy': {
    title: 'Refund Policy',
    eyebrow: 'Fee Refunds',
    summary: 'Refund rules for duplicate payments, technical payment failures, admission cancellation requests, and applicable UGC refund guidelines.',
    seo: 'Refund Policy for Gurugram Public School fee payments through Razorpay, including duplicate payment, cancellation, UGC guideline, and refund timeline information.',
    sections: [
      {
        heading: 'Eligible Refund Cases',
        list: [
          'Duplicate fee payment for the same student and same fee demand.',
          'Technical payment failure where money is debited but the school does not receive a successful payment confirmation.',
          'Admission cancellation approved by the school office after verification of the written request.'
        ]
      },
      {
        heading: 'Refund Processing',
        body: [
          'Approved refunds are normally processed within 5-7 business days after verification. Bank, Razorpay, or payment-network settlement timelines may vary after the school initiates a refund.',
          'Refunds are generally sent to the original payment method used for the transaction. Administrative, gateway, or processing charges may be non-refundable where applicable.'
        ]
      }
    ]
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    eyebrow: 'Website Terms',
    summary: 'Rules for using the school website, admission services, student verification, online fee payment, and digital school content.',
    seo: 'Terms and Conditions for Gurugram Public School website, admission forms, student portal, and Razorpay fee payment services.',
    sections: [
      {
        heading: 'Use of Website and Portal',
        list: [
          'Users must provide correct, complete, and genuine information.',
          'Fake student details, false admission information, impersonation, or misuse of the portal is strictly prohibited.',
          'Admission requests remain subject to document verification, seat availability, internal school rules, and final approval by the school.'
        ]
      },
      {
        heading: 'Fees and Payments',
        body: [
          'Fees paid through the website are processed using Razorpay. A payment alone does not guarantee admission unless the school confirms admission approval.',
          'Fees once paid may be non-refundable except where the Refund Policy, Cancellation Policy, school approval, or applicable law provides otherwise.'
        ]
      },
      {
        heading: 'Content and Intellectual Property',
        body: [
          'Website text, graphics, layout, school content, policy wording, and digital material may not be copied, redistributed, or used commercially without written permission from Gurugram Public School.'
        ]
      },
      {
        heading: 'Technical Availability and Law',
        body: [
          'The school is not responsible for temporary downtime, internet failure, payment-gateway interruption, browser incompatibility, or third-party service disruption.',
          'These terms are governed by the laws of India, with applicable jurisdiction in Jharkhand, India.'
        ]
      }
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    eyebrow: 'Important Notice',
    summary: 'General limitations for website information, admissions, documents, payments, gateway processing, and school communication.',
    seo: 'Disclaimer for Gurugram Public School website information, admission process, document verification, and Razorpay payment processing.',
    sections: [
      {
        heading: 'General Information',
        body: [
          'The information on this website is provided for general informational and school communication purposes. While reasonable care is taken to keep information accurate, the school may update content, dates, fee details, or policies as required.'
        ]
      },
      {
        heading: 'Admission Disclaimer',
        body: [
          'Submission of an enquiry form, admission form, or payment does not automatically guarantee admission. Admission depends on document verification, eligibility, seat availability, school rules, and approval by the school authority.'
        ]
      },
      {
        heading: 'Payment Disclaimer',
        body: [
          `Payment processing is handled by ${school.gateway}. Transaction success, settlement, chargeback handling, and gateway availability may involve Razorpay systems, banking networks, and the user's payment provider.`
        ]
      }
    ]
  },
  'cancellation-policy': {
    title: 'Cancellation Policy',
    eyebrow: 'Admission Cancellation',
    summary: 'How users can request cancellation before admission approval or fee verification and how approved requests are processed.',
    seo: 'Cancellation Policy for Gurugram Public School admission and fee verification requests.',
    sections: [
      {
        heading: 'When Cancellation May Be Requested',
        list: [
          'Before final admission approval by the school.',
          'Before fee verification is completed by the school office.',
          'Where a written request is submitted by the parent, guardian, or applicant using the registered contact details.'
        ]
      },
      {
        heading: 'How to Request Cancellation',
        body: [
          `Cancellation requests must be emailed to ${school.email} with the student name, registered phone number, payment reference if any, reason for cancellation, and supporting documents where required.`
        ]
      },
      {
        heading: 'Timeline and Deductions',
        body: [
          'Cancellation requests are normally reviewed within 3-5 business days. Processing fee deductions, administrative charges, or gateway charges may apply depending on the admission stage and payment status.'
        ]
      }
    ]
  }
};

const refundCases = [
  ['Duplicate payment', 'Eligible after transaction and student-record verification', '5-7 business days after approval'],
  ['Technical payment failure', 'Eligible if amount is debited and not marked successful by school records', '5-7 business days after gateway/bank confirmation'],
  ['Admission cancellation', 'Subject to school approval, admission stage, and applicable deductions', '5-7 business days after approval']
];

const ugcTimeline = [
  ['15 days or more before formally notified last date of admission', '100%'],
  ['Less than 15 days before formally notified last date of admission', '90%'],
  ['15 days or less after formally notified last date of admission', '80%'],
  ['30 days or less, but more than 15 days after formally notified last date of admission', '50%'],
  ['More than 30 days after formally notified last date of admission', '0%']
];

function toPolicySlug(pathnamePolicy, routePolicy) {
  return routePolicy || pathnamePolicy.replace(/^\//, '') || 'privacy-policy';
}

function SeoMeta({ policy }) {
  useEffect(() => {
    document.title = `${policy.title} | ${school.name}`;

    const description = document.querySelector('meta[name="description"]') || document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', policy.seo);
    document.head.appendChild(description);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `https://${school.website}${window.location.hash ? `/#${window.location.pathname}` : window.location.pathname}`);
    document.head.appendChild(canonical);
  }, [policy]);

  return null;
}

function PolicySection({ section }) {
  return (
    <article className="legal-card">
      <h2>{section.heading}</h2>
      {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.list && (
        <ul>
          {section.list.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
    </article>
  );
}

function RefundSpecialContent() {
  return (
    <>
      <article className="legal-card legal-alert-card">
        <ShieldCheck size={22} />
        <div>
          <h2>Student Refund Notice</h2>
          <p>Refunds are approved only after matching student details, payment records, Razorpay transaction references, and school office records. Payment gateway should not be treated as proof of admission approval.</p>
        </div>
      </article>

      <article className="legal-card table-panel">
        <h2>School Refund Timeline</h2>
        <table className="legal-table">
          <thead>
            <tr><th>Refund case</th><th>Eligibility</th><th>Typical processing time</th></tr>
          </thead>
          <tbody>
            {refundCases.map(([type, eligibility, timeline]) => (
              <tr key={type}><td>{type}</td><td>{eligibility}</td><td>{timeline}</td></tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="legal-card">
        <h2>UGC Refund Guidelines</h2>
        <p>The uploaded University Grants Commission Fee Refund Policy 2024-25 states that higher education institutions should provide full refund for admission cancellation or migration up to 30 September 2024, and may deduct not more than Rs. 1,000 as processing fee up to 31 October 2024.</p>
        <p>For admission schedules extending or commencing beyond 31 October 2024, the PDF reproduces the UGC refund percentage table linked to the formally notified last date of admission. Refund processing by Gurugram Public School may follow applicable UGC regulations wherever applicable.</p>
        <div className="ugc-grid">
          {ugcTimeline.map(([timeline, refund]) => (
            <div className="ugc-item" key={timeline}>
              <strong>{refund}</strong>
              <span>{timeline}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="legal-card pdf-card">
        <div>
          <span className="eyebrow">Official Reference</span>
          <h2>UGC Refund Policy PDF</h2>
          <p>Preview or download the uploaded UGC Refund Policy document for reference. If the preview does not load on a mobile browser, use the download button.</p>
          <a className="primary-button" href={ugcPdfUrl} download>
            <Download size={18} /> Download UGC Refund Policy
          </a>
        </div>
        <iframe title="UGC Refund Policy PDF preview" src={ugcPdfUrl} />
      </article>
    </>
  );
}

function SupportCard() {
  return (
    <article className="legal-support">
      <div>
        <span className="eyebrow">Need Help?</span>
        <h2>Contact School Support</h2>
        <p>For privacy, refund, cancellation, or payment support, contact the school office with the student name and transaction reference where applicable.</p>
      </div>
      <div className="legal-contact-list">
        <p><MapPin size={18} /> {school.address}</p>
        <p><Mail size={18} /> <a href={`mailto:${school.email}`}>{school.email}</a></p>
        <p><Phone size={18} /> <a href={`tel:${school.phone.replace(/\s/g, '')}`}>{school.phone}</a></p>
        <p><FileText size={18} /> Owner: {school.owner} | Business Type: {school.type}</p>
      </div>
    </article>
  );
}

export function LegalPage({ policy: propPolicy }) {
  const { policy: routePolicy } = useParams();
  const location = useLocation();
  const slug = toPolicySlug(propPolicy || routePolicy || '', routePolicy);
  const policy = policies[slug];

  if (!policy) return <Navigate to="/privacy-policy" replace />;

  return (
    <section className="legal-page-shell">
      <SeoMeta policy={policy} />
      <div className="legal-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{policy.title}</span>
        </nav>
        <span className="eyebrow">{policy.eyebrow}</span>
        <h1>{policy.title}</h1>
        <p>{policy.summary}</p>
        <div className="legal-meta">
          <span>Last Updated: {lastUpdated}</span>
          <span>{school.name}</span>
          <span>{school.state}, {school.country}</span>
        </div>
      </div>

      <div className="legal-layout">
        <aside className="legal-side-nav" aria-label="Policy navigation">
          <strong>Legal Policies</strong>
          {policyNav.map(([label, href, key]) => (
            <Link key={key} to={href} className={location.pathname === href || slug === key ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </aside>

        <div className="legal-content">
          <article className="legal-card legal-identity">
            <div><strong>Website</strong><span>{school.website}</span></div>
            <div><strong>School</strong><span>{school.name}</span></div>
            <div><strong>Payment Gateway</strong><span>{school.gateway}</span></div>
            <div><strong>Razorpay Account</strong><span>{school.razorpayAccount}</span></div>
          </article>

          {policy.sections.map((section) => <PolicySection key={section.heading} section={section} />)}
          {slug === 'refund-policy' && <RefundSpecialContent />}
          <SupportCard />
        </div>
      </div>
    </section>
  );
}
