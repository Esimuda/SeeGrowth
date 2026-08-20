import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import LogoCarousel from './LogoCarousel.jsx';
import Benefits from './Benefits.jsx';
import './hero.css';
import './logo-carousel.css';
import './benefits.css';

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

requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    import('../script.js');
  });
});
