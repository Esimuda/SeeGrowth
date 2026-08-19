import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import './hero.css';

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

requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    import('../script.js');
  });
});
