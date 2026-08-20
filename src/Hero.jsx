import { motion, useReducedMotion } from 'framer-motion';

const HERO = {
  headline: 'We Help You See Growth',
  person: {
    src: '/assets/hero-person-hd.webp',
    alt: 'Futuristic strategist in a white hood with an orange visor, centered in the SeeGrowth hero',
    width: 1024,
    height: 1024,
  },
  socialProof: {
    count: '200+',
    label: 'Happy clients around the world',
    rating: '5 Stars',
    href: '#testimonials',
    avatars: [
      { src: '/assets/avatar-john.jpg', alt: 'John Adams' },
      { src: '/assets/avatar-jane.jpg', alt: 'Jane Does' },
      { src: '/assets/avatar-michael.jpg', alt: 'Michael Anderson' },
    ],
  },
};

const ease = [0.22, 1, 0.36, 1];
const words = HERO.headline.split(' ');

function floatAnim(delay, distance = 10) {
  return {
    y: [0, -distance, 0],
    transition: { duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay },
  };
}

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="hero hero-bento" id="home">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-stage">
        <h1 className="hero-headline">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className={`hero-word${word.toLowerCase() === 'growth' ? ' hero-word--accent' : ''}`}
            >
              <motion.span
                initial={reduce ? false : { y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.12 + i * 0.08, ease: [0.76, 0, 0.24, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="hero-person"
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.28, ease }}
        >
          <img
            src={HERO.person.src}
            alt={HERO.person.alt}
            width={HERO.person.width}
            height={HERO.person.height}
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>

        <motion.div
          className="hero-slot hero-slot--users"
          initial={reduce ? false : { opacity: 0, x: -36, y: 24 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.75, delay: 0.7, ease }}
        >
          <motion.a
            href={HERO.socialProof.href}
            className="hero-card hero-card--users"
            animate={reduce ? undefined : floatAnim(1.1, 12)}
            whileHover={reduce ? undefined : { y: -10, boxShadow: '0 22px 56px rgba(242,100,25,0.42), inset 0 1px 0 rgba(255,255,255,0.24)' }}
          >
            <motion.span
              className="users-go"
              aria-hidden="true"
              initial={reduce ? false : { scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 1.15 }}
            >
              <ArrowRight />
            </motion.span>
            <p className="users-count">{HERO.socialProof.count}</p>
            <p className="users-label">{HERO.socialProof.label}</p>
            <div className="users-meta">
              <div className="users-avatars">
                {HERO.socialProof.avatars.map((avatar) => (
                  <img key={avatar.src} src={avatar.src} alt={avatar.alt} />
                ))}
              </div>
              <span className="users-stars">
                <Star />
                {HERO.socialProof.rating}
              </span>
            </div>
          </motion.a>
        </motion.div>

        <motion.svg
          className="hero-scribble"
          viewBox="0 0 180 130"
          fill="none"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <motion.path
            d="M18 22C46 8 92 6 124 28c26 18 38 42 22 62-18 22-62 28-46 8 10-12 48-8 72 10"
            stroke="#F26419"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.45, delay: 1.05, ease: 'easeInOut' }}
          />
          <motion.path
            d="M154 86l18 16-22 2"
            stroke="#F26419"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 2.2, ease }}
          />
        </motion.svg>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.7 6.6 7.1.6-5.4 4.5 1.7 6.8L12 17.8 5.9 21l1.7-6.8L2.2 9.7l7.1-.6L12 2.5z" />
    </svg>
  );
}
