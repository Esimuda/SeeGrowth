import { motion, useReducedMotion } from 'framer-motion';

const HERO = {
  art: {
    src: '/assets/hero-glass-rings.webp',
    alt: 'Iridescent glass rings with prismatic light',
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
          className="hero-art"
          initial={reduce ? false : { opacity: 0, x: 36, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.22, ease }}
          aria-hidden="true"
        >
          <img
            src={HERO.art.src}
            alt=""
            width={HERO.art.width}
            height={HERO.art.height}
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </motion.div>
      </div>
    </section>
  );
}
