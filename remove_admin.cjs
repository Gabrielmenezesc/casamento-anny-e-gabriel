const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/<a href="admin\.html"[^>]*>⚙️ Admin<\/a>\s*/g, '');
  fs.writeFileSync(filePath, content);
}

console.log('Removed admin links from all HTML files.');
