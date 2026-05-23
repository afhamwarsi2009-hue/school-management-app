import { SectionHeader } from '../components/SectionHeader.jsx';

export function AboutPage() {
  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="About Us" title="A future-ready institution with a human center">
        Gurugram Public School blends academic discipline, technology, creative practice, Indian values, and parent partnership.
      </SectionHeader>
      <div className="info-grid">
        <article><h3>Principal's Message</h3><p>We design learning around confidence, ethics, inquiry, and excellence.</p></article>
        <article><h3>Faculty</h3><p>Teacher profiles, departments, class ownership, and timetable alignment are ready for API data.</p></article>
        <article><h3>Gallery</h3><p>Photos, videos, events, news, and notices live in a content-managed architecture.</p></article>
        <article><h3>FAQ</h3><p>Admissions, payments, transport, documents, refunds, and portal access are covered.</p></article>
      </div>
    </section>
  );
}
