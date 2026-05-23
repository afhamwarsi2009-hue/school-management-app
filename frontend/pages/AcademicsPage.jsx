import { SectionHeader } from '../components/SectionHeader.jsx';

const programmes = ['Foundational Years', 'Preparatory School', 'Middle School', 'Secondary School', 'Senior Secondary', 'Skill and Innovation Labs'];

export function AcademicsPage() {
  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="Academics" title="A future-ready academic programme">
        A balanced curriculum across academics, technology, leadership, arts, sports, and environmental stewardship.
      </SectionHeader>
      <div className="feature-grid">
        {programmes.map((item) => (
          <article className="feature-card" key={item}>
            <h3>{item}</h3>
            <p>Structured learning pathways with assessments, projects, mentoring, and parent visibility.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
