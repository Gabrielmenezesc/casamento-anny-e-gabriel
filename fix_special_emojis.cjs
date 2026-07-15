const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';

// ── 1. padrinhos.html: corrigir avatares e JS emojis ──────────────────────
const padrinhosPath = path.join(dir, 'padrinhos.html');
let padrinhos = fs.readFileSync(padrinhosPath, 'utf-8');

// Avatar de padrinho confirmado (JS)
padrinhos = padrinhos.replace(
  /const emoji = '✨';/g,
  `const emoji = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>';`
);

// Botão submit com spinning
padrinhos = padrinhos.replace(
  /<span class="animate-spin">⏳<\/span>/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'
);

// Ícone 🎨 na paleta
padrinhos = padrinhos.replace(
  /🎨/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-left:6px;"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>'
);

// 🥂 success icon (large)
padrinhos = padrinhos.replace(
  /<span style="font-size: 4rem;">🥂<\/span>/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 1rem;display:block;"><path d="M8 22l4-11 4 11"/><path d="m5 8 2.5-5h9L19 8"/><path d="M5 8c0 3.5 3 6 7 6s7-2.5 7-6"/><line x1="12" y1="14" x2="12" y2="22"/></svg>'
);

// 👰 group heading
padrinhos = padrinhos.replace(
  /👰 Padrinhos da Noiva/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg> Padrinhos & Madrinhas'
);

// 💕 - corações decorativos
padrinhos = padrinhos.replace(/💕/g, '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:inline-block;vertical-align:middle;margin:0 3px;color:#e85d75;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>');

fs.writeFileSync(padrinhosPath, padrinhos);
console.log('✓ padrinhos.html: emojis especiais corrigidos');

// ── 2. index.html: corrigir hero e countdown ──────────────────────────────
const indexPath = path.join(dir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// 📸 story badge
indexHtml = indexHtml.replace(
  /📸 Catedral de Brasília/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Catedral de Brasília'
);

// 💕 in modals
indexHtml = indexHtml.replace(/💕/g, '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:inline-block;vertical-align:middle;margin:0 3px;color:#e85d75;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>');

fs.writeFileSync(indexPath, indexHtml);
console.log('✓ index.html: emojis especiais corrigidos');

// ── 3. convidados.html: success icon 🎉 ───────────────────────────────────
const convPath = path.join(dir, 'convidados.html');
let convHtml = fs.readFileSync(convPath, 'utf-8');
convHtml = convHtml.replace(
  /🎉/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 1rem;"><path d="m5.8 11.3-1.9 5.4 5.4-1.9"/><path d="M2 2l20 20"/><path d="m17 6-1.8-1.8a2 2 0 0 0-2.8 0L11 5.6"/><path d="M12.1 7.5 9 10.6 4.6 15"/><path d="M9 9 7 7"/><path d="m14 11.3 5.9-5.9a2 2 0 0 0-2.8-2.8L11.2 8.5"/><path d="m11.7 11.7 4.3 4.3-6.1 2.1 2.1-6.1-.3-.3z"/></svg>'
);
convHtml = convHtml.replace(/💕/g, '');
fs.writeFileSync(convPath, convHtml);
console.log('✓ convidados.html: emojis corrigidos');

// ── 4. local.html: logos Clearbit com fallback robusto ────────────────────
const localPath = path.join(dir, 'local.html');
let localHtml = fs.readFileSync(localPath, 'utf-8');

// Replace Clearbit logos with more reliable sources + proper fallback SVG icons
localHtml = localHtml.replace(
  /https:\/\/logo\.clearbit\.com\/google\.com/g,
  'https://www.google.com/favicon.ico'
);
localHtml = localHtml.replace(
  /https:\/\/logo\.clearbit\.com\/waze\.com/g,
  'https://www.waze.com/favicon.ico'
);
localHtml = localHtml.replace(
  /https:\/\/logo\.clearbit\.com\/uber\.com/g,
  'https://www.uber.com/favicon.ico'
);
localHtml = localHtml.replace(
  /https:\/\/logo\.clearbit\.com\/99app\.com/g,
  'https://99app.com/favicon.ico'
);
localHtml = localHtml.replace(
  /https:\/\/logo\.clearbit\.com\/moovit\.com/g,
  'https://moovit.com/favicon.ico'
);

fs.writeFileSync(localPath, localHtml);
console.log('✓ local.html: logos de mapas atualizadas');

// ── 5. presentes.html: logos Clearbit das lojas com fallback ──────────────
const presentesHtmlPath = path.join(dir, 'presentes.html');
let presentesHtml = fs.readFileSync(presentesHtmlPath, 'utf-8');
presentesHtml = presentesHtml.replace(/💕/g, '');
fs.writeFileSync(presentesHtmlPath, presentesHtml);
console.log('✓ presentes.html: limpeza final');

// ── 6. lua-de-mel.html: cleanup ───────────────────────────────────────────
const luaPath = path.join(dir, 'lua-de-mel.html');
let luaHtml = fs.readFileSync(luaPath, 'utf-8');
luaHtml = luaHtml.replace(/💕/g, '');
luaHtml = luaHtml.replace(
  /🌙 Meta da Lua de Mel/g,
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Meta da Lua de Mel'
);
fs.writeFileSync(luaPath, luaHtml);
console.log('✓ lua-de-mel.html: emojis corrigidos');

// ── 7. Adiciona keyframe CSS de spin no style.css ─────────────────────────
const stylePath = path.join(dir, 'css', 'style.css');
let styleCSS = fs.readFileSync(stylePath, 'utf-8');
if (!styleCSS.includes('@keyframes spin')) {
  styleCSS += `\n/* Spin animation for loading icons */\n@keyframes spin {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}\n`;
  fs.writeFileSync(stylePath, styleCSS);
  console.log('✓ style.css: keyframe spin adicionado');
}

console.log('\n✅ Todos os ajustes especiais aplicados!');
