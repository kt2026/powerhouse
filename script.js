// Smooth scroll is mostly handled via CSS, but we add easing and nav state.

const navLinks = document.querySelectorAll('.nav-links a, .footer-nav a, .logo');
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const offset = rect.top + window.scrollY - (navbar?.offsetHeight || 0) + 1;

    window.scrollTo({
      top: offset,
      behavior: 'smooth',
    });

    if (navLinksContainer.classList.contains('open')) {
      navLinksContainer.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });
});

// Mobile nav toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });
}

// Sticky navbar visual state
const updateNavbarState = () => {
  if (!navbar) return;
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', updateNavbarState);
updateNavbarState();

// Scroll reveal using IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}

// Animated counters (for any element with data-counter)
const counterElements = document.querySelectorAll('[data-counter]');

const animateCounter = (el) => {
  const target = Number(el.getAttribute('data-counter') || '0');
  if (!Number.isFinite(target)) return;

  const duration = 1400;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const value = Math.floor(target * eased);
    el.textContent = value.toString();
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

if ('IntersectionObserver' in window && counterElements.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el);
          counterObserver.unobserve(el);
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  counterElements.forEach((el) => counterObserver.observe(el));
} else {
  counterElements.forEach((el) => animateCounter(el));
}

// Simple parallax for elements with data-parallax
const parallaxEls = document.querySelectorAll('[data-parallax]');

if (parallaxEls.length) {
  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const factor = Number(el.getAttribute('data-parallax') || '0.15');
      const translateY = scrollY * factor;
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax();
}

// Prevent actual form submission for demo purposes
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.reset();
    alert('Thank you! Our team will contact you shortly.');
  });
}

// Dynamic year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

