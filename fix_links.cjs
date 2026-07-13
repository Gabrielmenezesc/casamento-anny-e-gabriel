const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';
const files = ['index.html', 'presentes.html'];
const link = 'https://link.infinitepay.io/gabrielmen10?origin=link-na-bio';

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/href="#"(\s+target="_blank"\s+rel="noopener noreferrer"[^>]*>🔗[^<]*Link PIX[^<]*)/gi, `href="${link}"$1`);
  content = content.replace(/href="#"(\s+target="_blank"\s+rel="noopener noreferrer"[^>]*>🔗 Acessar Link InfinitePay)/g, `href="${link}"$1`);
  fs.writeFileSync(filePath, content);
}
console.log('Fixed PIX links');
