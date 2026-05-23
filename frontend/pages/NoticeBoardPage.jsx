import { useEffect, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader.jsx';
import { apiClient } from '../services/apiClient.js';

const fallbackNotices = [
  'Admission interaction schedule published',
  'Transport fee payment window open',
  'Class X board preparation circular',
  'Summer camp registration live'
];

export function NoticeBoardPage() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    apiClient('/notices')
      .then(setNotices)
      .catch(() => setNotices([]));
  }, []);

  const visibleNotices = notices.length
    ? notices.map((notice) => ({ title: notice.title, meta: notice.audience || 'All' }))
    : fallbackNotices.map((notice) => ({ title: notice, meta: 'View circular' }));

  return (
    <section className="content-section page-pad">
      <span className="notice-label notice-label-dark">Latest Updates</span>
      <SectionHeader eyebrow="Notice Board" title="Important updates, clearly organized">
        Admin-managed circulars, downloads, alerts, and school communication.
      </SectionHeader>
      <div className="notice-list">
        {visibleNotices.map((notice, index) => (
          <article key={`${notice.title}-${index}`}>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <p>{notice.title}</p>
            <span>{notice.meta}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
