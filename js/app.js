// ===================================================
// APP.JS - Core Global: Navbar, Theme, Loading, Toast
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initTheme();
  initNavbar();
  initBackToTop();
  initRippleButtons();
});

// ===== Loading Screen =====
function initLoading() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger hero animations
      document.body.classList.add('loaded');
    }, 800);
  });
  // Failsafe
  setTimeout(() => {
    if (screen) screen.classList.add('hidden');
    document.body.style.overflow = '';
    document.body.classList.add('loaded');
  }, 3000);
}

// ===== Theme (Dark / Light) =====
function initTheme() {
  const saved = Storage.get(STORAGE_KEYS.theme, 'light');
  applyTheme(saved);

  const btn = document.getElementById('btn-theme');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      Storage.set(STORAGE_KEYS.theme, next);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== Navbar =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (!navbar) return;

  // Scroll detection
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', debounce(() => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
      });
      document.querySelectorAll('.navbar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
      });
    }, 100), { passive: true });
  }

  // Hamburger menu
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });
  }
}

// ===== Back to Top =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== Toast Notification =====
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', info: 'ℹ️', error: '❌' };
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${sanitize(message)}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// ===== Ripple Effect on Buttons =====
function initRippleButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn, .hero-btn, .btn-reserve');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple-circle';
    circle.style.cssText = `width:${size}px;height:${size}px;top:${e.clientY - rect.top - size / 2}px;left:${e.clientX - rect.left - size / 2}px`;
    btn.classList.add('ripple-effect');
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 700);
  });
}

// ===== Modal helpers =====
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal(id), { once: true });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(id);
  }, { once: true });
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Confetti mini =====
function launchConfetti() {
  const colors = ['#D4A843', '#E8C66B', '#C8586A', '#F4A7B2', '#FFFFFF'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    el.style.cssText = `
      position:fixed; top:-20px; left:${Math.random() * 100}vw; z-index:9999;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confettiFall ${Math.random() * 2 + 1.5}s linear ${Math.random() * 1}s forwards;
      pointer-events:none;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ===== Scroll Reveal =====
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

// Inicializa scroll reveal após DOM
document.addEventListener('DOMContentLoaded', initScrollReveal);
