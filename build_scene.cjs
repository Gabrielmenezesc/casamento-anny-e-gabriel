const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'padrinhos.html');
let content = fs.readFileSync(filePath, 'utf-8');

// The animated scene HTML block to replace the old image section
const animatedScene = `
        <!-- Cena Animada dos Padrinhos -->
        <div class="paleta-scene-wrapper" data-aos="fade-up">
          <div class="paleta-scene" id="paleta-scene">
            <!-- Igreja: fundo -->
            <div class="church-bg">
              <!-- Vitrais -->
              <div class="vitral vitral-l"></div>
              <div class="vitral vitral-r"></div>
              <!-- Colunas -->
              <div class="col col-l1"></div>
              <div class="col col-l2"></div>
              <div class="col col-r1"></div>
              <div class="col col-r2"></div>
              <!-- Passadeira -->
              <div class="aisle"></div>
              <!-- Altar -->
              <div class="altar">
                <div class="altar-top"></div>
                <div class="altar-cross">✝</div>
              </div>
              <!-- Pétalas decorativas -->
              <div class="petal-row">
                <div class="petal"></div><div class="petal"></div><div class="petal"></div>
                <div class="petal"></div><div class="petal"></div><div class="petal"></div>
              </div>
            </div>

            <!-- Personagem: Padrinho (Cinza Claro) -->
            <div class="character char-groomsman" id="char-groomsman">
              <svg viewBox="0 0 70 140" class="char-svg">
                <!-- Cabeça -->
                <ellipse cx="35" cy="18" rx="12" ry="13" fill="#F5D0A9"/>
                <!-- Cabelo -->
                <ellipse cx="35" cy="8" rx="12" ry="6" fill="#5C3D2E"/>
                <!-- Orelhas -->
                <ellipse cx="23" cy="18" rx="3" ry="4" fill="#F5D0A9"/>
                <ellipse cx="47" cy="18" rx="3" ry="4" fill="#F5D0A9"/>
                <!-- Olhos -->
                <circle cx="30" cy="17" r="2" fill="#333"/>
                <circle cx="40" cy="17" r="2" fill="#333"/>
                <circle cx="31" cy="16" r="0.8" fill="white"/>
                <circle cx="41" cy="16" r="0.8" fill="white"/>
                <!-- Sobrancelhas -->
                <line x1="27" y1="13" x2="33" y2="13" stroke="#5C3D2E" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="37" y1="13" x2="43" y2="13" stroke="#5C3D2E" stroke-width="1.5" stroke-linecap="round"/>
                <!-- Sorriso -->
                <path d="M30 23 Q35 27 40 23" stroke="#C08060" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                <!-- Gravata borboleta -->
                <polygon points="34,32 38,29 38,35" fill="#4A4A5A"/>
                <polygon points="36,32 32,29 32,35" fill="#4A4A5A"/>
                <circle cx="35" cy="32" r="1.5" fill="#666"/>
                <!-- Terno Cinza - corpo -->
                <rect x="21" y="31" width="28" height="35" rx="5" fill="#B8B8C0"/>
                <!-- Lapelas brancas -->
                <polygon points="35,32 25,38 28,48 35,42" fill="white"/>
                <polygon points="35,32 45,38 42,48 35,42" fill="white"/>
                <!-- Bolso superior -->
                <rect x="39" y="36" width="7" height="1.5" rx="0.75" fill="white"/>
                <!-- Cinto -->
                <rect x="21" y="63" width="28" height="4" rx="2" fill="#888"/>
                <!-- Calça cinza -->
                <rect x="21" y="66" width="12" height="45" rx="3" fill="#A0A0AA"/>
                <rect x="37" y="66" width="12" height="45" rx="3" fill="#A0A0AA"/>
                <!-- Sapatos -->
                <ellipse cx="27" cy="113" rx="9" ry="4" fill="#2A2A2A"/>
                <ellipse cx="43" cy="113" rx="9" ry="4" fill="#2A2A2A"/>
                <!-- Braços -->
                <rect x="8" y="31" width="11" height="32" rx="5" fill="#B8B8C0"/>
                <rect x="51" y="31" width="11" height="32" rx="5" fill="#B8B8C0"/>
                <!-- Mãos -->
                <ellipse cx="13" cy="65" rx="6" ry="5" fill="#F5D0A9"/>
                <ellipse cx="57" cy="65" rx="6" ry="5" fill="#F5D0A9"/>
              </svg>
              <!-- Tag da paleta -->
              <div class="char-label groomsman-label">
                <div class="paleta-circle" style="background:#C8C8D4;"></div>
                <span>Cinza Claro</span>
                <small>Padrinhos</small>
              </div>
            </div>

            <!-- Personagem: Madrinha (Azul Serenity) -->
            <div class="character char-bridesmaid" id="char-bridesmaid">
              <svg viewBox="0 0 70 145" class="char-svg">
                <!-- Cabelo longo -->
                <ellipse cx="35" cy="15" rx="14" ry="9" fill="#8B5E3C"/>
                <rect x="21" y="14" width="5" height="35" rx="3" fill="#8B5E3C"/>
                <rect x="44" y="14" width="5" height="35" rx="3" fill="#8B5E3C"/>
                <!-- Cabeça -->
                <ellipse cx="35" cy="18" rx="12" ry="13" fill="#F5D0A9"/>
                <!-- Olhos -->
                <circle cx="30" cy="17" r="2" fill="#333"/>
                <circle cx="40" cy="17" r="2" fill="#333"/>
                <circle cx="31" cy="16" r="0.8" fill="white"/>
                <circle cx="41" cy="16" r="0.8" fill="white"/>
                <!-- Cílios -->
                <line x1="28" y1="14" x2="26" y2="12" stroke="#333" stroke-width="1"/>
                <line x1="30" y1="13" x2="30" y2="11" stroke="#333" stroke-width="1"/>
                <line x1="32" y1="14" x2="33" y2="12" stroke="#333" stroke-width="1"/>
                <line x1="38" y1="14" x2="37" y2="12" stroke="#333" stroke-width="1"/>
                <line x1="40" y1="13" x2="40" y2="11" stroke="#333" stroke-width="1"/>
                <line x1="42" y1="14" x2="44" y2="12" stroke="#333" stroke-width="1"/>
                <!-- Bochechas rosadas -->
                <ellipse cx="27" cy="21" rx="4" ry="2.5" fill="#FFB3BA" opacity="0.5"/>
                <ellipse cx="43" cy="21" rx="4" ry="2.5" fill="#FFB3BA" opacity="0.5"/>
                <!-- Sorriso -->
                <path d="M30 24 Q35 28 40 24" stroke="#C06070" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                <!-- Vestido Azul Serenity - parte de cima (corpete) -->
                <path d="M23 31 C23 31 20 35 20 48 L50 48 C50 35 47 31 47 31 Z" fill="#91A8D0"/>
                <!-- Alças delicadas -->
                <rect x="29" y="28" width="3" height="6" rx="1.5" fill="#91A8D0"/>
                <rect x="38" y="28" width="3" height="6" rx="1.5" fill="#91A8D0"/>
                <!-- Saia do vestido (évase) -->
                <path d="M20 47 Q10 80 5 115 L65 115 Q60 80 50 47 Z" fill="#7A96C4"/>
                <!-- Camada de organza luminosa -->
                <path d="M22 50 Q12 82 8 112 L62 112 Q58 82 48 50 Z" fill="#91A8D0" opacity="0.4"/>
                <!-- Laço na cintura -->
                <ellipse cx="35" cy="49" rx="10" ry="3" fill="#6B89B4"/>
                <polygon points="35,49 28,44 28,54" fill="#8099BE"/>
                <polygon points="35,49 42,44 42,54" fill="#8099BE"/>
                <!-- Brilhos no vestido -->
                <circle cx="28" cy="65" r="1.5" fill="white" opacity="0.4"/>
                <circle cx="42" cy="75" r="1" fill="white" opacity="0.4"/>
                <circle cx="25" cy="90" r="1.2" fill="white" opacity="0.4"/>
                <!-- Braços -->
                <rect x="7" y="32" width="10" height="28" rx="5" fill="#F5D0A9"/>
                <rect x="53" y="32" width="10" height="28" rx="5" fill="#F5D0A9"/>
                <!-- Mãos -->
                <ellipse cx="12" cy="62" rx="5.5" ry="4.5" fill="#F5D0A9"/>
                <ellipse cx="58" cy="62" rx="5.5" ry="4.5" fill="#F5D0A9"/>
              </svg>
              <!-- Tag da paleta -->
              <div class="char-label bridesmaid-label">
                <div class="paleta-circle" style="background:#91A8D0;"></div>
                <span>Azul Serenity</span>
                <small>Madrinhas</small>
              </div>
            </div>

            <!-- Overlay de boas vindas -->
            <div class="scene-welcome" id="scene-welcome">
              <div class="scene-welcome-inner">
                <p>Nossa Paleta de Cores</p>
                <h3>Padrinhos & Madrinhas</h3>
              </div>
            </div>
          </div>

          <!-- Legenda / paleta embaixo -->
          <div class="paleta-info-row">
            <div class="paleta-info-card padrinho-info">
              <div class="paleta-info-swatch" style="background: linear-gradient(135deg,#D3D3D3,#B0B0B8);"></div>
              <div>
                <strong>Cinza Claro / Prata</strong>
                <span>Padrinhos</span>
              </div>
            </div>
            <div class="paleta-divider">×</div>
            <div class="paleta-info-card madrinha-info">
              <div class="paleta-info-swatch" style="background: linear-gradient(135deg,#91A8D0,#6B89B4);"></div>
              <div>
                <strong>Azul Serenity</strong>
                <span>Madrinhas</span>
              </div>
            </div>
          </div>
        </div>`;

