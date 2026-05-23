import { Quote } from 'lucide-react';
import schoolLogo from '../assets/gurugram-school-logo.png';

const principalPhoto = '/images/principal.png';

const defaultMessage = [
  'At Gurugram Public School, education is a promise to help every learner grow with confidence, discipline, curiosity, and compassion. We value academic excellence, but we also believe that character, creativity, and service give learning its lasting strength.',
  'Our classrooms are spaces where students are encouraged to ask thoughtful questions, work with purpose, and meet challenges with courage. With the support of our teachers and families, we strive to prepare young people who are rooted in values and ready for the opportunities ahead.'
];

function SchoolMasthead({ logo, schoolName, tagline }) {
  return (
    <header className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
      <div className="grid size-24 place-items-center overflow-hidden rounded-full border border-[#cda04c]/60 bg-[#fffaf0]/90 p-2 shadow-[0_20px_50px_rgba(11,36,68,0.14)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(11,36,68,0.2)] sm:size-28">
        <img className="h-full w-full rounded-full object-cover" src={logo} alt={`${schoolName} logo`} />
      </div>
      <h1 className="mt-5 font-serif text-3xl font-semibold uppercase leading-tight text-[#0b2444] sm:text-5xl lg:whitespace-nowrap lg:text-6xl">
        {schoolName}
      </h1>
      <div className="mt-4 flex w-full max-w-2xl items-center gap-3 text-[#c08b31]">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d7ab5b] to-[#d7ab5b]" />
        <span className="size-2 rotate-45 border border-[#d7ab5b] bg-[#fff6df]" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d7ab5b] to-[#d7ab5b]" />
      </div>
      <p className="mt-4 font-serif text-sm font-semibold uppercase text-[#16355d] sm:text-xl">
        {tagline}
      </p>
    </header>
  );
}

function PrincipalPortrait({ photo, principalName }) {
  return (
    <figure className="group relative mx-auto w-full max-w-xl self-center lg:justify-self-end">
      <span className="absolute -inset-3 rounded-[1.75rem] border border-[#d3a14d]/45 bg-[#f6e6bc]/35 shadow-[0_28px_90px_rgba(9,30,57,0.18)] transition duration-500 group-hover:-inset-4 group-hover:border-[#d3a14d]/70" />
      <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-[#c78c2c] bg-[#fff9eb] p-2 shadow-[0_24px_70px_rgba(11,36,68,0.22)]">
        <div className="overflow-hidden rounded-[1rem] bg-[#d9d4cb]">
          <img
            className="aspect-[4/5] w-full object-cover object-[84%_center] transition duration-700 group-hover:scale-[1.035]"
            src={photo}
            alt={`${principalName}, Principal of Gurugram Public School`}
          />
        </div>
      </div>
    </figure>
  );
}

export function PrincipalMessageSection({
  logo = schoolLogo,
  photo = principalPhoto,
  schoolName = 'Gurugram Public School',
  tagline = 'Inspire | Empower | Excel',
  title = 'From the Desk of the Principal',
  principalName = 'Mr. Rajesh Kumar',
  designation = 'Principal',
  message = defaultMessage
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbf4e3] px-4 py-10 text-[#132b4a] sm:px-6 sm:py-14 lg:px-10 lg:py-16">
      <div
        className="absolute inset-0 -z-20 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(191, 144, 61, 0.13) 0 1px, transparent 1.8px), radial-gradient(circle at 80% 15%, rgba(11, 36, 68, 0.08) 0 1px, transparent 1.8px), repeating-linear-gradient(135deg, rgba(255,255,255,0.72) 0 12px, rgba(248,236,207,0.56) 12px 24px)',
          backgroundSize: '34px 34px, 42px 42px, auto'
        }}
      />
      <div className="absolute left-0 top-0 -z-10 h-36 w-36 rounded-br-[9rem] bg-[#0b2444] sm:h-52 sm:w-52 lg:h-72 lg:w-72" />
      <div className="absolute left-0 top-0 -z-10 h-40 w-40 rounded-br-[10rem] border-b-[10px] border-r-[10px] border-[#d8aa59] sm:h-60 sm:w-60 lg:h-80 lg:w-80" />
      <div className="absolute bottom-0 right-0 -z-10 h-36 w-36 rounded-tl-[9rem] bg-[#0b2444] sm:h-52 sm:w-52 lg:h-72 lg:w-72" />
      <div className="absolute bottom-0 right-0 -z-10 h-40 w-40 rounded-tl-[10rem] border-l-[10px] border-t-[10px] border-[#d8aa59] sm:h-60 sm:w-60 lg:h-80 lg:w-80" />

      <div className="relative mx-auto max-w-[92rem] overflow-hidden rounded-[2rem] border border-[#d8b56a]/55 bg-[#fffaf0] px-5 py-8 shadow-[0_28px_100px_rgba(11,36,68,0.13)] sm:px-8 sm:py-10 lg:px-14 lg:py-12">
        <SchoolMasthead logo={logo} schoolName={schoolName} tagline={tagline} />

        <div className="relative z-10 mt-10 grid items-start gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.78fr)] lg:gap-14">
          <article className="max-w-3xl self-center">
            <Quote className="mb-4 text-[#d5a34b]" size={46} />
            <h2 className="text-balance font-serif text-3xl font-semibold leading-tight text-[#8f1f1d] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <div className="mt-5 flex w-48 items-center gap-2 text-[#c58e32]">
              <span className="h-px flex-1 bg-[#d5a34b]" />
              <span className="size-2 rounded-full bg-[#d5a34b]" />
            </div>

            <div className="mt-6 space-y-5 font-serif text-lg leading-8 text-[#243044] sm:text-xl sm:leading-9">
              {message.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <footer className="mt-8 max-w-sm border-t border-[#d9ab59]/70 pt-5 font-serif">
              <div className="mb-4 flex w-44 items-center gap-2 text-[#c58e32]">
                <span className="h-px flex-1 bg-[#d5a34b]" />
                <span className="size-2 rounded-full bg-[#d5a34b]" />
                <span className="h-px w-16 bg-[#d5a34b]" />
              </div>
              <strong className="block text-2xl font-semibold text-[#8f1f1d] sm:text-3xl">
                {principalName}
              </strong>
              <span className="mt-1 block text-lg font-semibold text-[#15355d]">{designation}</span>
              <span className="mt-1 block text-base text-[#15355d]/85">{schoolName}</span>
              <span className="mt-4 block font-['Playfair_Display'] text-2xl italic text-[#c58e32]">Rajesh Kumar</span>
            </footer>
          </article>

          <PrincipalPortrait photo={photo} principalName={principalName} />
        </div>
      </div>
    </section>
  );
}
