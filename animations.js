/* ============================================
   ADVOCATE JAVERIA — ANIMATIONS JS
   Version: 2.0 — Production Ready
   ============================================ */

'use strict';

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
(function() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2px; width:0%;
    background:linear-gradient(to right,#8a6a28,#c9a84c,#e8c97a);
    z-index:99999; pointer-events:none; transition:width 0.1s;
  `;
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
})();

/* ============================================
   HERO PARALLAX (subtle)
   ============================================ */
(function() {
  const heroImg = document.querySelector('.hero-image-wrap img, .hero-image-wrap svg');
  if (!heroImg || window.innerWidth < 1024) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        heroImg.style.transform = `translateY(${window.scrollY * 0.12}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================
   PAGE FADE-IN ON LOAD
   ============================================ */
document.documentElement.style.cssText += 'opacity:0;transition:opacity 0.45s ease;';
window.addEventListener('load', () => {
  requestAnimationFrame(() => { document.documentElement.style.opacity = '1'; });
});

/* ============================================
   MAGNETIC BUTTONS (desktop hover effect)
   ============================================ */
(function() {
  if (window.matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('.btn-primary, .btn-whatsapp, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y  = ((e.clientY - r.top)  / r.height - 0.5) * 8;
      const ty = btn.classList.contains('btn-primary') ? -2 : 0;
      btn.style.transform = `translateY(${ty}px) translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ============================================
   CURSOR GLOW (large screens only)
   ============================================ */
(function() {
  if (window.matchMedia('(hover:none)').matches) return;
  if (window.innerWidth < 1280) return;

  const glow = Object.assign(document.createElement('div'), {
    style: `
      position:fixed; pointer-events:none; z-index:1;
      width:400px; height:400px; border-radius:50%;
      background:radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 70%);
      transform:translate(-50%,-50%); transition:opacity 0.4s;
      top:0; left:0; will-change:left,top;
    `
  });
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });

  (function anim() {
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(anim);
  })();
})();

/* ============================================
   CARD TILT (subtle 3D effect)
   ============================================ */
(function() {
  if (window.matchMedia('(hover:none)').matches) return;
  const TILT_AMOUNT = 6;

  document.querySelectorAll('.why-card, .practice-card, .cert-card').forEach(card => {
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * TILT_AMOUNT;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * TILT_AMOUNT;
      card.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ============================================
   NUMBER ODOMETER (smooth count-up via IntersectionObserver)
   ============================================ */
(function() {
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = '1';
      const target   = parseInt(entry.target.dataset.target, 10);
      const suffix   = entry.target.dataset.suffix || '';
      const duration = 2200;
      const start    = performance.now();

      (function frame(now) {
        const p = Math.min((now - start) / duration, 1);
        entry.target.textContent = Math.floor(ease(p) * target) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      })(start);

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
})();

/* ============================================
   LINK HOVER UNDERLINE ANIMATION (nav links)
   ============================================ */
(function() {
  document.querySelectorAll('.footer-link').forEach(link => {
    link.style.transition = 'color 0.3s, padding-left 0.3s';
  });
})();

/* ============================================
   GOLD SHIMMER on section labels (one-time)
   ============================================ */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'goldShimmer 1.5s ease forwards';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes goldShimmer {
      0%   { color: var(--gold-dim); }
      50%  { color: var(--gold-light); text-shadow: 0 0 20px rgba(232,201,122,0.4); }
      100% { color: var(--gold); text-shadow: none; }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.section-label').forEach(el => obs.observe(el));
})();

/* ============================================
   WORD-BY-WORD REVEAL on hero heading
   ============================================ */
(function() {
  const heading = document.querySelector('.hero-heading');
  if (!heading) return;
  // Already has CSS animation — enhance with word highlights on hover
  heading.querySelectorAll('em').forEach(em => {
    em.style.transition = 'color 0.3s, text-shadow 0.3s';
    em.addEventListener('mouseenter', () => {
      em.style.textShadow = '0 0 30px rgba(232,201,122,0.4)';
    });
    em.addEventListener('mouseleave', () => {
      em.style.textShadow = '';
    });
  });
})();

/* ============================================
   TIMELINE ITEM STAGGER
   ============================================ */
(function() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => {
    item.classList.add('reveal');
    obs.observe(item);
  });
})();

/* ============================================
   CASE CARD REVEAL WITH COUNT-UP LABELS
   ============================================ */
(function() {
  const cards = document.querySelectorAll('.case-card');
  if (!cards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
        }, i * 100);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.cssText += 'opacity:0; transform:translateY(30px); transition:opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);';
    obs.observe(card);
  });
})();

/* ============================================
   INSIGHT CARD IMAGE LAZY LOAD EFFECT
   ============================================ */
(function() {
  document.querySelectorAll('.insight-img img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; });
    }
  });
})();
