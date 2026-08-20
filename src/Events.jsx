import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const PHOTOS = Array.from({ length: 18 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    src: `/assets/events/event-photo-${n}.webp`,
    alt: `SeeGrowth community event photo ${i + 1}`,
  };
});

const THEMES = [
  { theme: '#F26419', shell: '#7a2e0f', label: 'Community nights' },
  { theme: '#111111', shell: '#1a1212', label: 'Team tables' },
  { theme: '#1f6b4a', shell: '#123528', label: 'Founders dinners' },
  { theme: '#3d6ea5', shell: '#1d334d', label: 'On-stage moments' },
  { theme: '#6b2d5b', shell: '#2d1528', label: 'Hacker house' },
  { theme: '#8a4b1f', shell: '#3a2412', label: 'Builder meetups' },
  { theme: '#2f4f4f', shell: '#1a2a2a', label: 'Alliance sessions' },
  { theme: '#4a3f6b', shell: '#221c33', label: 'Partner rooms' },
  { theme: '#5c3d2e', shell: '#2a1c16', label: 'After hours' },
];

const SLIDES = THEMES.map((theme, i) => ({
  id: `slide-${i + 1}`,
  ...theme,
  left: PHOTOS[i * 2],
  right: PHOTOS[i * 2 + 1],
}));

const ease = [0.22, 1, 0.36, 1];

export default function Events() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[index];

  const go = useCallback((dir) => {
    setDirection(dir);
    setIndex((current) => (current + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (reduce || paused) return undefined;
    const id = window.setInterval(() => go(1), 4200);
    return () => window.clearInterval(id);
  }, [go, paused, reduce]);

  return (
    <section className="events" id="events" aria-label="Community events">
      <div className="events-intro">
        <h2 className="events-headline">
          <span className="events-headline__line">Events built to</span>
          <span className="events-headline__line">
            make <em>growth</em> visible
          </span>
        </h2>
        <p className="events-sub">
          Rooms, stages, and studio nights where Web3 teams meet the operators who scale them.
        </p>
      </div>

      <motion.div
        className="events-shell"
        animate={reduce ? undefined : { backgroundColor: slide.shell }}
        transition={{ duration: 0.7, ease }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="events-stage">
          <button
            type="button"
            className="events-nav events-nav--prev"
            aria-label="Previous event"
            onClick={() => go(-1)}
          >
            <Chevron dir="left" />
          </button>

          <div className="events-viewport">
            <AnimatePresence custom={direction} mode="popLayout" initial={false}>
              <motion.div
                key={slide.id}
                className="events-pair"
                custom={direction}
                variants={reduce ? undefined : pairVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.72, ease }}
                style={{ backgroundColor: slide.theme }}
              >
                <Panel panel={slide.left} side="left" reduce={reduce} />
                <Panel panel={slide.right} side="right" reduce={reduce} />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="events-nav events-nav--next"
            aria-label="Next event"
            onClick={() => go(1)}
          >
            <Chevron dir="right" />
          </button>
        </div>

        <div className="events-meta">
          <p className="events-label">{slide.label}</p>
          <div className="events-dots" role="tablist" aria-label="Event slides">
            {SLIDES.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={item.label}
                className={`events-dot${i === index ? ' is-active' : ''}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
              />
            ))}
          </div>
          <div className="events-stripes" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Panel({ panel, side, reduce }) {
  return (
    <motion.figure
      className="events-panel"
      initial={reduce ? false : { opacity: 0, scale: 0.96, y: side === 'left' ? 18 : -18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.65, delay: side === 'left' ? 0.08 : 0.16, ease }}
    >
      <img src={panel.src} alt={panel.alt} />
    </motion.figure>
  );
}

const pairVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '72%' : '-72%',
    opacity: 0.35,
    scale: 0.94,
  }),
  center: {
    x: '0%',
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? '-72%' : '72%',
    opacity: 0.2,
    scale: 0.94,
  }),
};

function Chevron({ dir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M14.5 6L8.5 12L14.5 18' : 'M9.5 6L15.5 12L9.5 18'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
