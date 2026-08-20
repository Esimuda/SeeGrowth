import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const PHOTO_COUNT = 28;

const PHOTOS = Array.from({ length: PHOTO_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  const bust = i < 18 ? '?v=2' : '';
  return {
    id: `photo-${n}`,
    src: `/assets/events/event-photo-${n}.webp${bust}`,
    alt: `Community event photo ${i + 1}`,
  };
});

const LABELS = [
  'Community nights',
  'Team tables',
  'Founders dinners',
  'On-stage moments',
  'Hacker house',
  'Builder meetups',
  'Alliance sessions',
  'Partner rooms',
  'After hours',
  'Studio nights',
  'Signal rooms',
  'Growth circles',
  'Launch tables',
  'Field notes',
];

const SLIDES = Array.from({ length: Math.floor(PHOTO_COUNT / 2) }, (_, i) => ({
  id: `slide-${i + 1}`,
  label: LABELS[i % LABELS.length],
  left: PHOTOS[i * 2],
  right: PHOTOS[i * 2 + 1],
}));

const ease = [0.22, 1, 0.36, 1];

export default function Events() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const slide = SLIDES[index];
  const lightboxOpen = Boolean(lightbox);

  const go = useCallback((dir) => {
    setDirection(dir);
    setIndex((current) => (current + dir + SLIDES.length) % SLIDES.length);
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (reduce || paused || lightboxOpen) return undefined;
    const id = window.setInterval(() => go(1), 4200);
    return () => window.clearInterval(id);
  }, [go, paused, reduce, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, closeLightbox]);

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

      <div
        className="events-shell"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <video
          className="events-shell-video"
          src="/assets/events/events-shell-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
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
              >
                <Panel
                  panel={slide.left}
                  side="left"
                  reduce={reduce}
                  onOpen={() => setLightbox(slide.left)}
                />
                <Panel
                  panel={slide.right}
                  side="right"
                  reduce={reduce}
                  onOpen={() => setLightbox(slide.right)}
                />
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
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="events-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeLightbox}
          >
            <button
              type="button"
              className="events-lightbox-close"
              aria-label="Close image"
              onClick={closeLightbox}
            >
              <CloseIcon />
            </button>

            <motion.img
              className="events-lightbox-image"
              src={lightbox.src}
              alt={lightbox.alt}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Panel({ panel, side, reduce, onOpen }) {
  return (
    <motion.button
      type="button"
      className="events-panel"
      initial={reduce ? false : { opacity: 0, scale: 0.96, y: side === 'left' ? 18 : -18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.65, delay: side === 'left' ? 0.08 : 0.16, ease }}
      onClick={onOpen}
      aria-label={`Open ${panel.alt}`}
    >
      <img src={panel.src} alt={panel.alt} />
    </motion.button>
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
