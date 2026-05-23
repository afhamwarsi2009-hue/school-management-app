import { SectionHeader } from '../components/SectionHeader.jsx';

const faculty = ['Academic Leadership', 'Science Faculty', 'Mathematics Faculty', 'Humanities Faculty', 'Sports Mentors', 'Arts and Music Faculty'];
const facultyImages = ['/images/school-group.png', '/images/school-activity.png', '/images/sports-activity.png', '/images/campaign-group.png'];

export function FacultyPage() {
  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="Faculty and Staff" title="Educators who mentor, guide, and inspire">
        Faculty profiles are ready to connect with the backend teacher management system.
      </SectionHeader>
      <div className="people-grid">
        {faculty.map((name, index) => (
          <article className="person-card" key={name}>
            <img src={facultyImages[index % facultyImages.length]} alt={`${name} at Gurugram Public School`} />
            <h3>{name}</h3>
            <p>Dedicated to premium learning outcomes and student wellbeing.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
