const fs = require('fs');
const path = require('path');

// ── 1. INDEX.HTML — Gallery + Music + QR link in footer ──────────────────
const indexPath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// ── Gallery CSS (inject into existing <style>) ────────────────────────────
const galleryCSS = `
    /* ── Galeria ─────────────────────────────────── */
    .gallery-section { padding: 5rem 0; background: var(--bg-secondary); }
    .gallery-wrap { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    .gallery-heading { text-align: center; margin-bottom: 3rem; }
    .gallery-heading .section-subtitle { font-size: .8rem; text-transform: uppercase; letter-spacing: .15em; color: var(--text-muted); display: block; margin-bottom: .5rem; }
    .gallery-heading h2 { font-family: var(--font-serif); font-size: clamp(1.8rem, 4vw, 2.8rem); color: var(--text-primary); }

    /* Slider */
    .gallery-slider { position: relative; overflow: hidden; border-radius: 28px; box-shadow: var(--shadow-xl); aspect-ratio: 16/9; }
    .gallery-slides { display: flex; transition: transform .7s cubic-bezier(.4,0,.2,1); height: 100%; }
    .gallery-slide { min-width: 100%; position: relative; overflow: hidden; }
    .gallery-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .gallery-slide-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,.55) 100%);
      display: flex; align-items: flex-end; padding: 1.5rem 2rem;
    }
    .gallery-slide-caption { color: white; }
    .gallery-slide-caption span { font-family: var(--font-script); font-size: 1.4rem; display: block; }
    .gallery-slide-caption small { font-size: .75rem; opacity: .8; text-transform: uppercase; letter-spacing: .08em; }

    /* Prev/Next buttons */
    .gallery-btn {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 46px; height: 46px; border-radius: 50%; border: none; cursor: pointer;
      background: rgba(255,255,255,.92); backdrop-filter: blur(8px);
      box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: center;
      z-index: 10; transition: all .2s;
    }
    .gallery-btn:hover { transform: translateY(-50%) scale(1.1); background: white; }
    .gallery-btn-prev { left: 1rem; }
    .gallery-btn-next { right: 1rem; }

    /* Dots */
    .gallery-dots { display: flex; justify-content: center; gap: .5rem; margin-top: 1.25rem; }
    .gallery-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--glass-border-strong); border: none; cursor: pointer; transition: all .3s; padding: 0; }
    .gallery-dot.active { background: var(--color-gold); width: 24px; border-radius: 4px; }

    /* Thumbnails row */
    .gallery-thumbs { display: flex; gap: .75rem; margin-top: 1rem; overflow-x: auto; padding-bottom: .5rem; scroll-snap-type: x mandatory; }
    .gallery-thumbs::-webkit-scrollbar { height: 4px; }
    .gallery-thumbs::-webkit-scrollbar-thumb { background: var(--glass-border-strong); border-radius: 2px; }
    .gallery-thumb { flex-shrink: 0; width: 80px; height: 56px; border-radius: 10px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all .2s; scroll-snap-align: start; }
    .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .gallery-thumb.active { border-color: var(--color-gold); transform: scale(1.06); }

    /* ── Music Player ─────────────────────────────── */
    .music-btn {
      position: fixed; bottom: 5.5rem; right: 1.5rem;
      width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
      box-shadow: 0 8px 24px rgba(0,0,0,.25);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; transition: all .3s;
      color: white;
    }
    .music-btn:hover { transform: scale(1.1); box-shadow: 0 12px 32px rgba(0,0,0,.3); }
    .music-btn svg { width: 22px; height: 22px; }
    .music-btn.playing { animation: musicPulse 2s ease-in-out infinite; }
    @keyframes musicPulse {
      0%,100% { box-shadow: 0 8px 24px rgba(0,0,0,.25), 0 0 0 0 rgba(212,168,67,.4); }
      50%      { box-shadow: 0 8px 24px rgba(0,0,0,.25), 0 0 0 14px rgba(212,168,67,0); }
    }
    .music-tooltip {
      position: fixed; bottom: 5.5rem; right: 5.5rem;
      background: rgba(0,0,0,.75); color: white;
      font-size: .75rem; padding: .35rem .75rem; border-radius: 50px;
      white-space: nowrap; opacity: 0; pointer-events: none;
      transition: opacity .3s; z-index: 9998;
    }
    .music-btn:hover ~ .music-tooltip { opacity: 1; }
`;

// Inject gallery CSS before end of existing style block
indexHtml = indexHtml.replace('  </style>', galleryCSS + '\n  </style>');

