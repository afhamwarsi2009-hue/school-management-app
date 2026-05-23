import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const principalProfessionalImage = '/images/school-group.png';
const schoolActivityImage = '/images/school-activity.png';
const campaignGroupImage = '/images/campaign-group.png';

const welcomeImages = [
  {
    src: principalProfessionalImage,
    alt: 'Principal of Gurugram Public School',
    className: 'col-span-12 row-span-5 sm:col-span-6 sm:row-span-9 lg:-mt-5',
    imageClassName: 'object-[78%_center]'
  },
  {
    src: schoolActivityImage,
    alt: 'Students taking part in school sports activity',
    className: 'col-span-6 row-span-4 sm:col-span-6 sm:row-span-5 lg:mt-7',
    imageClassName: 'object-center'
  },
  {
    src: campaignGroupImage,
    alt: 'Gurugram Public School campaign group with students and staff',
    className: 'col-span-6 row-span-4 sm:col-span-6 sm:row-span-4',
    imageClassName: 'object-center'
  }
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  })
};

function WelcomeGallery({ images }) {
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[29rem] lg:min-h-[42rem]"
    >
      <div className="absolute inset-4 rounded-[2rem] border border-[#d7a957]/30 bg-white/60 shadow-[0_35px_100px_rgba(11,36,68,0.14)] backdrop-blur-xl" />
      <div className="absolute -right-3 top-12 h-24 w-24 rounded-full border border-[#d7a957]/35 bg-[#f8dfaa]/35 blur-2xl" />
      <div className="relative grid h-full min-h-[29rem] grid-cols-12 grid-rows-9 gap-3 p-3 sm:min-h-[34rem] sm:gap-4 sm:p-5 lg:min-h-[42rem]">
        {images.map(({ src, alt, className, imageClassName }, index) => (
          <motion.figure
            key={alt}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: 0.12 + index * 0.08, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className={`${className} group overflow-hidden rounded-[1.35rem] border border-white/80 bg-white p-1.5 shadow-[0_22px_56px_rgba(8,31,61,0.18)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_76px_rgba(8,31,61,0.25)]`}
          >
            <img
              className={`${imageClassName} h-full w-full rounded-[1rem] object-cover transition duration-700 group-hover:scale-105`}
              src={src}
              alt={alt}
            />
          </motion.figure>
        ))}
      </div>
    </motion.div>
  );
}

export function WelcomeSection({
  eyebrow = 'WELCOME TO GURUGRAM PUBLIC SCHOOL',
  title = 'A school designed for character, curiosity, leadership, and global readiness',
  description = 'We combine academic excellence, discipline, creativity, innovation, sports, technology, and Indian values to prepare confident and compassionate future leaders.',
  ctaLabel = 'Explore More',
  ctaTo = '/about',
  images = welcomeImages
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#fffaf0_50%,#f4f7fb_100%)] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="absolute inset-x-0 top-0 -z-20 h-px bg-gradient-to-r from-transparent via-[#d7a957]/70 to-transparent" />
      <div className="absolute left-0 top-0 -z-20 h-full w-24 border-r border-[#d7a957]/20 bg-[#fff6df]/50 sm:w-36" />
      <div className="absolute bottom-0 right-0 -z-20 h-48 w-48 border-l border-t border-[#0b2444]/10 bg-[#0b2444]/[0.035] sm:h-72 sm:w-72" />

      <div className="mx-auto grid max-w-[92rem] items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(32rem,1fr)] lg:gap-16">
        <div className="max-w-3xl">
          <motion.span
            custom={0}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={reveal}
            className="inline-flex items-center gap-3 text-xs font-bold uppercase text-[#b37a1e] sm:text-sm"
          >
            <span className="h-px w-12 bg-[#d7a957]" />
            {eyebrow}
          </motion.span>

          <motion.h2
            custom={0.08}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            className="mt-5 max-w-4xl text-balance font-serif text-4xl font-semibold leading-[1.04] text-[#0b2444] sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h2>

          <motion.p
            custom={0.16}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            className="mt-6 max-w-2xl border-l-2 border-[#d7a957]/70 pl-5 text-lg leading-8 text-[#4a5668] sm:text-xl sm:leading-9"
          >
            {description}
          </motion.p>

          <motion.div
            custom={0.24}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            className="mt-8"
          >
            <Link
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-[#0b2444] px-7 text-base font-bold !text-white shadow-[0_18px_44px_rgba(11,36,68,0.24)] transition duration-300 hover:-translate-y-1 hover:bg-[#153b68] hover:shadow-[0_24px_58px_rgba(11,36,68,0.32)] focus:outline-none focus:ring-4 focus:ring-[#d7a957]/35"
              to={ctaTo}
            >
              {ctaLabel}
              <ArrowRight className="transition duration-300 group-hover:translate-x-1" size={19} />
            </Link>
          </motion.div>
        </div>

        <WelcomeGallery images={images} />
      </div>
    </section>
  );
}
