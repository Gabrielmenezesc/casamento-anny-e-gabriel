const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';

// 1. Update local.html
const localPath = path.join(dir, 'local.html');
let localHtml = fs.readFileSync(localPath, 'utf-8');

const oldMapLinksRegex = /<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0\.75rem; margin-top: 1rem;">[\s\S]*?<\/div>/;

const newMapLinks = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
            <a href="https://maps.app.goo.gl/EuzcXbutFQzt9vD48" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem; gap: 8px;">
              <img src="https://logo.clearbit.com/google.com" alt="Google Maps" style="width: 20px; height: 20px; border-radius: 4px;" onerror="this.style.display='none'" /> Google Maps
            </a>
            <a href="https://waze.com/ul?ll=-15.8789531,-48.0645607&navigate=yes" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem; gap: 8px;">
              <img src="https://logo.clearbit.com/waze.com" alt="Waze" style="width: 20px; height: 20px; border-radius: 4px;" onerror="this.style.display='none'" /> Waze
            </a>
            <a href="https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=-15.8789531&dropoff[longitude]=-48.0645607&dropoff[nickname]=Espa%C3%A7o%20Villa%20Rose" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem; gap: 8px;">
              <img src="https://logo.clearbit.com/uber.com" alt="Uber" style="width: 20px; height: 20px; border-radius: 4px;" onerror="this.style.display='none'" /> Uber
            </a>
            <a href="99taxis://search?latitude=-15.8789531&longitude=-48.0645607&title=Espa%C3%A7o%20Villa%20Rose" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem; gap: 8px;" onclick="setTimeout(() => { window.location.href = 'https://99app.com'; }, 500);">
              <img src="https://logo.clearbit.com/99app.com" alt="99" style="width: 20px; height: 20px; border-radius: 4px;" onerror="this.style.display='none'" /> 99 App
            </a>
            <a href="https://moovitapp.com/?to=Espa%C3%A7o%20Villa%20Rose&tll=-15.8789531_-48.0645607" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem; gap: 8px; grid-column: 1 / -1;">
              <img src="https://logo.clearbit.com/moovit.com" alt="Moovit" style="width: 20px; height: 20px; border-radius: 4px;" onerror="this.style.display='none'" /> Moovit
            </a>
          </div>
`;

if (oldMapLinksRegex.test(localHtml)) {
  localHtml = localHtml.replace(oldMapLinksRegex, newMapLinks.trim());
} else {
  console.warn("Could not find map links in local.html to replace");
}
fs.writeFileSync(localPath, localHtml);
console.log('Updated local.html with official logos');

// 2. Update presentes.js
const presentesPath = path.join(dir, 'js', 'presentes.js');
let presentesJs = fs.readFileSync(presentesPath, 'utf-8');

const oldStoresRegex = /const stores = \[\s*\{\s*label:\s*"Amazon"[\s\S]*?<\/div>\s*<\/div>\s*`\s*:\s*'';/m;

const newStoresCode = `const stores = [
    { label: "Amazon", url: \`https://www.amazon.com.br/s?k=\${searchName}\`, domain: "amazon.com.br" },
    { label: "Mercado Livre", url: \`https://lista.mercadolivre.com.br/\${searchName}\`, domain: "mercadolivre.com.br" },
    { label: "Shopee", url: \`https://shopee.com.br/search?keyword=\${searchName}\`, domain: "shopee.com.br" },
    { label: "Magalu", url: \`https://www.magazineluiza.com.br/busca/\${searchName}\`, domain: "magazineluiza.com.br" }
  ];

  const storesHTML = isAvailable ? \`
    <div style="margin: 1.25rem 0; text-align: center;">
      <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">Pesquisar este item em lojas oficiais:</p>
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
        \${stores.map(s => \`
          <a href="\${s.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; background: var(--bg-primary); padding: 6px 10px; border-radius: 8px; border: 1px solid var(--glass-border-strong); color: var(--text-primary); text-decoration: none; font-weight: 600; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
            <img src="https://logo.clearbit.com/\${s.domain}" alt="\${s.label}" style="width: 18px; height: 18px; border-radius: 4px;" onerror="this.style.display='none'" />
            \${s.label}
          </a>\`).join('')}
      </div>
    </div>
  \` : '';`;

if (oldStoresRegex.test(presentesJs)) {
  presentesJs = presentesJs.replace(oldStoresRegex, newStoresCode);
} else {
  console.warn("Could not find stores HTML in presentes.js to replace");
}

// Ensure the Whatsapp button in PIX modal also uses official logo instead of emoji
const oldWhatsappBtn = /whatsappBtn\.innerHTML = '📱 Avisar os Noivos \(WhatsApp\)';/;
const newWhatsappBtn = `whatsappBtn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:20px; height:20px; margin-right:8px;" /> Avisar os Noivos no WhatsApp';`;
presentesJs = presentesJs.replace(oldWhatsappBtn, newWhatsappBtn);

fs.writeFileSync(presentesPath, presentesJs);
console.log('Updated presentes.js with official logos');
