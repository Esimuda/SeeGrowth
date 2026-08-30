import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

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
  { title: 'Why SeeGrowth', href: '#benefits', hint: 'Brand elevation, ROI, and tailored solutions' },
  { title: 'Paid Traffic', href: '#services', hint: 'Campaigns that find wallets ready to convert' },
  { title: 'Brand Systems', href: '#services', hint: 'Identity that looks inevitable at every touchpoint' },
  { title: 'Content Engines', href: '#services', hint: 'Content that turns lurkers into believers' },
  { title: 'Community Events', href: '#events', hint: 'Photos and moments from SeeGrowth gatherings' },
  { title: 'Solar Singapore Reel', href: '#event-video', hint: 'Highlight video from the community' },
  { title: '021Labs', href: '#case-studies', hint: 'Brand system, visual language, and identity that lands' },
  { title: 'Solar Hackathons', href: '#case-studies', hint: 'How SeeGrowth helped organize Solar hackathons' },
  {
    title: 'OpenBuild Pitch Deck',
    href: 'https://www.dropbox.com/scl/fi/pwmjqyx41y9sq79oq24jp/SeeGrowth-Deck-2026.pdf?rlkey=7a2oba79q4eh951vilfl14zyl&st=y674i4kx&dl=0',
    hint: 'View the 2026 growth deck and partner story',
    external: true,
  },
  { title: 'Testimonials', href: '#testimonials', hint: 'What clients say about working with us' },
  { title: 'Book a Strategy Call', href: '#booking', hint: 'Free 30-min session — goals, timeline, custom offer' },
  { title: 'Common Questions', href: '#faq', hint: 'Pricing, guarantee, and what happens on the free call' },
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
              initial={reduce ? false : { y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="search-panel-head">
                <p className="search-panel-title">Find your way</p>
                <button type="button" className="search-close" aria-label="Close search" onClick={closeAll}>
                  <CloseIcon />
                </button>
              </div>

              <div className="search-input-wrap">
                <SearchIcon />
                <input
                  autoFocus
                  type="search"
                  placeholder="Services, events, case studies, FAQ…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <kbd>Esc</kbd>
              </div>

              <div className="search-results-wrap">
                <p className="search-results-label">
                  {results.length === 0 ? 'No results' : `${results.length} result${results.length === 1 ? '' : 's'}`}
                </p>
                <ul className="search-results">
                  {results.length === 0 && (
                    <li className="search-empty">Try “solar”, “openbuild”, “pricing”, or “book”.</li>
                  )}
                  {results.map((item) => (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        onClick={closeAll}
                        {...(item.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        <span>{item.title}</span>
                        <small>{item.hint}</small>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
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
