import { motion, useReducedMotion } from 'framer-motion';

const HERO = {
  person: {
    src: '/assets/hero-person-hd.png',
    alt: 'Futuristic strategist in a white hood with an orange visor, centered in the SeeGrowth hero',
    width: 904,
    height: 986,
  },
  leftArt: {
    src: '/assets/hero-glass-rings.webp',
    width: 900,
    height: 1224,
  },
};

const HEADLINE = [
  { words: ['WE', 'HELP', 'YOU', 'SEE'] },
  { words: ['GROWTH', 'AND', 'BUILD', 'IT', '.'], accent: true },
];

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="hero hero-bento" id="home">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-stage">
        <motion.div
          className="hero-art hero-art--left"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.05, delay: 0.18, ease }}
          aria-hidden="true"
        >
          <img
            src={HERO.leftArt.src}
            alt=""
            width={HERO.leftArt.width}
            height={HERO.leftArt.height}
            decoding="async"
            draggable={false}
          />
        </motion.div>

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
                      className={`hero-word${word === 'GROWTH' || word === '.' ? ' hero-word--accent' : ''}${word === '.' ? ' hero-word--period' : ''}`}
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
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
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
      </div>
    </section>
  );
}
