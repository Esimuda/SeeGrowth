import { motion, useReducedMotion } from 'framer-motion';

const HERO = {
  person: {
    src: '/assets/hero-person-hd.png',
    alt: 'Futuristic strategist in a white hood with an orange visor, centered in the SeeGrowth hero',
    width: 904,
    height: 986,
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

const HEADLINE = [
  { words: ['We', 'Help', 'You', 'See'] },
  { words: ['Growth'], accent: true },
];

const ease = [0.22, 1, 0.36, 1];

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
          {HEADLINE.map((line, lineIndex) => {
            let wordOffset = HEADLINE.slice(0, lineIndex).reduce((sum, row) => sum + row.words.length, 0);

            return (
              <span
                key={`line-${lineIndex}`}
                className={`hero-headline__line${line.accent ? ' hero-headline__line--accent' : ''}`}
              >
                {line.words.map((word, wordIndex) => {
                  const i = wordOffset + wordIndex;

                  return (
                    <span
                      key={`${word}-${i}`}
                      className={`hero-word${line.accent || word.toLowerCase() === 'growth' ? ' hero-word--accent' : ''}`}
                    >
                      <motion.span
                        initial={reduce ? false : { y: '110%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.12 + i * 0.08, ease: [0.76, 0, 0.24, 1] }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            );
          })}
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
