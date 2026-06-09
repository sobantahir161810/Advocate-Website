/* ============================================
   ADVOCATE JAVERIA — MAIN JAVASCRIPT
   Version: 2.0 — Production Ready
   ============================================ */

'use strict';

/* ============================================
   PAGE LOADER
   ============================================ */
(function() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1500);
  });
  // Fallback — hide after 3s no matter what
  setTimeout(() => loader && loader.classList.add('hidden'), 3000);
})();

/* ============================================
   NAVBAR — SCROLL + HAMBURGER
   ============================================ */
const navbar        = document.querySelector('.navbar');
const hamburger     = document.querySelector('.hamburger');
const mobileOverlay = document.querySelector('.mobile-overlay');
const mobileLinks   = document.querySelectorAll('.mobile-nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });
if (window.scrollY > 30) navbar?.classList.add('scrolled');

// Hamburger toggle
hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileOverlay?.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close overlay on background click
mobileOverlay?.addEventListener('click', (e) => {
  if (e.target === mobileOverlay) {
    hamburger?.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Active nav highlighting
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
  const href = link.getAttribute('href')?.split('#')[0];
  if (href === currentFile) link.classList.add('active');
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================
   BACK TO TOP
   ============================================ */
const bttBtn = document.getElementById('backToTop');
if (bttBtn) {
  window.addEventListener('scroll', () => {
    bttBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const start    = performance.now();

  function frame(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(easeOutCubic(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */
(function initSlider() {
  const track   = document.querySelector('.testimonial-track');
  const slides  = document.querySelectorAll('.testimonial-slide');
  const dots    = document.querySelectorAll('.slider-dot');
  const btnPrev = document.querySelector('.slider-prev');
  const btnNext = document.querySelector('.slider-next');
  if (!track || slides.length < 2) return;

  let current   = 0;
  let autoTimer = null;

  function goTo(i) {
    current = ((i % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  btnNext?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  btnPrev?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = startX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) { stopAuto(); goTo(current + (dx > 0 ? 1 : -1)); startAuto(); }
  });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (!document.querySelector('.testimonial-slider')) return;
    if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
  });

  goTo(0);
  startAuto();
})();

/* ============================================
   FAQ ACCORDION
   ============================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-question');
  q?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ============================================
   INSIGHT CATEGORY FILTER
   ============================================ */
(function initFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.insight-card, .article-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat || 'all';
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display     = show ? '' : 'none';
        card.style.transition  = 'opacity 0.3s';
        card.style.opacity     = show ? '1' : '0';
      });
    });
  });
})();

/* ============================================
   SEARCH BAR
   ============================================ */
(function initSearch() {
  const input = document.querySelector('.search-bar');
  const btn   = document.querySelector('.search-btn');
  const cards = document.querySelectorAll('.insight-card');
  if (!input || !cards.length) return;

  function doSearch() {
    const q = input.value.toLowerCase().trim();
    cards.forEach(card => {
      const title   = card.querySelector('.insight-title')?.textContent.toLowerCase()   || '';
      const excerpt = card.querySelector('.insight-excerpt')?.textContent.toLowerCase() || '';
      card.style.display = (!q || title.includes(q) || excerpt.includes(q)) ? '' : 'none';
    });
  }

  input.addEventListener('input',  doSearch);
  btn?.addEventListener('click',   doSearch);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });
})();

/* ============================================
   FORM VALIDATION
   ============================================ */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('invalid');
    const val = field.value.trim();
    if (!val) { field.classList.add('invalid'); valid = false; return; }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      field.classList.add('invalid'); valid = false;
    }
    if (field.type === 'tel' && !/^[\+\d\s\-\(\)]{7,15}$/.test(val)) {
      field.classList.add('invalid'); valid = false;
    }
  });
  return valid;
}

document.querySelectorAll('.contact-form, .appointment-form').forEach(form => {
  const successMsg = form.querySelector('.form-success');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(form)) {
      successMsg?.classList.add('show');
      form.reset();
      form.querySelectorAll('.invalid').forEach(f => f.classList.remove('invalid'));
      // Auto-hide success after 6s
      setTimeout(() => successMsg?.classList.remove('show'), 6000);
      // Scroll to success message
      successMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  form.querySelectorAll('.form-control').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('invalid'));
  });
});

/* ============================================
   WHATSAPP BOOKING PREFILL
   ============================================ */
document.querySelectorAll('.book-whatsapp').forEach(btn => {
  btn.addEventListener('click', () => {
    const form     = btn.closest('form');
    const name     = form?.querySelector('#name, [name="name"]')?.value.trim()     || '';
    const caseType = form?.querySelector('#case-type, [name="case-type"]')?.value  || '';
    const date     = form?.querySelector('#preferred-date, [name="preferred-date"]')?.value || '';
    const phone    = form?.querySelector('#phone, [name="phone"]')?.value.trim()   || '';

    let msg = 'Hello Advocate Javeria, I would like to book a legal consultation.';
    if (name)     msg += `%0AName: ${encodeURIComponent(name)}`;
    if (phone)    msg += `%0APhone: ${encodeURIComponent(phone)}`;
    if (caseType) msg += `%0ACase Type: ${encodeURIComponent(caseType)}`;
    if (date)     msg += `%0APreferred Date: ${encodeURIComponent(date)}`;

    window.open(`https://wa.me/923160990069?text=${msg}`, '_blank', 'noopener,noreferrer');
  });
});

/* ============================================
   SMOOTH SCROLL (anchor links)
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Offset for fixed navbar
      setTimeout(() => window.scrollBy(0, -80), 10);
    }
  });
});

/* ============================================
   PARTICLES (hero)
   ============================================ */
(function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = window.innerWidth < 768 ? 8 : 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 0.5;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-10%;
      animation-duration:${Math.random() * 14 + 8}s;
      animation-delay:${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
})();

/* ============================================
   COOKIE BANNER
   ============================================ */
(function initCookie() {
  const banner  = document.getElementById('cookieBanner');
  const accept  = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (!banner) return;

  if (!localStorage.getItem('az_cookie_consent')) {
    setTimeout(() => banner.classList.add('show'), 2500);
  }

  accept?.addEventListener('click', () => {
    localStorage.setItem('az_cookie_consent', '1');
    banner.classList.remove('show');
  });
  decline?.addEventListener('click', () => banner.classList.remove('show'));
})();

/* ============================================
   TYPING EFFECT
   ============================================ */
(function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const words = (el.dataset.words || '').split('|').filter(Boolean);
  if (!words.length) return;

  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi % words.length];
    el.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
    if (deleting) ci--; else ci++;

    let delay = deleting ? 55 : 95;
    if (!deleting && ci === word.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0)       { deleting = false; wi++; delay = 350; }
    setTimeout(tick, delay);
  }
  tick();
})();

/* ============================================
   STAGGER CHILDREN REVEAL
   ============================================ */
document.querySelectorAll('.stagger-children').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.classList.add('reveal');
    child.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(child);
  });
});

/* ============================================
   TOAST NOTIFICATION HELPER (global)
   ============================================ */
window.showToast = function(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon"></span><span>${msg}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3500);
};

/* ============================================
   OFFICE STATUS (global helper)
   ============================================ */
window.getOfficeStatus = function() {
  const now  = new Date();
  const day  = now.getDay();
  const time = now.getHours() + now.getMinutes() / 60;
  if (day >= 1 && day <= 4 && time >= 9 && time < 19) return true;
  if (day === 5 && ((time >= 9 && time < 12.5) || (time >= 14.5 && time < 18))) return true;
  if (day === 6 && time >= 10 && time < 16) return true;
  return false;
};
