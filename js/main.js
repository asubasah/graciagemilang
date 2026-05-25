/* ================================================
   PT GRACIA GEMILANG — Main JavaScript
   js/main.js
   ================================================ */

'use strict';

// ================================================
// NAVBAR: transparent → glassmorphism on scroll
// ================================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('navbar-scrolled');
    navbar.classList.remove('navbar-transparent');
  } else {
    navbar.classList.remove('navbar-scrolled');
    navbar.classList.add('navbar-transparent');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// Mobile menu toggle
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navMobile.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navMobile.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Active nav link
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === path);
  });
}
setActiveNavLink();

// ================================================
// SCROLL REVEAL (IntersectionObserver)
// ================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
    revealObserver.observe(el);
  });
}

// ================================================
// STATS COUNTER ANIMATION
// ================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.innerHTML = `${prefix}${current.toLocaleString('id-ID')}<span class="suffix">${suffix}</span>`;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

function initCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
  });
}

// ================================================
// TESTIMONIAL SLIDER
// ================================================
function initTestimonialSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer;

  function getPerPage() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function goTo(index) {
    const perPage = getPerPage();
    const max = Math.max(0, cards.length - perPage);
    current = Math.max(0, Math.min(index, max));
    const cardWidth = cards[0].offsetWidth + 24; // gap 24px
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto play
  function startAuto() {
    autoTimer = setInterval(() => {
      const perPage = getPerPage();
      if (current >= cards.length - perPage) goTo(0);
      else next();
    }, 5000);
  }

  function stopAuto() { clearInterval(autoTimer); }

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) dx > 0 ? next() : prev();
  }, { passive: true });

  window.addEventListener('resize', () => goTo(current));
  goTo(0);
  startAuto();
}

// ================================================
// GALLERY FILTER
// ================================================
function initGalleryFilter() {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      items.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ================================================
// ACCORDION / FAQ
// ================================================
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-header.open').forEach(h => {
        h.classList.remove('open');
        h.nextElementSibling.classList.remove('open');
      });

      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
      }
    });
  });
}

// ================================================
// SMOOTH SCROLL
// ================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ================================================
// HERO BG PARALLAX
// ================================================
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  heroBg.classList.add('loaded'); // triggers scale(1) animation

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

// ================================================
// BACK TO TOP
// ================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ================================================
// GALLERY LIGHTBOX
// ================================================
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightbox) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightbox.style.opacity = '0';
      lightbox.style.display = 'flex';
      setTimeout(() => { lightbox.style.opacity = '1'; }, 10);
    });
  });

  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => { lightbox.style.display = 'none'; }, 300);
  }

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ================================================
// INIT ALL
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initTestimonialSlider();
  initGalleryFilter();
  initAccordion();
  initSmoothScroll();
  initParallax();
  initBackToTop();
  initLightbox();
});
