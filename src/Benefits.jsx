import { motion, useReducedMotion } from 'framer-motion';

const PARTNERS = ['Web3', 'AI', 'RWA', 'DeFi', 'Solana', 'Growth'];

const CARDS = [
  {
    id: 'brand',
    src: '/assets/benefit-brand.jpg',
    alt: 'Premium stacked product packaging representing a standout brand identity',
    title: 'Elevate Your Brand',
    href: '#services',
  },
  {
    id: 'roi',
    src: '/assets/benefit-roi.jpg',
    alt: 'Performance analytics dashboard showing bounce rate, sessions, and ROI metrics',
    title: 'Maximize ROI',
    href: '#services',
  },
  {
    id: 'tailored',
    src: '/assets/benefit-strategy.jpg',
    alt: 'Refined product still-life for tailored brand and growth strategy',
    title: 'Tailored Solutions',
    href: '#services',
  },
];

const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease },
  },
});

export default function Benefits() {
  const reduce = useReducedMotion();
  const viewport = { once: true, amount: 0.18 };

  return (
    <section className="benefits benefits-editorial" id="benefits">
      <motion.div
        className="benefits-logos"
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={viewport}
      >
        {PARTNERS.map((name, i) => (
          <motion.span
            key={name}
            className={`benefits-logo benefits-logo--${i}`}
            variants={fadeUp(i * 0.06)}
          >
            {name}
          </motion.span>
        ))}
      </motion.div>

      <div className="benefits-intro">
        <motion.div
          className="benefits-intro-left"
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease }}
        >
          <div className="benefits-avatars">
            <img src="/assets/avatar-john.jpg" alt="John Adams" />
            <img src="/assets/avatar-jane.jpg" alt="Jane Does" />
            <img src="/assets/avatar-michael.jpg" alt="Michael Anderson" />
          </div>
          <p>See growth. Scale smart.</p>
        </motion.div>

        <h2 className="benefits-headline">
          {renderHeadline(reduce)}
        </h2>
      </div>

      <div className="benefits-board">
        <BenefitCard card={CARDS[0]} reduce={reduce} delay={0.1} className="benefits-card--left" />

        <motion.a
          href="#case-studies"
          className="benefits-cta"
          initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewport}
          transition={{ duration: 0.65, delay: 0.18, ease }}
          whileHover={reduce ? undefined : { scale: 1.02 }}
        >
          <span>See Case Study</span>
          <span className="benefits-cta-arrow" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </motion.a>

        <BenefitCard card={CARDS[1]} reduce={reduce} delay={0.28} className="benefits-card--mid" />
        <BenefitCard card={CARDS[2]} reduce={reduce} delay={0.22} className="benefits-card--right" />
      </div>
    </section>
  );
}

function renderHeadline(reduce) {
  const lead = 'unlock your success through data-driven marketing – and ';
  const accent = 'strategic creativity';
  const words = lead.trim().split(' ');

  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="benefits-word">
          <motion.span
            initial={reduce ? false : { y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.62, delay: 0.08 + i * 0.045, ease: [0.76, 0, 0.24, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
      <span className="benefits-word benefits-word--accent">
        <motion.span
          initial={reduce ? false : { y: '110%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.62, delay: 0.08 + words.length * 0.045, ease: [0.76, 0, 0.24, 1] }}
        >
          {accent}
        </motion.span>
      </span>
    </>
  );
}

function BenefitCard({ card, reduce, delay, className }) {
  return (
    <motion.article
      className={`benefits-card ${className}`}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay, ease }}
      whileHover={reduce ? undefined : { y: -8 }}
    >
      <div className="benefits-card-media">
        <img src={card.src} alt={card.alt} />
      </div>
      <div className="benefits-card-body">
        <h3>
          <Sparkle />
          {card.title}
        </h3>
        <a href={card.href} className="benefits-more">
          See More
        </a>
      </div>
    </motion.article>
  );
}

function Sparkle() {
  return (
    <svg className="benefits-star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2z" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
