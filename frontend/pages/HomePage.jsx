import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Bus,
  CalendarDays,
  CreditCard,
  Download,
  FlaskConical,
  Lightbulb,
  Medal,
  Mic,
  Music,
  Newspaper,
  Palette,
  Quote,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/SectionHeader.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { WelcomeSection } from '../components/WelcomeSection.jsx';
import schoolLogo from '../assets/school-logo.png';

const directorPhoto = '/images/director.png';
const schoolGroupImage = '/images/school-group.png';
const schoolActivityImage = '/images/school-activity.png';
const sportsActivityImage = '/images/sports-activity.png';
const campaignGroupImage = '/images/campaign-group.png';

const accessCards = [
  ['Student Portal', 'Attendance, results, homework, timetable, and downloads.', '/student', Users],
  ['Parent Portal', 'Progress tracking, fee status, notifications, and payments.', '/parent', ShieldCheck],
  ['Fee Payment', 'Tuition, admission, exam, and transport fees with receipts.', '/payments', CreditCard],
  ['Admin Panel', 'Admissions, content, teachers, students, and payment history.', '/admin', Award]
];

const facilities = [
  ['Laboratories', 'Science spaces, practical demonstrations, and hands-on academic discovery.', FlaskConical],
  ['Library', 'A quiet reading and research environment for reflection, vocabulary, and inquiry.', BookOpen],
  ['Sports', 'Open grounds, fitness routines, team games, and structured physical education.', Trophy],
  ['Dance and Music', 'Creative expression through performance, rhythm, confidence, and culture.', Music]
];

const activities = [
  ['Sports', 'Structured coaching, fitness habits, inter-house games, and confident performance.', Trophy, sportsActivityImage],
  ['Cultural Programs', 'Stage confidence, music, dance, theatre, and celebration of Indian values.', Music, campaignGroupImage],
  ['Science Exhibition', 'Hands-on experiments, models, innovation showcases, and inquiry-led learning.', FlaskConical, '/images/science-exhibition.svg'],
  ['Debate & Quiz', 'Public speaking, current affairs, reasoning, and healthy academic competition.', Mic, '/images/debate-quiz.svg'],
  ['NCC/NSS', 'Discipline, service, citizenship, teamwork, and social responsibility in action.', Medal, '/images/ncc-nss.svg'],
  ['Art & Creativity', 'Visual expression, craft, design thinking, and creative confidence.', Palette, '/images/arts-creativity.svg']
];

const beyond = [
  ['Student Leadership', 'Prefectorial roles, assembly ownership, peer mentoring, and responsible decision-making.', Users],
  ['Arts & Creativity', 'Fine arts, performance, craft, and creative showcases that build expression.', Palette],
  ['Clubs & Societies', 'Interest-led groups for science, environment, literature, technology, and service.', Users],
  ['Sports Excellence', 'Daily fitness, team spirit, coaching, and school-level competitions.', Trophy],
  ['Reading Program', 'Library culture, reading circles, vocabulary growth, and reflective writing.', BookMarked],
  ['Innovation & Technology', 'Smart classrooms, digital confidence, experiments, and future-ready skills.', Lightbulb]
];

const notices = [
  ['22 May', 'Admission interaction schedule published', 'Admissions'],
  ['24 May', 'Transport fee payment window open', 'Accounts'],
  ['27 May', 'Class X board preparation circular', 'Academics']
];

const galleryImages = [
  { src: schoolGroupImage, alt: 'Gurugram Public School group in front of campus' },
  { src: schoolActivityImage, alt: 'Gurugram Public School activity on sports field' },
  { src: sportsActivityImage, alt: 'Students running on the school ground' },
  { src: campaignGroupImage, alt: 'Road safety campaign with Gurugram Public School students' }
];

