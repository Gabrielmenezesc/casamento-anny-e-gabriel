// ===================================================
// ANIMATIONS.JS - GSAP, Parallax, Particles, Tilt 3D
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initHeroParticles();
  init3DTilt();
  initAOS();
  initParticlesBackground();
});

// ===== Parallax no Hero =====
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const scene = document.getElementById('hero-scene');
  const heroContent = hero.querySelector('.hero-content');

  // Desabilita parallax no mobile para evitar bordas pretas
  if (window.innerWidth < 768) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroH = hero.offsetHeight;

      if (scrollY < heroH * 1.5) {
        // Parallax na cena inteira: apenas 18% do scroll (antes era 35%)
        // O inset de 5% garante que nenhuma borda preta apareça
        if (scene) {
          scene.style.transform = `translateY(${scrollY * 0.18}px)`;
        }
        // Conteúdo sobe levemente
        if (heroContent) {
          heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
          heroContent.style.opacity = Math.max(0, 1 - scrollY / (heroH * 0.75));
        }
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ===== Partículas flutuantes no Hero =====
function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const colors = [
      'hsla(42, 80%, 70%, 0.7)',
      'hsla(42, 80%, 85%, 0.5)',
      'hsla(345, 80%, 75%, 0.5)',
      'hsla(0, 0%, 100%, 0.4)'
    ];

    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 4 + 3}s ease-in-out ${Math.random() * 3}s infinite;
      pointer-events: none;
    `;
    container.appendChild(p);
  }
}

// ===== 3D Tilt no card hero =====
function init3DTilt() {
  const scene = document.querySelector('.hero-scene');
  if (!scene) return;

  // Mouse move 3D para desktop — suave e seguro
  if (window.innerWidth > 1024) {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Rotação máxima de 4 graus para não mostrar bordas
      const rotX = y * -4;
      const rotY = x * 4;

      scene.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
      scene.style.transition = 'transform 1.2s cubic-bezier(0.23,1,0.32,1)';
      scene.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
      setTimeout(() => { scene.style.transition = ''; }, 1200);
    });
  }
}

// ===== AOS (Animate On Scroll) - implementação leve =====
function initAOS() {
  // AOS está sendo carregado via CDN no HTML
  // Esta função garante fallback se não estiver disponível
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      delay: 0
    });
  }
}

// ===== Partículas discretas no background de seções =====
function initParticlesBackground() {
  const particleContainers = document.querySelectorAll('[data-particles]');
  particleContainers.forEach(container => {
    const count = parseInt(container.dataset.particles) || 8;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'hero-particle';
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation-duration:${Math.random() * 4 + 3}s;
        animation-delay:${Math.random() * 2}s;
        opacity:${Math.random() * 0.5 + 0.2};
      `;
      container.appendChild(p);
    }
  });
}

// ===== GSAP micro-animações se disponível =====
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  // Stagger de cards na entry
  gsap.utils.toArray('.gift-card, .stat-card, .info-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: (i % 4) * 0.1,
      ease: 'power3.out'
    });
  });
}

// Tenta GSAP após carregamento
window.addEventListener('load', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  }
});
