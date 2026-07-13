const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';

// 1. Fix presentes.js popup block
const presentesPath = path.join(dir, 'js', 'presentes.js');
let presentesJS = fs.readFileSync(presentesPath, 'utf-8');
const oldWindowOpen = /window\.open\(whatsappUrl,\s*'_blank',\s*'noopener,noreferrer'\);/;
presentesJS = presentesJS.replace(oldWindowOpen, 'window.location.href = whatsappUrl; // Bypasses mobile popup blockers after async await');
fs.writeFileSync(presentesPath, presentesJS);
console.log('Fixed presentes.js popup blocker');

// 2. Add Login screen to padrinhos.html
const padrinhosPath = path.join(dir, 'padrinhos.html');
let padrinhosHtml = fs.readFileSync(padrinhosPath, 'utf-8');

const loginScreenHtml = `
  <!-- ===== LOGIN SCREEN PADRINHOS ===== -->
  <div id="padrinhos-login-screen" style="position: fixed; inset: 0; z-index: 2000; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; padding: 1rem;">
    <div style="background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow-xl); width: 100%; max-width: 400px; text-align: center;">
      <h1 style="font-family: var(--font-serif); color: var(--text-primary); margin-bottom: 0.5rem;">Área dos Padrinhos</h1>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.875rem;">Acesso restrito. Digite a senha para entrar.</p>
      <form id="padrinhos-login-form">
        <input type="password" id="padrinhos-password" placeholder="Senha" required style="width: 100%; padding: 0.75rem; border: 2px solid var(--glass-border-strong); border-radius: 8px; margin-bottom: 1rem;" />
        <button type="submit" class="btn btn-gold w-full" style="justify-content: center;">Entrar</button>
      </form>
      <div id="padrinhos-login-error" style="color: var(--color-rose); margin-top: 1rem; display: none; font-size: 0.875rem;">Senha incorreta.</div>
    </div>
  </div>
  <div id="padrinhos-content" style="display: none;">
`;

// Insert the login screen right after the body tag or loading screen
padrinhosHtml = padrinhosHtml.replace('</nav>', '</nav>\n' + loginScreenHtml);
// Close the padrinhos-content div before scripts
padrinhosHtml = padrinhosHtml.replace('<button class="back-to-top"', '</div>\n  <button class="back-to-top"');

// Add JS for login
const scriptLogin = `
    document.addEventListener('DOMContentLoaded', async () => {
      // Padrinhos Login Logic
      const loginForm = document.getElementById('padrinhos-login-form');
      const loginScreen = document.getElementById('padrinhos-login-screen');
      const contentScreen = document.getElementById('padrinhos-content');
      
      if(sessionStorage.getItem('padrinhos_session') === 'active') {
        loginScreen.style.display = 'none';
        contentScreen.style.display = 'block';
      }
      
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('padrinhos-password').value;
        if(pwd === 'adm2027') {
          sessionStorage.setItem('padrinhos_session', 'active');
          loginScreen.style.display = 'none';
          contentScreen.style.display = 'block';
        } else {
          document.getElementById('padrinhos-login-error').style.display = 'block';
        }
      });
`;
padrinhosHtml = padrinhosHtml.replace(/document\.addEventListener\('DOMContentLoaded',\s*async\s*\(\)\s*=>\s*\{/, scriptLogin);

fs.writeFileSync(padrinhosPath, padrinhosHtml);
console.log('Added login screen to padrinhos.html');

// 3. Update navigation menus in all HTML files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove old public "Padrinhos" link
  content = content.replace(/<a href="padrinhos\.html"\s+class="navbar-link(\s+active)?">🤵 Padrinhos<\/a>/g, '');
  
  // Also remove from mobile nav
  content = content.replace(/<a href="padrinhos\.html" class="navbar-link(\s+active)?">🤵 Padrinhos<\/a>/g, '');

  // Add the restricted links side by side in the navbar-links div
  const noivosPadrinhosLinks = `
        <div style="width: 1px; height: 20px; background: rgba(255,255,255,0.2); margin: 0 10px;"></div>
        <a href="admin.html" class="navbar-link">🔒 Noivos</a>
        <a href="padrinhos.html" class="navbar-link">🔒 Padrinhos</a>
      </div>`;
  
  // Replace the closing tag of navbar-links with our new links
  content = content.replace(/<\/div>\s*<div class="navbar-controls">/g, noivosPadrinhosLinks + '\n      <div class="navbar-controls">');

  fs.writeFileSync(filePath, content);
}
console.log('Updated navigation menus in all HTML files');
