import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Our Story', href: '#testimonials' },
  { label: 'Contact', href: '#booking' },
  { label: 'Learn & Support', href: '#faq' },
];

export const LOGO = {
  src: '/assets/seegrowth-logo.webp',
  alt: 'SeeGrowth',
  width: 275,
  height: 39,
};

export function Logo({ className = '' }) {
  return (
    <a href="#home" className={`logo ${className}`.trim()} aria-label="SeeGrowth home">
      <img
        className="logo-img"
        src={LOGO.src}
        alt={LOGO.alt}
        width={LOGO.width}
        height={LOGO.height}
        decoding="async"
      />
    </a>
  );
}

const SEARCH_INDEX = [
  { title: 'Paid Traffic', href: '#services', hint: 'Targeted campaigns & ROI-driven ads' },
  { title: 'Graphic Design & Branding', href: '#services', hint: 'Visual identity for Web3 teams' },
  { title: 'Content Marketing Strategy', href: '#services', hint: 'Storytelling that converts' },
  { title: 'Case Studies', href: '#case-studies', hint: 'A conversion revolution' },
  { title: 'Pitch Deck 2026', href: '#case-studies', hint: 'See the full picture' },
  { title: 'Testimonials', href: '#testimonials', hint: 'What clients say about us' },
  { title: 'Free Consultation', href: '#booking', hint: '30 min strategy session' },
  { title: 'Pricing & FAQ', href: '#faq', hint: 'Guarantee, process, and offers' },
];

export default function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX;
    return SEARCH_INDEX.filter(
      (item) => item.title.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeAll = () => {
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <>
      <motion.nav
        id="navbar"
        className={`navbar site-nav${scrolled ? ' scrolled' : ''}`}
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo />

        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            className="nav-icon-btn"
            aria-label="Search the site"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="search-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Search SeeGrowth"
              initial={reduce ? false : { y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="search-input-wrap">
                <SearchIcon />
                <input
                  autoFocus
                  type="search"
                  placeholder="Search services, case studies, booking…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <kbd>Esc</kbd>
              </div>
              <ul className="search-results">
                {results.length === 0 && <li className="search-empty">No matches. Try “traffic” or “consult”.</li>}
                {results.map((item) => (
                  <li key={item.title}>
                    <a href={item.href} onClick={closeAll}>
                      <span>{item.title}</span>
                      <small>{item.hint}</small>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
