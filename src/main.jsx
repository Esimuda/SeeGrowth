import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import LogoCarousel from './LogoCarousel.jsx';
import Benefits from './Benefits.jsx';
import Services from './Services.jsx';
import Events from './Events.jsx';
import EventVideo from './EventVideo.jsx';
import Testimonials from './Testimonials.jsx';
import './hero.css';
import './logo-carousel.css';
import './benefits.css';
import './services.css';
import './events.css';
import './event-video.css';
import './testimonials.css';

createRoot(document.getElementById('nav-root')).render(
  <StrictMode>
    <Navbar />
  </StrictMode>
);

createRoot(document.getElementById('hero-root')).render(
  <StrictMode>
    <Hero />
  </StrictMode>
);

createRoot(document.getElementById('logo-carousel-root')).render(
  <StrictMode>
    <LogoCarousel />
  </StrictMode>
);

createRoot(document.getElementById('benefits-root')).render(
  <StrictMode>
    <Benefits />
  </StrictMode>
);

createRoot(document.getElementById('services-root')).render(
  <StrictMode>
    <Services />
  </StrictMode>
);

createRoot(document.getElementById('events-root')).render(
  <StrictMode>
    <Events />
  </StrictMode>
);

createRoot(document.getElementById('event-video-root')).render(
  <StrictMode>
    <EventVideo />
  </StrictMode>
);

createRoot(document.getElementById('testimonials-root')).render(
  <StrictMode>
    <Testimonials />
  </StrictMode>
);

function markAppReady() {
  document.body.classList.remove('is-loading');
  document.body.classList.add('app-ready');
  const loader = document.getElementById('app-loader');
  if (!loader) return;
  const removeLoader = () => loader.remove();
  loader.addEventListener('transitionend', removeLoader, { once: true });
  window.setTimeout(removeLoader, 400);
}

requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    markAppReady();
    import('../script.js');
  });
});