// ── Gallery Section HTML (inject before CTA section) ─────────────────────
const gallerySection = `
  <!-- ===== GALERIA DO CASAL ===== -->
  <section class="gallery-section" id="galeria" aria-label="Nossa Galeria">
    <div class="gallery-wrap">
      <div class="gallery-heading" data-aos="fade-up">
        <span class="section-subtitle">Momentos Especiais</span>
        <h2>Nossa História em Fotos</h2>
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <div class="gallery-slider" id="gallery-slider" role="region" aria-label="Galeria de fotos">
          <div class="gallery-slides" id="gallery-slides">
            <div class="gallery-slide">
              <img src="./assets/images/galeria_1.jpg" alt="Laoanny e Gabriel — Retrato do casal" loading="eager"/>
              <div class="gallery-slide-overlay">
                <div class="gallery-slide-caption">
                  <span>O nosso começo</span>
                  <small>Laoanny &amp; Gabriel</small>
                </div>
              </div>
            </div>
            <div class="gallery-slide">
              <img src="./assets/images/galeria_2.jpg" alt="Casal caminhando no jardim" loading="lazy"/>
              <div class="gallery-slide-overlay">
                <div class="gallery-slide-caption">
                  <span>Cada passo juntos</span>
                  <small>Uma jornada de amor</small>
                </div>
              </div>
            </div>
            <div class="gallery-slide">
              <img src="./assets/images/galeria_3.jpg" alt="Primeira dança" loading="lazy"/>
              <div class="gallery-slide-overlay">
                <div class="gallery-slide-caption">
                  <span>Nossa primeira dança</span>
                  <small>25 de Abril de 2027</small>
                </div>
              </div>
            </div>
            <div class="gallery-slide">
              <img src="./assets/images/galeria_4.jpg" alt="Casal no jardim de rosas" loading="lazy"/>
              <div class="gallery-slide-overlay">
                <div class="gallery-slide-caption">
                  <span>No nosso jardim</span>
                  <small>Um amor que floresce</small>
                </div>
              </div>
            </div>
            <div class="gallery-slide">
              <img src="./assets/images/galeria_5.jpg" alt="Beijo no altar" loading="lazy"/>
              <div class="gallery-slide-overlay">
                <div class="gallery-slide-caption">
                  <span>Eternamente juntos</span>
                  <small>Espaço Villa Rose • Brasília</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <button class="gallery-btn gallery-btn-prev" id="gallery-prev" aria-label="Foto anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="gallery-btn gallery-btn-next" id="gallery-next" aria-label="Próxima foto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <!-- Dots -->
        <div class="gallery-dots" id="gallery-dots" role="tablist" aria-label="Navegação de fotos">
          <button class="gallery-dot active" data-index="0" role="tab" aria-label="Foto 1"></button>
          <button class="gallery-dot" data-index="1" role="tab" aria-label="Foto 2"></button>
          <button class="gallery-dot" data-index="2" role="tab" aria-label="Foto 3"></button>
          <button class="gallery-dot" data-index="3" role="tab" aria-label="Foto 4"></button>
          <button class="gallery-dot" data-index="4" role="tab" aria-label="Foto 5"></button>
        </div>

        <!-- Thumbnails -->
        <div class="gallery-thumbs" id="gallery-thumbs" aria-label="Miniaturas">
          <div class="gallery-thumb active" data-index="0"><img src="./assets/images/galeria_1.jpg" alt="Miniatura 1" loading="lazy"/></div>
          <div class="gallery-thumb" data-index="1"><img src="./assets/images/galeria_2.jpg" alt="Miniatura 2" loading="lazy"/></div>
          <div class="gallery-thumb" data-index="2"><img src="./assets/images/galeria_3.jpg" alt="Miniatura 3" loading="lazy"/></div>
          <div class="gallery-thumb" data-index="3"><img src="./assets/images/galeria_4.jpg" alt="Miniatura 4" loading="lazy"/></div>
          <div class="gallery-thumb" data-index="4"><img src="./assets/images/galeria_5.jpg" alt="Miniatura 5" loading="lazy"/></div>
        </div>
      </div>
    </div>
  </section>

`;

// Insert gallery before CTA section
indexHtml = indexHtml.replace(
  '  <!-- ===== QUICK ACTIONS ===== -->',
  gallerySection + '  <!-- ===== QUICK ACTIONS ===== -->'
);

// ── Music Player button (before back-to-top) ──────────────────────────────
const musicBtn = `
  <!-- Music Player -->
  <button class="music-btn" id="music-btn" aria-label="Tocar/Pausar música">
    <svg id="music-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    <svg id="music-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
  </button>
  <div class="music-tooltip">Pausar música</div>

`;

indexHtml = indexHtml.replace('  <!-- Back to top -->', musicBtn + '  <!-- Back to top -->');

