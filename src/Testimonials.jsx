import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const TESTIMONIALS = [
  {
    id: 'john',
    quote:
      'SeeGrowth transformed our pipeline. Creative campaigns, sharp targeting, and real growth we could measure week to week.',
    name: 'John Adams',
    role: 'Marketing Director',
    company: 'Helix Finance',
    avatar: '/assets/testimonials/john.webp',
  },
  {
    id: 'michael',
    quote:
      'They made our brand impossible to ignore. Data-backed creative and a system that finally matched how fast we ship.',
    name: 'Michael Anderson',
    role: 'Growth Lead',
    company: 'Allscale',
    avatar: '/assets/testimonials/michael.webp',
  },
  {
    id: 'jane',
    quote:
      'SeeGrowth gave us a competitive edge. Clear strategy, crisp execution, and campaigns that compounded instead of fading.',
    name: 'Jane Does',
    role: 'Founder & CEO',
    company: 'Meridian Labs',
    avatar: '/assets/testimonials/jane.webp',
  },
  {
    id: 'alex',
    quote:
      'Working with SeeGrowth felt effortless. Tailored systems, dedicated operators, and a visible lift in traffic and conversions.',
    name: 'Alex James',
    role: 'Product Marketing',
    company: 'Orbit DAO',
    avatar: '/assets/testimonials/alex.webp',
  },
];

const ease = [0.22, 1, 0.36, 1];

export default function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const active = TESTIMONIALS[index];

  const go = useCallback(
    (dir) => {
      setDirection(dir);
      setIndex((current) => (current + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
    },
    []
  );

  return (
    <section className="testimonials testimonials-showcase" id="testimonials">
      <div className="testimonials-layout">
        <div className="testimonials-copy">
          <h2 className="testimonials-headline">
            <span className="testimonials-headline__line">What clients say</span>
            <span className="testimonials-headline__line">
              when growth finally <em>shows</em>
            </span>
          </h2>

          <p className="testimonials-stat">
            <em>200+</em> teams trusted SeeGrowth to scale what already works.
          </p>

          <div className="testimonials-nav" aria-label="Testimonial navigation">
            <button
              type="button"
              className="testimonials-nav__btn"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
            >
              <NavArrow dir="left" />
            </button>
            <button
              type="button"
              className="testimonials-nav__btn"
              aria-label="Next testimonial"
              onClick={() => go(1)}
            >
              <NavArrow dir="right" />
            </button>
          </div>
        </div>

        <div className="testimonials-stage" aria-live="polite">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={active.id}
              className="testimonials-card"
              custom={direction}
              variants={reduce ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease }}
            >
              <span className="testimonials-quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="testimonials-quote">{active.quote}</p>
              <div className="testimonials-footer">
                <div className="testimonials-person">
                  <img
                    className="testimonials-avatar"
                    src={active.avatar}
                    alt=""
                    width={56}
                    height={56}
                    decoding="async"
                  />
                  <div>
                    <p className="testimonials-name">{active.name}</p>
                    <p className="testimonials-role">{active.role}</p>
                  </div>
                </div>
                <p className="testimonials-company">{active.company}</p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -36 : 36 }),
};

function NavArrow({ dir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {dir === 'left' ? (
        <path
          d="M15 6L9 12l6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
