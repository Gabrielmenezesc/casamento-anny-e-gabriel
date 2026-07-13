const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'css', 'style.css');
let content = fs.readFileSync(filePath, 'utf-8');

const searchPalette = `  /* Paleta Principal - Tons Dourado/Rose/Champagne */
  --gold-hue: 38;
  --rose-hue: 345;

  --color-gold: hsl(38, 72%, 55%);
  --color-gold-light: hsl(42, 80%, 70%);
  --color-gold-dark: hsl(35, 65%, 40%);
  --color-gold-pale: hsl(40, 80%, 92%);

  --color-rose: hsl(345, 75%, 55%);
  --color-rose-light: hsl(348, 85%, 72%);
  --color-rose-dark: hsl(342, 65%, 40%);
  --color-rose-pale: hsl(345, 80%, 94%);

  --color-champagne: hsl(36, 55%, 85%);
  --color-blush: hsl(340, 35%, 88%);
  --color-cream: hsl(42, 50%, 96%);
  --color-ivory: hsl(45, 60%, 98%);`;

const replacePalette = `  /* Paleta Principal - Azul Serenity / Cinza Claro */
  --gold-hue: 215;
  --rose-hue: 210;

  /* "Gold" variáveis agora assumem o Azul Serenity */
  --color-gold: hsl(215, 45%, 65%);
  --color-gold-light: hsl(215, 50%, 75%);
  --color-gold-dark: hsl(215, 40%, 50%);
  --color-gold-pale: hsl(215, 60%, 92%);

  /* "Rose" variáveis agora assumem o Cinza Claro */
  --color-rose: hsl(210, 15%, 70%);
  --color-rose-light: hsl(210, 20%, 85%);
  --color-rose-dark: hsl(210, 15%, 50%);
  --color-rose-pale: hsl(210, 25%, 95%);

  --color-champagne: hsl(215, 20%, 85%);
  --color-blush: hsl(215, 15%, 90%);
  --color-cream: hsl(210, 20%, 96%);
  --color-ivory: hsl(210, 20%, 98%);`;

content = content.replace(searchPalette, replacePalette);

fs.writeFileSync(filePath, content);
console.log('style.css updated for Serenity Blue and Light Gray palette');