export function HomePage() {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <>
      <section className="gps-hero">
        <div className="gps-hero-orb gps-hero-orb-one" />
        <div className="gps-hero-orb gps-hero-orb-two" />
        <div className="gps-hero-content">
          <motion.img
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="gps-hero-logo"
            src={schoolLogo}
            alt="Gurugram Public School logo"
          />
          <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
            WELCOME TO GURUGRAM PUBLIC SCHOOL
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            A school designed for character, curiosity, leadership, and global readiness
          </motion.h1>
          <p>
            We combine academic excellence, discipline, creativity, innovation, sports, technology, and Indian values
            to prepare confident and compassionate future leaders.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/about">
              Explore More <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button dark" to="/admissions">Admission Enquiry</Link>
          </div>
        </div>

        <motion.div
          className="gps-hero-visual"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={schoolGroupImage} alt="Gurugram Public School students and staff" loading="eager" decoding="async" />
          <div className="gps-floating-stats">
            {['20+ Years Excellence', 'Smart Classrooms', 'Sports Excellence', 'Experienced Faculty'].map((item, index) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08, duration: 0.45 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="gps-stat-row">
        <StatCard value="20+" label="Years Excellence" />
        <StatCard value="Smart" label="Classrooms" />
        <StatCard value="Sports" label="Excellence" />
        <StatCard value="Expert" label="Faculty" />
      </section>

      <WelcomeSection />

      <section className="director-message-section">
        <motion.figure
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={directorPhoto} alt="Prabhat Kumar, Director of Gurugram Public School" loading="lazy" decoding="async" />
        </motion.figure>
        <div>
          <Quote className="principal-quote-icon" size={42} />
          <SectionHeader eyebrow="Director's Message" title="A vision for confident, value-led future leaders">
            At Gurugram Public School, our purpose is to create a disciplined, caring, and ambitious learning culture
            where children grow with character, curiosity, and readiness for the world ahead.
          </SectionHeader>
          <div className="principal-signature">
            <strong>Prabhat Kumar</strong>
            <span>Director</span>
          </div>
          <Link className="text-link" to="/about">Explore Vision <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="vision-mission">
        <article>
          <span>Our Vision</span>
          <h2>Future-ready learners with integrity and imagination</h2>
          <p>We nurture young minds through academic excellence, ethical values, technology, creativity, and global awareness.</p>
        </article>
        <article>
          <span>Our Mission</span>
          <h2>Inclusive, high-performance learning culture</h2>
          <p>We build a positive campus where students learn deeply, lead responsibly, and contribute meaningfully to society.</p>
        </article>
      </section>

      <section className="content-section">
        <SectionHeader eyebrow="Digital Campus" title="Everything families need in one secure platform">
          Student, parent, admin, admissions, payment, and communication workflows are connected through role-based access.
        </SectionHeader>
        <div className="feature-grid">
          {accessCards.map(([title, text, to, Icon]) => (
            <Link className="feature-card interactive-card" key={title} to={to}>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="activities-section" id="activities">
        <SectionHeader eyebrow="Activities" title="A vibrant campus for confidence and expression">
          Leadership, service, creativity, fitness, environment, and civic responsibility are woven into everyday school life.
        </SectionHeader>
        <div className="activity-card-grid">
          {activities.map(([title, text, Icon, image], index) => (
            <motion.article
              className="activity-card"
              key={title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.04, duration: 0.5 }}
            >
              <img src={image} alt={`${title} at Gurugram Public School`} loading="lazy" decoding="async" />
              <div>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeader eyebrow="Facilities" title="Premium spaces for all-round development">
          Education transcends academics through labs, libraries, activity rooms, performance studios, sports, and technology-rich classrooms.
        </SectionHeader>
        <div className="feature-grid">
          {facilities.map(([title, text, Icon]) => (
            <article className="feature-card" key={title}>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="transport-band">
        <div>
          <span>School Transport</span>
          <h2>Safe, GPS-enabled, professionally managed routes</h2>
          <p>Fleet management, trained staff, route discipline, and parent communication create a safer daily commute.</p>
        </div>
        <Bus size={72} />
      </section>

      <section className="content-section beyond-section">
        <SectionHeader eyebrow="Beyond Academics" title="Leadership, creativity, fitness, and innovation">
          A premium school experience gives students room to discover talents and build confidence.
        </SectionHeader>
        <div className="beyond-card-grid">
          {beyond.map(([title, text, Icon]) => (
            <article className="beyond-card" key={title}>
              <Icon size={26} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notice-board-preview">
        <div>
          <span className="notice-label">Latest Updates</span>
          <SectionHeader eyebrow="Notice Board" title="Important school communication" />
          <div className="notice-card-row">
            {notices.map(([date, notice, category]) => (
              <article className="notice-preview-card" key={notice}>
                <strong>{date}</strong>
                <div>
                  <span>{category}</span>
                  <p><Newspaper size={18} /> {notice}</p>
                </div>
              </article>
            ))}
          </div>
          <Link className="text-link light" to="/notice-board">View All Notices <ArrowRight size={16} /></Link>
        </div>
        <div className="testimonial notice-event-card">
          <CalendarDays size={26} />
          <h3>Upcoming Events</h3>
          <p>Innovation Expo, Annual Sports Week, MUN, faculty workshops, and sustainability drives.</p>
          <Link to="/events-news">Explore Events</Link>
        </div>
      </section>

      <section className="content-section gallery-preview">
        <SectionHeader eyebrow="Gallery" title="A vibrant campus in pictures">
          Activities, achievements, performances, excursions, labs, and leadership moments.
        </SectionHeader>
        <div className="premium-masonry-gallery">
          {galleryImages.map((image, index) => (
            <button key={image.src} type="button" className={`gallery-tile tile-${index + 1}`} onClick={() => setPreviewImage(image)}>
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </section>

      <section className="work-section">
        <div>
          <span>Work With Us</span>
          <h2>Join the Gurugram Public School family</h2>
          <p>Collaborative faculty culture, training, innovation, and a premium environment for shaping future leaders.</p>
        </div>
        <Link className="primary-button" to="/contact">Apply / Enquire <Sparkles size={18} /></Link>
      </section>

      <a className="whatsapp-float" href="https://wa.me/919999999999" target="_blank" rel="noreferrer">WhatsApp</a>
      <a className="download-float" href="/#/notice-board"><Download size={18} /> Circulars</a>
      {previewImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image preview" onClick={() => setPreviewImage(null)}>
          <button type="button" aria-label="Close gallery preview" onClick={() => setPreviewImage(null)}><X size={22} /></button>
          <img src={previewImage.src} alt={previewImage.alt} />
        </div>
      )}
    </>
  );
}