// ── QR Code link in footer ────────────────────────────────────────────────
indexHtml = indexHtml.replace(
  '      <a href="local.html" class="footer-link">Local</a>',
  '      <a href="local.html" class="footer-link">Local</a>\n      <a href="qrcode.html" class="footer-link">Convite Digital</a>'
);

// ── Gallery + Music Scripts (before </body>) ──────────────────────────────
const galleryMusicScript = `
  <!-- Gallery + Music Scripts -->
  <script>
  (function() {
    // ── Gallery ─────────────────────────────────────
    let current = 0;
    const total  = 5;
    let autoTimer;

    const slides = document.getElementById('gallery-slides');
    const dots   = document.querySelectorAll('.gallery-dot');
    const thumbs = document.querySelectorAll('.gallery-thumb');

    function goTo(n) {
      current = (n + total) % total;
      slides.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
    }

    document.getElementById('gallery-prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    document.getElementById('gallery-next').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); resetAuto(); }));
    thumbs.forEach(t => t.addEventListener('click', () => { goTo(+t.dataset.index); resetAuto(); }));

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    resetAuto();

    // Swipe support
    let startX = 0;
    const slider = document.getElementById('gallery-slider');
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
    });

    // ── Music Player (Web Audio API ambient piano) ──
    let audioCtx, masterGain, musicStarted = false, isPlaying = false;
    const musicBtn   = document.getElementById('music-btn');
    const iconPlay   = document.getElementById('music-icon-play');
    const iconPause  = document.getElementById('music-icon-pause');

    // Soft piano chord sequence using OscillatorNode + ADSR
    function playNote(freq, startTime, duration, gain) {
      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();
      osc.connect(env); env.connect(masterGain);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      // ADSR
      env.gain.setValueAtTime(0, startTime);
      env.gain.linearRampToValueAtTime(gain, startTime + 0.06);
      env.gain.exponentialRampToValueAtTime(gain * 0.6, startTime + 0.3);
      env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    }

    // C Major progression: C-Am-F-G (wedding classic)
    const CHORDS = [
      [261.63, 329.63, 392.00, 523.25],  // C
      [220.00, 261.63, 329.63, 440.00],  // Am
      [174.61, 220.00, 261.63, 349.23],  // F
      [196.00, 246.94, 293.66, 392.00],  // G
    ];

    function scheduleMusicLoop() {
      if (!isPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const beatLen = 2.5;
      CHORDS.forEach((chord, ci) => {
        const start = now + ci * beatLen;
        chord.forEach((freq, ni) => {
          // Arpeggio: stagger each note
          playNote(freq, start + ni * 0.15, beatLen * 0.8, 0.04);
          // Octave up softly
          playNote(freq * 2, start + ni * 0.15 + 0.08, beatLen * 0.6, 0.015);
        });
      });
      // Schedule next loop
      const loopDuration = CHORDS.length * beatLen;
      setTimeout(scheduleMusicLoop, (loopDuration - 0.2) * 1000);
    }

    function startMusic() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.5;
        // Reverb-like effect using ConvolverNode
        const reverb = audioCtx.createConvolver();
        const bufferLen = audioCtx.sampleRate * 2.5;
        const buffer = audioCtx.createBuffer(2, bufferLen, audioCtx.sampleRate);
        for (let c = 0; c < 2; c++) {
          const data = buffer.getChannelData(c);
          for (let i = 0; i < bufferLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferLen, 2.5);
          }
        }
        reverb.buffer = buffer;
        const dryGain = audioCtx.createGain(); dryGain.gain.value = 0.7;
        const wetGain = audioCtx.createGain(); wetGain.gain.value = 0.3;
        masterGain.connect(dryGain); dryGain.connect(audioCtx.destination);
        masterGain.connect(reverb); reverb.connect(wetGain); wetGain.connect(audioCtx.destination);
      }
      isPlaying = true;
      scheduleMusicLoop();
    }

    function toggleMusic() {
      if (!isPlaying) {
        startMusic();
        musicBtn.classList.add('playing');
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        document.querySelector('.music-tooltip').textContent = 'Pausar música';
        if (!musicStarted) {
          musicStarted = true;
          // Show toast
          if (typeof showToast === 'function') showToast('Música tocando', 'info');
        }
      } else {
        isPlaying = false;
        if (masterGain) { masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3); }
        setTimeout(() => { if (!isPlaying && audioCtx) audioCtx.suspend(); }, 400);
        musicBtn.classList.remove('playing');
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        document.querySelector('.music-tooltip').textContent = 'Tocar música';
      }
    }

    musicBtn.addEventListener('click', toggleMusic);

    // Auto-start music on first user interaction with the page
    document.addEventListener('click', function autoStart() {
      document.removeEventListener('click', autoStart);
      setTimeout(() => { if (!isPlaying) toggleMusic(); }, 800);
    }, { once: true });

  })();
  </script>
`;