// CSS styles to inject
const sceneCSS = `
    /* ── Cena animada ────────────────────────────── */
    .paleta-scene-wrapper { margin: 1.5rem auto; max-width: 560px; }
    .paleta-scene {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      border: 6px solid white;
      background: #F9F0E8;
    }
    /* Fundo da Igreja */
    .church-bg {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, #E8DFD0 0%, #F5EDE0 100%);
    }
    /* Vitrais */
    .vitral {
      position: absolute; top: 6%; width: 22%; height: 40%;
      border-radius: 50% 50% 0 0;
    }
    .vitral-l { left: 4%; background: linear-gradient(160deg,#91A8D0,#C8D8EE,#FFE4B5,#D3D3D3); opacity:.55; box-shadow: 0 0 20px #91A8D080; }
    .vitral-r { right: 4%; background: linear-gradient(200deg,#91A8D0,#C8D8EE,#FFE4B5,#D3D3D3); opacity:.55; box-shadow: 0 0 20px #91A8D080; }
    /* Colunas */
    .col {
      position: absolute; top: 0; bottom: 0; width: 5%;
      background: linear-gradient(90deg,#E2D8CC,#F5EDE0,#E2D8CC);
      border-left: 1px solid #C8B89A40; border-right: 1px solid #C8B89A40;
    }
    .col-l1 { left: 4%; } .col-l2 { left: 12%; }
    .col-r1 { right: 4%; } .col-r2 { right: 12%; }
    /* Passadeira */
    .aisle {
      position: absolute;
      bottom: 0; left: 50%;
      transform: translateX(-50%);
      width: 28%; height: 100%;
      background: linear-gradient(180deg,#C8B89A 0%,#E8D8C0 60%,#F5EDE0 100%);
      border-left: 2px solid #C8A87840;
      border-right: 2px solid #C8A87840;
      clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
    }
    .petal-row {
      position: absolute; bottom: 8%; left: 50%;
      transform: translateX(-50%);
      display: flex; gap: 6px; z-index: 2;
    }
    .petal {
      width: 6px; height: 6px; border-radius: 50%;
      background: #FFB3BA;
      animation: petalBounce 1.5s ease-in-out infinite alternate;
    }
    .petal:nth-child(even) { background: #91A8D0; animation-delay: .3s; }
    .petal:nth-child(3n) { background: #D3D3D3; animation-delay: .6s; }
    @keyframes petalBounce { 0%{transform:translateY(0)} 100%{transform:translateY(-4px)} }
    /* Altar */
    .altar {
      position: absolute; top: 4%; left: 50%;
      transform: translateX(-50%);
      width: 22%; 
      text-align: center;
    }
    .altar-top {
      height: 40px;
      background: linear-gradient(135deg,#E8D8C0,#F5EDE0);
      border-radius: 4px 4px 0 0;
      border: 1px solid #C8A87880;
      box-shadow: 0 0 18px #91A8D040;
    }
    .altar-cross {
      font-size: 1.1rem; color: #C8A878;
      text-shadow: 0 0 8px #C8A87880;
    }

    /* ── Personagens ─────────────────────────────── */
    .character {
      position: absolute;
      bottom: 0;
      transform-origin: bottom center;
      z-index: 10;
    }
    .char-svg { display: block; width: 100%; height: 100%; }

    /* Padrinho: entra pela esquerda, caminha até o altar */
    .char-groomsman {
      width: 18%; left: -25%;
      animation: groomsmanWalk 8s ease-in-out forwards, groomsmanWalkLoop 8s 8s ease-in-out infinite;
    }
    @keyframes groomsmanWalk {
      0%   { left: -25%; bottom: 0%; transform: scale(.45); }
      20%  { left: 20%;  bottom: 2%; transform: scale(.55); }
      40%  { left: 32%;  bottom: 8%; transform: scale(.7); }
      60%  { left: 31%;  bottom: 12%; transform: scale(.82); }
      75%  { left: 28%;  bottom: 14%; transform: scale(.9); }
      85%  { left: 27%;  bottom: 15%; transform: scale(.95); }
      100% { left: 26%;  bottom: 15%; transform: scale(1); }
    }
    @keyframes groomsmanWalkLoop {
      0%,100% { left: 26%; bottom: 15%; transform: scale(1) translateY(0); }
      50%     { left: 26%; bottom: 15%; transform: scale(1) translateY(-6px); }
    }

    /* Madrinha: entra pela direita, caminha até o altar */
    .char-bridesmaid {
      width: 18%; right: -25%;
      animation: bridesmaidWalk 8s ease-in-out forwards, bridesmaidWalkLoop 8s 8s ease-in-out infinite;
    }
    @keyframes bridesmaidWalk {
      0%   { right: -25%; bottom: 0%; transform: scale(.45); }
      20%  { right: 20%;  bottom: 2%; transform: scale(.55); }
      40%  { right: 32%;  bottom: 8%; transform: scale(.7); }
      60%  { right: 31%;  bottom: 12%; transform: scale(.82); }
      75%  { right: 28%;  bottom: 14%; transform: scale(.9); }
      85%  { right: 27%;  bottom: 15%; transform: scale(.95); }
      100% { right: 26%;  bottom: 15%; transform: scale(1); }
    }
    @keyframes bridesmaidWalkLoop {
      0%,100% { right: 26%; bottom: 15%; transform: scale(1) translateY(0); }
      50%     { right: 26%; bottom: 15%; transform: scale(1) translateY(-6px); }
    }

    /* Walk bobble via pseudo-element on SVG */
    .char-groomsman .char-svg { animation: charBob 0.5s ease-in-out infinite alternate; }
    .char-bridesmaid .char-svg { animation: charBob 0.5s ease-in-out .25s infinite alternate; }
    @keyframes charBob { 0%{transform:rotate(-1.5deg) translateY(0)} 100%{transform:rotate(1.5deg) translateY(-3px)} }

    /* ── Labels de Paleta ────────────────────────── */
    .char-label {
      position: absolute; top: -20px; left: 50%; transform: translateX(-50%);
      background: white;
      border-radius: 50px;
      padding: .25rem .7rem;
      box-shadow: var(--shadow-md);
      white-space: nowrap;
      display: flex; align-items: center; gap: 5px;
      font-size: .7rem; font-weight: 600; color: var(--text-primary);
      animation: labelAppear 1s ease forwards;
      animation-delay: 7.5s; opacity: 0;
      flex-direction: column; gap: 2px;
    }
    .char-label span { font-weight: 700; font-size: .72rem; }
    .char-label small { font-size: .62rem; color: var(--text-muted); font-weight: 500; }
    .paleta-circle { width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,.15); }
    @keyframes labelAppear { to { opacity: 1; } }

    /* ── Boas vindas overlay ─────────────────────── */
    .scene-welcome {
      position: absolute; top: 10%; left: 50%; transform: translateX(-50%);
      animation: welcomeAnim 8s ease forwards;
      text-align: center; white-space: nowrap; z-index: 20;
    }
    .scene-welcome-inner {
      background: rgba(255,255,255,.85);
      backdrop-filter: blur(8px);
      border-radius: 16px; padding: .5rem 1.2rem;
      box-shadow: var(--shadow-md);
    }
    .scene-welcome p { font-size: .65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .1em; margin: 0; }
    .scene-welcome h3 { font-family: var(--font-serif); font-size: 1.1rem; color: var(--text-primary); margin: 0; }
    @keyframes welcomeAnim {
      0%  { opacity: 1; top: 10%; }
      60% { opacity: 1; top: 6%; }
      80% { opacity: 0; top: 4%; }
      100%{ opacity: 0; top: 4%; pointer-events: none; }
    }

    /* ── Info Row embaixo ────────────────────────── */
    .paleta-info-row {
      display: flex; align-items: center; justify-content: center;
      gap: 1rem; margin-top: 1.25rem; flex-wrap: wrap;
    }
    .paleta-info-card {
      display: flex; align-items: center; gap: .75rem;
      background: var(--bg-card); border-radius: 16px; padding: .75rem 1.25rem;
      box-shadow: var(--shadow-md); border: 1px solid var(--glass-border);
    }
    .paleta-info-card div { display: flex; flex-direction: column; }
    .paleta-info-card strong { font-size: .9rem; color: var(--text-primary); }
    .paleta-info-card span { font-size: .75rem; color: var(--text-muted); }
    .paleta-info-swatch { width: 40px; height: 40px; border-radius: 12px; box-shadow: var(--shadow-sm); flex-shrink: 0; }
    .paleta-divider { font-size: 1.5rem; color: var(--text-muted); opacity: .5; }
`;

// Find and add the scene CSS to the existing style block
const cssEndTag = '  </style>';
const newCssTag = sceneCSS + '\n  </style>';
content = content.replace(cssEndTag, newCssTag);

// Replace the old image block in paleta section
const oldImageBlock = /<!-- Imagem 3D dos padrinhos -->[\s\S]*?<\/div>\s*\n/;
content = content.replace(oldImageBlock, animatedScene + '\n');

// Remove old small color circles (they are now replaced by paleta-info-row inside animatedScene)
// Careful: just update the text near "Cinza Claro / Prata" label above the section
const oldColorCirclesBlock = /<div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n\s*<\/div>\s*\n\s*<\/div>/;
if (oldColorCirclesBlock.test(content)) {
  content = content.replace(oldColorCirclesBlock, '</div>\n    </div>');
}

fs.writeFileSync(filePath, content);
console.log('SUCCESS: Padrinhos animated scene written!');
