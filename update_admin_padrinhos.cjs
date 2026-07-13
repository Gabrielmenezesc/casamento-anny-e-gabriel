const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';

// 1. Update admin.js password
const adminJsPath = path.join(dir, 'js', 'admin.js');
let adminJs = fs.readFileSync(adminJsPath, 'utf-8');
adminJs = adminJs.replace(/const ADMIN_PASSWORD = 'casamento2027';/, "const ADMIN_PASSWORD = 'adm2027';");
fs.writeFileSync(adminJsPath, adminJs);
console.log('Updated admin.js');

// 2. Update admin.html (remove password hint)
const adminHtmlPath = path.join(dir, 'admin.html');
let adminHtml = fs.readFileSync(adminHtmlPath, 'utf-8');
const hintRegex = /<p style="margin-top: 1\.5rem; font-size: 0\.75rem; color: hsla\(42, 40%, 85%, 0\.4\); text-align: center;">\s*Senha padrão: <code style="color: var\(--color-gold\); font-size: 0\.8125rem;">casamento2027<\/code>\s*<\/p>/;
adminHtml = adminHtml.replace(hintRegex, '');
fs.writeFileSync(adminHtmlPath, adminHtml);
console.log('Updated admin.html');

// 3. Update padrinhos.html to add Palette and dynamic Grid
const padrinhosPath = path.join(dir, 'padrinhos.html');
let padrinhosHtml = fs.readFileSync(padrinhosPath, 'utf-8');

const dynamicGridHTML = `
      <div style="text-align: center; margin-bottom: 4rem;" data-aos="fade-up">
        <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin-bottom: 1rem;">Nossa Paleta de Cores 🎨</h2>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 2rem;">Escolhemos tons suaves e elegantes para o nosso grande dia. Gostaríamos que nossos padrinhos usassem <strong>Azul Serenity</strong> e as madrinhas <strong>Cinza Claro / Prata</strong>.</p>
        
        <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #91A8D0; box-shadow: var(--shadow-md); border: 4px solid white;"></div>
            <span style="font-weight: 600; color: var(--text-primary);">Azul Serenity</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Padrinhos</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #D3D3D3; box-shadow: var(--shadow-md); border: 4px solid white;"></div>
            <span style="font-weight: 600; color: var(--text-primary);">Cinza Claro</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Madrinhas</span>
          </div>
        </div>
      </div>

      <div class="padrinhos-groups" data-aos="fade-up">
        <div style="grid-column: 1 / -1; text-align: center; margin-bottom: 1rem;">
          <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary);">Padrinhos Confirmados ❤️</h2>
        </div>
        <div style="grid-column: 1 / -1;">
          <div class="padrinhos-grid" id="padrinhos-dynamic-grid">
            <p style="text-align: center; width: 100%; color: var(--text-muted); grid-column: 1 / -1;">Carregando padrinhos...</p>
          </div>
        </div>
      </div>
`;

// Replace the old static grid with the new dynamic grid + palette
const oldGridRegex = /<div class="padrinhos-groups" data-aos="fade-up">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
padrinhosHtml = padrinhosHtml.replace(oldGridRegex, dynamicGridHTML);

// Add the script to fetch and render Godparents
const scriptToInject = `
    async function loadConfirmedPadrinhos() {
      const grid = document.getElementById('padrinhos-dynamic-grid');
      const godparents = await getGodparents();
      if (!godparents || godparents.length === 0) {
        grid.innerHTML = '<p style="text-align: center; width: 100%; color: var(--text-muted); grid-column: 1 / -1;">Ainda não há padrinhos confirmados.</p>';
        return;
      }
      grid.innerHTML = godparents.map(g => {
        // Simple avatar based on companion or wear size logic, or just a generic emoji
        const isMadrinha = g.wearSize !== 'Sob Medida' && (g.wearSize.includes('P') || g.wearSize.includes('M') || g.wearSize.includes('G')); // Fallback logic
        // We can just use an alternating emoji or generic one
        const emoji = '✨';
        return \`
          <div class="padrinho-card" data-aos="zoom-in">
            <div class="padrinho-avatar">\${emoji}</div>
            <div class="padrinho-name">\${sanitize(g.fullName)}</div>
            <div class="padrinho-role">Padrinho / Madrinha</div>
          </div>
        \`;
      }).join('');
    }
    
    document.addEventListener('DOMContentLoaded', async () => {
      loadConfirmedPadrinhos();
`;

padrinhosHtml = padrinhosHtml.replace(/document\.addEventListener\('DOMContentLoaded',\s*async\s*\(\)\s*=>\s*\{/, scriptToInject);

fs.writeFileSync(padrinhosPath, padrinhosHtml);
console.log('Updated padrinhos.html');
