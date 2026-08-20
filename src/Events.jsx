import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const SLIDES = [
  {
    id: 'launch',
    theme: '#F26419',
    shell: '#7a2e0f',
    label: 'Growth Launch',
    left: {
      src: '/assets/events/event-1a.webp',
      alt: 'Audience at a SeeGrowth launch night',
    },
    right: {
      src: '/assets/service-paid-rocket.webp',
      alt: 'Iridescent rocket marking launch energy',
      object: true,
    },
  },
  {
    id: 'signal',
    theme: '#111111',
    shell: '#2a1212',
    label: 'Signal Sessions',
    left: {
      src: '/assets/events/event-2a.webp',
      alt: 'Modern conference hall ready for Signal Sessions',
    },
    right: {
      src: '/assets/events/event-2b.webp',
      alt: 'Speaker presenting on stage',
    },
  },
  {
    id: 'studio',
    theme: '#1f6b4a',
    shell: '#123528',
    label: 'Studio Labs',
    left: {
      src: '/assets/events/event-3a.webp',
      alt: 'Workshop crowd during Studio Labs',
    },
    right: {
      src: '/assets/service-brand-star.webp',
      alt: 'Iridescent star for brand systems',
      object: true,
    },
  },
  {
    id: 'circle',
    theme: '#3d6ea5',
    shell: '#1d334d',
    label: 'Founders Circle',
    left: {
      src: '/assets/events/event-4a.webp',
      alt: 'Founders Circle networking dinner',
    },
    right: {
      src: '/assets/service-content-torus.webp',
      alt: 'Iridescent torus for community loops',
      object: true,
    },
  },
];

const ease = [0.22, 1, 0.36, 1];

export default function Events() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[index];

  const go = useCallback(
    (dir) => {
      setDirection(dir);
      setIndex((current) => (current + dir + SLIDES.length) % SLIDES.length);
    },
    []
  );

  useEffect(() => {
    if (reduce || paused) return undefined;
    const id = window.setInterval(() => go(1), 4200);
    return () => window.clearInterval(id);
  }, [go, paused, reduce]);

  return (
    <section className="events" id="events" aria-label="SeeGrowth events">
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
        <div className="events-brand" aria-hidden="true">
          <span>SeeGrowth</span>
          <i />
        </div>

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
      className={`events-panel${panel.object ? ' events-panel--object' : ''}`}
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
