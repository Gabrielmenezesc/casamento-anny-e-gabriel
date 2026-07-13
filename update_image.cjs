const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
files.push('css/home.css', 'css/style.css');

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/capa\.jpg/g, 'capa.webp');
  fs.writeFileSync(filePath, content);
}
console.log('Updated image references');
