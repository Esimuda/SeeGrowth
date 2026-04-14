/* ================================================================
   SEEGROWTH — script.js
   25 animation features:
   scroll reveals (12 flavours), split-text title cascades,
   stagger grids, SVG chart draw-on, parallax, magnetic buttons,
   3-D card tilt, FAQ accordion, mobile nav, smooth scroll,
   scroll progress bar, cursor glow trail, star rating bursts,
   section backdrop pulse, badge ring burst, service img parallax.
   ================================================================ */

'use strict';

/* ---------------------------------------------------------------
   UTILITY — run after DOM is parsed
   --------------------------------------------------------------- */
function onReady(fn) {
  if (document.readyState !== 'loading') { fn(); }
  else { document.addEventListener('DOMContentLoaded', fn); }
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeOutExpo(t)  { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function clamp(v, lo, hi){ return Math.min(Math.max(v, lo), hi); }

/* ================================================================
   BOOT
   ================================================================ */
onReady(function () {

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==============================================================
     1. SPLIT TEXT
        Wraps every word in <span class="word-wrap"><span class="word-inner">
        so each word can slide up from a clipping parent.
        Called before observers so layout is stable.
     ============================================================== */
  function splitTitle(el) {
    /* Preserve <br> while splitting on spaces */
    var parts = el.innerHTML.split(/(<br\s*\/?>)/gi);
    el.innerHTML = parts.map(function (part) {
      if (/^<br/i.test(part)) return part;
      return part.trim().split(/\s+/).filter(Boolean).map(function (word) {
        return '<span class="word-wrap"><span class="word-inner">' + word + '</span></span>';
      }).join(' ');
    }).join('');
  }

  if (!reduced) {
    document.querySelectorAll('.split-title').forEach(splitTitle);
  }

  /* Stagger word-inners after the parent becomes .is-visible */
  function staggerWords(el) {
    el.querySelectorAll('.word-inner').forEach(function (w, i) {
      w.style.transitionDelay = (i * 58) + 'ms';
    });
  }


  /* ==============================================================
     2. UNIVERSAL SCROLL REVEAL
        data-anim drives which CSS class / JS helper fires.
        data-delay adds an extra ms offset before .is-visible.
     ============================================================== */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el    = entry.target;
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      var anim  = el.getAttribute('data-anim') || '';

      setTimeout(function () {
        el.classList.add('is-visible');

        /* Split-title cascade */
        if (el.classList.contains('split-title') || anim === 'split-title') {
          staggerWords(el);
        }

        /* Stagger children */
        if (anim === 'stagger') {
          el.querySelectorAll(':scope > *').forEach(function (child, i) {
            child.style.transitionDelay = (i * 110) + 'ms';
          });
        }

        /* Chart draw */
        if (el.classList.contains('case-card') || el.querySelector('.chart-line')) {
          drawChartLines(el);
        }

      }, delay);

      revealObs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-anim]').forEach(function (el) {
    revealObs.observe(el);
  });

  /* Legacy class support */
  var legacyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
      setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
      legacyObs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal, .scroll-reveal-card').forEach(function (el) {
    legacyObs.observe(el);
  });


  /* ==============================================================
     3. HERO — slide-from-left entrance on page load
     ============================================================== */
  var heroEls = document.querySelectorAll('.reveal-hero');
  setTimeout(function () {
    heroEls.forEach(function (el) {
      var d = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () { el.classList.add('is-visible'); }, d);
    });
  }, 80);


  /* ==============================================================
     4. SVG CHART LINE DRAW-ON
        Animates stroke-dashoffset from full-length → 0,
        staggered per polyline so they race onto screen.
     ============================================================== */
  function drawChartLines(container) {
    var lines = container.querySelectorAll('.chart-line');
    if (!lines.length) return;
    lines.forEach(function (line, i) {
      var len;
      try { len = line.getTotalLength(); } catch (e) { len = 400; }
      line.style.strokeDasharray  = len;
      line.style.strokeDashoffset = len;
      line.style.transition       = 'none';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          line.style.transition =
            'stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1) ' + (i * 175) + 'ms';
          line.style.strokeDashoffset = '0';
        });
      });
    });
  }

  /* Also trigger on case-cards independently */
  var chartObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      drawChartLines(entry.target);
      chartObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.case-card').forEach(function (c) { chartObs.observe(c); });


  /* ==============================================================
     5. TITLE UNDERLINE GROW
        .title-underline scale-X from 0 → 1 after sibling title.
     ============================================================== */
  var underlineObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      setTimeout(function () { entry.target.classList.add('is-visible'); }, 300);
      underlineObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.title-underline').forEach(function (el) {
    underlineObs.observe(el);
  });


  /* ==============================================================
     6. BADGE RING BURST
        An expanding orange ring fires once when each badge enters.
     ============================================================== */
  if (!reduced) {
    /* Inject keyframe once */
    var kfStyle = document.createElement('style');
    kfStyle.textContent =
      '@keyframes badgeRing{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.7);opacity:0}}' +
      '@keyframes starPop{0%{opacity:0;transform:scale(.3) rotate(-25deg)}' +
      '70%{transform:scale(1.25) rotate(8deg)}100%{opacity:1;transform:scale(1) rotate(0)}}';
    document.head.appendChild(kfStyle);

    var badgeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var badge = entry.target;
        badge.style.position = 'relative';
        var ring = document.createElement('div');
        ring.setAttribute('aria-hidden', 'true');
        ring.style.cssText =
          'position:absolute;inset:-5px;border-radius:6px;pointer-events:none;' +
          'border:2px solid rgba(242,100,25,.75);' +
          'animation:badgeRing .65s cubic-bezier(.22,1,.36,1) forwards;';
        badge.appendChild(ring);
        setTimeout(function () { ring.remove(); }, 700);
        badgeObs.unobserve(badge);
      });
    }, { threshold: 0.85 });

    document.querySelectorAll('.section-badge').forEach(function (b) {
      badgeObs.observe(b);
    });
  }


  /* ==============================================================
     7. STAR RATING — individual stars pop in left to right
     ============================================================== */
  var starObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var starsEl = entry.target.querySelector('.stars');
      if (!starsEl) return;

      var chars = starsEl.textContent.trim().split('');
      starsEl.innerHTML = chars.map(function (ch, i) {
        return '<span style="display:inline-block;opacity:0;' +
          'animation:starPop .45s cubic-bezier(.34,1.56,.64,1) ' + (i * 75 + 120) + 'ms forwards">' +
          ch + '</span>';
      }).join('');

      starObs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.testimonial-card').forEach(function (c) { starObs.observe(c); });


  /* ==============================================================
     8. NAVBAR — shadow + active section tracking
     ============================================================== */
  var navbar   = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');

  var activeStyle = document.createElement('style');
  activeStyle.textContent =
    '.nav-links a.active{color:var(--orange)}' +
    '.nav-links a.active::after{width:100%!important}';
  document.head.appendChild(activeStyle);

  function updateNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    var cur = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 100) cur = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ==============================================================
     9. MOBILE HAMBURGER
     ============================================================== */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    var opening = !mobileNav.classList.contains('open');
    if (opening) {
      mobileNav.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else { closeMenu(); }
  });

  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });


  /* ==============================================================
     10. SMOOTH SCROLL with navbar offset
     ============================================================== */
  var NAV_H = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  ) || 68;

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - NAV_H,
        behavior: 'smooth'
      });
    });
  });


  /* ==============================================================
     11. SCROLL PROGRESS BAR — gradient line at very top of page
     ============================================================== */
  var bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText =
    'position:fixed;top:0;left:0;height:3px;width:0%;z-index:9999;pointer-events:none;' +
    'background:linear-gradient(90deg,#F26419 0%,#ff9a5c 55%,rgba(255,255,255,.6) 100%);' +
    'border-radius:0 3px 3px 0;transition:width .06s linear;';
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%';
  }, { passive: true });


  /* ==============================================================
     12. PARALLAX — hero geo shapes drift at different speeds
     ============================================================== */
  if (!reduced) {
    var geoShapes = document.querySelectorAll('.geo-shape');
    var speeds    = [0.040, 0.065, 0.050, 0.030, 0.075, 0.018, 0.058];

    window.addEventListener('scroll', function () {
      var sy = window.scrollY;
      geoShapes.forEach(function (shape, i) {
        var y = (sy * speeds[i % speeds.length]).toFixed(2);
        shape.style.marginTop = '-' + y + 'px';
      });
    }, { passive: true });
  }


  /* ==============================================================
     13. MAGNETIC BUTTONS — cursor pull effect
         Each primary/orange button subtly follows the cursor.
     ============================================================== */
  if (!reduced) {
    document.querySelectorAll('.btn-primary, .btn-orange').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r  = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width  / 2)) * 0.30;
        var dy = (e.clientY - (r.top  + r.height / 2)) * 0.30;
        btn.style.transform  = 'translate(' + dx + 'px,' + dy + 'px) scale(1.05)';
        btn.style.transition = 'transform .1s ease';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform  = '';
        btn.style.transition =
          'background-color .25s ease,color .25s ease,border-color .25s ease,' +
          'transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease';
      });
    });
  }


  /* ==============================================================
     14. TESTIMONIAL CARD — 3-D tilt on mouse move
     ============================================================== */
  if (!reduced) {
    document.querySelectorAll('.testimonial-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r   = card.getBoundingClientRect();
        var dx  = ((e.clientX - r.left) / r.width  - .5) * 2;
        var dy  = ((e.clientY - r.top)  / r.height - .5) * 2;
        card.style.transform  = 'rotateX(' + (-dy * 8) + 'deg) rotateY(' + (dx * 8) + 'deg) translateZ(8px) translateY(-4px)';
        card.style.transition = 'transform .08s ease';
        card.style.boxShadow  = '0 22px 50px rgba(0,0,0,.58)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform  = '';
        card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1),box-shadow .4s ease,border-color .3s ease';
        card.style.boxShadow  = '';
      });
    });
  }


  /* ==============================================================
     15. CASE & SERVICE CARD — diagonal shine sweep on hover
     ============================================================== */
  if (!reduced) {
    document.querySelectorAll('.case-card, .service-card').forEach(function (card) {
      card.style.position = 'relative';
      var shine = document.createElement('div');
      shine.setAttribute('aria-hidden', 'true');
      shine.style.cssText =
        'position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:inherit;overflow:hidden;' +
        'background:linear-gradient(118deg,transparent 25%,rgba(255,255,255,.065) 50%,transparent 75%);' +
        'background-size:280% 100%;background-position:200% 0;transition:background-position .65s ease;';
      card.appendChild(shine);
      card.addEventListener('mouseenter', function () { shine.style.backgroundPosition = '-80% 0'; });
      card.addEventListener('mouseleave', function () { shine.style.backgroundPosition = '200% 0'; });
    });
  }


  /* ==============================================================
     16. BENEFIT ICON — float + orange glow on hover
     ============================================================== */
  document.querySelectorAll('.benefit-item').forEach(function (item) {
    var wrap = item.querySelector('.benefit-icon-wrap');
    if (!wrap) return;
    item.addEventListener('mouseenter', function () {
      wrap.style.transition = 'transform .38s cubic-bezier(.34,1.56,.64,1),filter .3s ease';
      wrap.style.transform  = 'translateY(-7px) scale(1.18)';
      wrap.style.filter     = 'drop-shadow(0 0 12px rgba(242,100,25,.6))';
    });
    item.addEventListener('mouseleave', function () {
      wrap.style.transform = '';
      wrap.style.filter    = '';
    });
  });


  /* ==============================================================
     17. FAQ ACCORDION — one open at a time, icon spins
     ============================================================== */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ==============================================================
     18. ANIMATED COUNTER — [data-count] elements count up
     ============================================================== */
  function animCount(el, target, dur) {
    var t0 = performance.now();
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(easeOutExpo(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var val = parseInt(entry.target.getAttribute('data-count'), 10);
      if (!isNaN(val)) animCount(entry.target, val, 1800);
      countObs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });


  /* ==============================================================
     19. BOOKING CARD — attention pulse on first enter
     ============================================================== */
  var bookCard = document.querySelector('.booking-card');
  if (bookCard) {
    var bookObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        setTimeout(function () {
          bookCard.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease';
          bookCard.style.transform  = 'translateY(-10px) scale(1.012)';
          bookCard.style.boxShadow  = '0 28px 70px rgba(0,0,0,.55)';
          setTimeout(function () {
            bookCard.style.transform = '';
            bookCard.style.boxShadow = '';
          }, 480);
        }, 400);
        bookObs.unobserve(bookCard);
      });
    }, { threshold: 0.55 });
    bookObs.observe(bookCard);
  }


  /* ==============================================================
     20. SERVICE IMAGE PARALLAX — photo drifts slower than card
     ============================================================== */
  if (!reduced) {
    var svcImgs = document.querySelectorAll('.service-img img');

    window.addEventListener('scroll', function () {
      svcImgs.forEach(function (img) {
        var card = img.closest('.service-card');
        if (!card) return;
        var rect   = card.getBoundingClientRect();
        var centre = rect.top + rect.height / 2 - window.innerHeight / 2;
        var shift  = clamp(centre * 0.07, -30, 30).toFixed(2);
        img.style.transform = 'translateY(' + shift + 'px) scale(1.08)';
      });
    }, { passive: true });
  }


  /* ==============================================================
     21. SECTION BACKDROP PULSE
         A brief faint orange radial glow fires each time a new
         section crosses the viewport midpoint — cinematic pacing.
     ============================================================== */
  if (!reduced) {
    var backdrop = document.createElement('div');
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:997;opacity:0;' +
      'background:radial-gradient(ellipse at 50% 45%,rgba(242,100,25,.07) 0%,transparent 65%);' +
      'transition:opacity .55s ease;';
    document.body.appendChild(backdrop);

    var bdTimer;
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        clearTimeout(bdTimer);
        backdrop.style.opacity = '1';
        bdTimer = setTimeout(function () { backdrop.style.opacity = '0'; }, 650);
      });
    }, { threshold: 0.4 });

    sections.forEach(function (s) { sectionObs.observe(s); });
  }


  /* ==============================================================
     22. NAVBAR LOGO SCALE ON FAST SCROLL
         The logo icon subtly enlarges proportional to scroll speed.
     ============================================================== */
  if (!reduced) {
    var lastY = window.scrollY;
    var lastT = performance.now();
    var logoIcon = document.querySelector('.navbar .logo-icon');
    var logoReset;

    window.addEventListener('scroll', function () {
      var now = performance.now();
      var vel = Math.abs(window.scrollY - lastY) / Math.max(now - lastT, 1);
      if (logoIcon) {
        var s = Math.min(1 + vel * 0.55, 1.28).toFixed(3);
        logoIcon.style.transition = 'transform .18s ease';
        logoIcon.style.transform  = 'scale(' + s + ')';
        clearTimeout(logoReset);
        logoReset = setTimeout(function () { logoIcon.style.transform = 'scale(1)'; }, 200);
      }
      lastY = window.scrollY;
      lastT = now;
    }, { passive: true });
  }


  /* ==============================================================
     23. CURSOR GLOW TRAIL — lagging orange dot follows mouse
         Desktop only, adds warmth and brand presence.
     ============================================================== */
  if (!reduced && window.innerWidth > 960) {
    var glow = document.createElement('div');
    glow.setAttribute('aria-hidden', 'true');
    glow.style.cssText =
      'position:fixed;width:20px;height:20px;border-radius:50%;pointer-events:none;' +
      'z-index:9996;background:rgba(242,100,25,.2);' +
      'transform:translate(-50%,-50%);opacity:0;will-change:left,top;' +
      'transition:opacity .3s ease;';
    document.body.appendChild(glow);

    var gx = 0, gy = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });

    (function animGlow() {
      cx += (gx - cx) * 0.13;
      cy += (gy - cy) * 0.13;
      glow.style.left = cx.toFixed(1) + 'px';
      glow.style.top  = cy.toFixed(1) + 'px';
      requestAnimationFrame(animGlow);
    })();
  }


  /* ==============================================================
     24. HERO PARTICLE CANVAS
         A canvas floats above the hero SVG background with small
         drifting orange + white particles for depth and life.
     ============================================================== */
  if (!reduced) {
    var hero = document.getElementById('home');
    if (hero) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.55;';
      hero.insertBefore(canvas, hero.firstChild);

      var ctx = canvas.getContext('2d');
      var PW, PH, particles = [];

      function resizeCanvas() {
        PW = canvas.width  = hero.offsetWidth;
        PH = canvas.height = hero.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      /* Spawn particles */
      for (var p = 0; p < 55; p++) {
        particles.push({
          x:   Math.random() * 1400,
          y:   Math.random() * 800,
          r:   Math.random() * 1.6 + 0.4,
          dx:  (Math.random() - 0.5) * 0.28,
          dy:  -Math.random() * 0.35 - 0.08,
          a:   Math.random() * 0.55 + 0.15,
          col: Math.random() > 0.55 ? '#F26419' : '#ffffff'
        });
      }

      function drawParticles() {
        ctx.clearRect(0, 0, PW, PH);
        particles.forEach(function (pt) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.globalAlpha = pt.a;
          ctx.fillStyle   = pt.col;
          ctx.fill();

          pt.x += pt.dx;
          pt.y += pt.dy;

          /* Wrap around */
          if (pt.y < -4) { pt.y = PH + 4; pt.x = Math.random() * PW; }
          if (pt.x < -4) { pt.x = PW + 4; }
          if (pt.x > PW + 4) { pt.x = -4; }
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawParticles);
      }
      drawParticles();
    }
  }


  /* ==============================================================
     25. STAGGER GRID — benefits-grid and testimonials-grid
         Re-assigns data-delay dynamically so each child fans in
         cleanly even if HTML order changes.
     ============================================================== */
  document.querySelectorAll('.benefits-grid, .testimonials-grid').forEach(function (grid) {
    grid.querySelectorAll(':scope > *').forEach(function (child, i) {
      if (!child.hasAttribute('data-delay')) {
        child.setAttribute('data-delay', String(i * 105));
      }
    });
  });

}); /* end onReady */

/* ================================================================
   END OF SCRIPT
   ================================================================ */
