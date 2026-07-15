const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'ENGEFIELD', 'Downloads', 'GL', 'casamento-premium', 'padrinhos.html');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add floating style to CSS
const cssEndTag = '  </style>';
const floatingCSS = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0px); }
    }
    .floating-illustration {
      animation: float 4s ease-in-out infinite;
    }
  </style>`;
content = content.replace(cssEndTag, floatingCSS);

// 2. Add class="floating-illustration" to the image
content = content.replace(
  /alt="Paleta Padrinhos" style="width: 100%;/g,
  'alt="Paleta Padrinhos" class="floating-illustration" style="width: 100%;'
);

// 3. Remove sizes select block in HTML
// Find: <div class="form-input-row"> ... pad-wear-size ... pad-shoe-size ... </div>
const sizeFieldsRegex = /<div class="form-input-row">\s*<div class="form-group">\s*<label class="form-label" for="pad-wear-size">[\s\S]*?<\/select>\s*<\/div>\s*<\/div>/;
content = content.replace(sizeFieldsRegex, '');

// 4. Update the success text (remove mention of sizes)
content = content.replace(
  'Muito obrigado! Suas informações de tamanho de roupa, calçado e restrições foram salvas com sucesso.',
  'Muito obrigado! Suas informações e restrições alimentares foram salvas com sucesso.'
);

// 5. Remove wearSize and shoeSize from JS data object
content = content.replace(
  /wearSize: document\.getElementById\('pad-wear-size'\)\.value,\s*shoeSize: document\.getElementById\('pad-shoe-size'\)\.value,/g,
  ''
);

// 6. Remove wearSize and shoeSize from WhatsApp text template
content = content.replace(/waText \+= `👕 \*Tamanho roupa:\* \${data\.wearSize}\\n`;/g, '');
content = content.replace(/waText \+= `👞 \*Número calçado:\* \${data\.shoeSize}\\n`;/g, '');

fs.writeFileSync(filePath, content);
console.log('padrinhos.html updated successfully with animations, no sizes, and no flower bouquet.');
