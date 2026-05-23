import { CalendarDays } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader.jsx';

const events = ['Innovation Expo 2026', 'Model United Nations', 'Annual Sports Week', 'Environmental Leadership Drive'];

export function EventsNewsPage() {
  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="Events and News" title="A living campus calendar">
        Upcoming events and recent updates can be managed from the admin content panel.
      </SectionHeader>
      <div className="news-grid">
        {events.map((event) => (
          <article className="news-card" key={event}>
            <CalendarDays size={22} />
            <span>May 2026</span>
            <h3>{event}</h3>
            <p>Curated school experiences that connect academics, leadership, arts, service, and community.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
