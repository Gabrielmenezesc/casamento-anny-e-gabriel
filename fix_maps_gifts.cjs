const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';

// 1. Fix presentes.js - Default select 'named'
const presentesPath = path.join(dir, 'js', 'presentes.js');
let presentesJs = fs.readFileSync(presentesPath, 'utf-8');

const defaultOptionCode = `
  openModal('modal-reserve');
  
  // Select named by default to prevent disabled button confusion
  const optNamed = document.querySelector('.reserve-option[data-mode="named"]');
  if (optNamed) optNamed.click();
`;
presentesJs = presentesJs.replace(/openModal\('modal-reserve'\);/, defaultOptionCode);
fs.writeFileSync(presentesPath, presentesJs);
console.log('Fixed presentes.js default option');

// 2. Add Maps links to local.html
const localPath = path.join(dir, 'local.html');
let localHtml = fs.readFileSync(localPath, 'utf-8');

const mapLinksHtml = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
            <a href="https://maps.app.goo.gl/EuzcXbutFQzt9vD48" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem;">
              🗺️ Google Maps
            </a>
            <a href="https://waze.com/ul?ll=-15.8789531,-48.0645607&navigate=yes" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem;">
              🚗 Waze
            </a>
            <a href="https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=-15.8789531&dropoff[longitude]=-48.0645607&dropoff[nickname]=Espa%C3%A7o%20Villa%20Rose" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem;">
              🚕 Uber
            </a>
            <a href="https://moovitapp.com/?to=Espa%C3%A7o%20Villa%20Rose&tll=-15.8789531_-48.0645607" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="justify-content: center; padding: 0.75rem; font-size: 0.875rem;">
              🚌 Moovit
            </a>
          </div>
`;

// Replace the old google maps button
const oldGoogleBtn = /<a\s+href="https:\/\/maps\.app\.goo\.gl\/EuzcXbutFQzt9vD48"[\s\S]*?<\/a>/;
localHtml = localHtml.replace(oldGoogleBtn, mapLinksHtml);

fs.writeFileSync(localPath, localHtml);
console.log('Added map links to local.html');
