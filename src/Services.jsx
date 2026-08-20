import { motion, useReducedMotion } from 'framer-motion';

const ROWS = [
  {
    id: 'paid',
    src: '/assets/service-paid-rocket.webp',
    alt: 'Iridescent 3D rocket launching, representing paid traffic that converts',
    title: 'Paid traffic that finds wallets ready to convert',
    meta: 'Always on',
    href: '#booking',
    featured: true,
  },
  {
    id: 'brand',
    src: '/assets/service-brand-star.webp',
    alt: 'Iridescent 3D star burst, representing brand systems at every touchpoint',
    title: 'Brand systems that look inevitable at every touchpoint',
    meta: 'Q2 2026',
    href: '#booking',
  },
  {
    id: 'content',
    src: '/assets/service-content.webp',
    alt: 'Team collaborating in a light, modern studio',
    title: 'Content engines that turn lurkers into believers',
    meta: 'Q3 2026',
    href: '#booking',
  },
];

const ease = [0.22, 1, 0.36, 1];

export default function Services() {
  const reduce = useReducedMotion();
  const viewport = { once: true, amount: 0.2 };

  return (
    <section className="services services-bento" id="services">
      <div className="services-intro">
        <h2 className="services-headline">
          <span className="services-headline__line">Services built to</span>
          <span className="services-headline__line">
            make <em>growth</em> visible
          </span>
        </h2>
      </div>

      <motion.div
        className="services-board"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.7, ease }}
      >
        <motion.a
          href="#booking"
          className="services-feature"
          initial={reduce ? false : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.65, delay: 0.08, ease }}
          whileHover={reduce ? undefined : { y: -4 }}
        >
          <img
            className="services-feature-bg"
            src="/assets/service-feature.webp"
            alt=""
            aria-hidden="true"
          />

          <div className="services-feature-stat">
            <span className="services-feature-number">3.4</span>
            <span className="services-feature-suffix">x</span>
            <p>Average return on paid campaigns we run</p>
          </div>

          <div className="services-feature-foot">
            <p>Your partner in visible growth</p>
          </div>
        </motion.a>

        <ul className="services-list">
          {ROWS.map((row, i) => (
            <motion.li
              key={row.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.08, ease }}
            >
              <a href={row.href} className="services-row">
                <span className="services-thumb">
                  <img src={row.src} alt={row.alt} />
                </span>
                <span className="services-row-copy">
                  <strong>{row.title}</strong>
                </span>
                <span className="services-row-meta">{row.meta}</span>
                <span className={`services-row-go${row.featured ? ' is-primary' : ''}`} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