// Insert before </body>
indexHtml = indexHtml.replace('</body>', galleryMusicScript + '</body>');

fs.writeFileSync(indexPath, indexHtml);
console.log('✓ index.html: gallery, music player and QR link added');

// ── 2. CONVIDADOS.HTML — Personalized RSVP message + EmailJS ────────────
const convPath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'convidados.html');
let convHtml = fs.readFileSync(convPath, 'utf-8');

// Add emailjs-notify script before </body>
convHtml = convHtml.replace(
  '<script src="./js/utils.js">',
  '<script src="./js/emailjs-notify.js"></script>\n  <script src="./js/utils.js">'
);

// Enhance the success message to be personalized
convHtml = convHtml.replace(
  /id="rsvp-success-name"[^>]*>[^<]*/,
  'id="rsvp-success-name" style="font-family:var(--font-serif);font-size:1.2rem;color:var(--color-gold-dark);font-weight:700;">Sua presença foi confirmada'
);

// Find success screen and inject personalized message
const oldSuccessScreen = /(<div[^>]*rsvp-success[^>]*>)([\s\S]*?)(<\/div>\s*\n\s*<\/div>)/;
if (oldSuccessScreen.test(convHtml)) {
  // The success message is already there — just ensure name injection happens in JS
}

// Inject inline script for personalized RSVP after the submit button
const rsvpScript = `
  <script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvp-form') || document.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      // Wait for parent handler to finish, then personalize success screen
      setTimeout(() => {
        const nameField = document.getElementById('guest-name') || document.getElementById('rsvp-name') || document.querySelector('input[type="text"]');
        const name = nameField ? nameField.value.trim().split(' ')[0] : 'Convidado';
        
        // Show personalized message
        const successTitle = document.querySelector('.rsvp-success h3, #rsvp-success h3, .rsvp-success-title');
        const successMsg   = document.querySelector('.rsvp-success p, #rsvp-success p');
        if (successTitle) successTitle.textContent = 'Presença Confirmada, ' + name + '!';
        if (successMsg) successMsg.innerHTML = \`
          Que alegria, <strong>\${name}</strong>! Estamos muito felizes em saber que você estará conosco
          neste dia tão especial. <br/><br/>
          Nos vemos no dia <strong>25 de Abril de 2027</strong> no Espaço Villa Rose, Brasília.
          Será uma noite inesquecível! ❤️
        \`;

        // Email notification
        const phone    = (document.getElementById('guest-phone') || document.querySelector('input[type="tel"]') || {}).value || '';
        const guests   = (document.getElementById('guest-count') || document.querySelector('select') || {}).value || '1';
        const message  = (document.getElementById('guest-message') || document.querySelector('textarea') || {}).value || '';
        if (typeof notifyRSVP === 'function') {
          notifyRSVP({ guestName: name, phone, guests, message });
        }
      }, 600);
    });
  });
  </script>
`;

convHtml = convHtml.replace('</body>', rsvpScript + '\n</body>');
fs.writeFileSync(convPath, convHtml);
console.log('✓ convidados.html: personalized RSVP + EmailJS notification added');

// ── 3. PRESENTES.JS — EmailJS notification on gift reserve ────────────────
const presentesJsPath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'js', 'presentes.js');
let presentesJs = fs.readFileSync(presentesJsPath, 'utf-8');

// After "salvarLocal(presentes);" in confirmarReserva, add email notification
presentesJs = presentesJs.replace(
  '  // 2. Salva no Firebase (background)',
  `  // 2b. Email notification
  if (typeof notifyGiftReserved === 'function') {
    notifyGiftReserved({
      giftName: presenteAtual.name,
      reservedBy: anonimo ? null : nome,
      phone: anonimo ? null : tel,
      isAnonymous: anonimo
    });
  }

  // 2. Salva no Firebase (background)`
);

fs.writeFileSync(presentesJsPath, presentesJs);
console.log('✓ presentes.js: EmailJS notification call added');

// ── 4. PRESENTES.HTML — Add emailjs-notify script ────────────────────────
const presentesHtmlPath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'presentes.html');
let presentesHtml = fs.readFileSync(presentesHtmlPath, 'utf-8');
if (!presentesHtml.includes('emailjs-notify')) {
  presentesHtml = presentesHtml.replace(
    '<script src="./js/presentes.js">',
    '<script src="./js/emailjs-notify.js"></script>\n  <script src="./js/presentes.js">'
  );
  fs.writeFileSync(presentesHtmlPath, presentesHtml);
  console.log('✓ presentes.html: emailjs-notify script linked');
}

console.log('\n✅ All 5 features implemented!');
