import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const PHOTOS = [
  { id: 1, alt: 'Speaker on stage at HashKey Horizon Hackathon' },
  { id: 2, alt: 'HashKey Chain presentation at Horizon Hackathon' },
  { id: 3, alt: 'Horizon Hackathon finalists with From 0 to Demo signs' },
  { id: 4, alt: 'Horizon Hackathon finalists holding HashKey and event signs' },
  { id: 5, alt: 'Team posing with From 0 to Demo signs at Horizon Hackathon' },
  { id: 6, alt: 'Builders huddling over a laptop at Horizon Hackathon' },
  { id: 7, alt: 'Audience seated at Horizon Hackathon' },
  { id: 29, alt: 'Builders connecting over merch at Horizon Hackathon' },
  { id: 8, alt: 'Talk at Solar Mini Hacker House with SeeGrowth' },
  { id: 9, alt: 'Group photo at Solar Mini Hacker House in Singapore' },
  { id: 10, alt: 'SeeGrowth and Solana signs at Solar Mini Hacker House' },
  { id: 11, alt: 'Host with a WAGMI mic at Solar Mini Hacker House x SeeGrowth' },
  { id: 12, alt: 'SeeGrowth builders at Solana Mini Hacker House' },
  { id: 13, alt: 'SeeGrowth, Solana, and Huawei partners together' },
  { id: 14, alt: 'Builders at Solana Foundation Cypherpunk house' },
  { id: 15, alt: 'Operators coordinating between sessions' },
  { id: 16, alt: 'Networking between talks at a partner event' },
  { id: 17, alt: 'Conversations at Arbitrum Asia' },
].map(({ id, alt }) => {
  const n = String(id).padStart(2, '0');
  const bust = id <= 7 || id === 29 ? '?v=3' : '?v=2';
  return {
    id: `photo-${n}`,
    src: `/assets/events/event-photo-${n}.webp${bust}`,
    alt,
  };
});

const LABELS = [
  'Horizon Hackathon',
  'Hackathon finalists',
  'From 0 to demo',
  'On the builder floor',
  'Solar Mini Hacker House',
  'Singapore builder house',
  'SeeGrowth × Solana',
  'Cypherpunk house',
  'Arbitrum Asia',
];

const SLIDES = Array.from({ length: Math.floor(PHOTOS.length / 2) }, (_, i) => ({
  id: `slide-${i + 1}`,
  label: LABELS[i],
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
