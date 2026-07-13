const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace raw hsl backgrounds with serenity blue dark tones
  // Old: linear-gradient(145deg, hsl(38, 40%, 10%), hsl(30, 25%, 8%))
  // New: linear-gradient(145deg, hsl(215, 30%, 15%), hsl(215, 25%, 10%))
  content = content.replace(/linear-gradient\(145deg,\s*hsl\(38,\s*40%,\s*10%\),\s*hsl\(30,\s*25%,\s*8%\)\)/g, 'linear-gradient(145deg, hsl(215, 30%, 15%), hsl(215, 25%, 10%))');
  
  // Old: linear-gradient(145deg, hsl(220, 25%, 8%), hsl(30, 25%, 10%))
  // New: linear-gradient(145deg, hsl(215, 25%, 12%), hsl(215, 20%, 8%))
  content = content.replace(/linear-gradient\(145deg,\s*hsl\(220,\s*25%,\s*8%\),\s*hsl\(30,\s*25%,\s*10%\)\)/g, 'linear-gradient(145deg, hsl(215, 25%, 12%), hsl(215, 20%, 8%))');

  // Old: radial-gradient(..., hsla(38, 72%, 55%, 0.15), transparent)
  // New: radial-gradient(..., hsla(215, 45%, 65%, 0.15), transparent)
  content = content.replace(/hsla\(38,\s*72%,\s*55%,\s*0\.15\)/g, 'hsla(215, 45%, 65%, 0.15)');
  
  // Replace the image placeholder color for gifts
  // Old: 400x300/f5efe6/c8a96a
  // New: 400x300/e8ecf1/91a8d0 (light gray bg / serenity blue text)
  content = content.replace(/400x300\/f5efe6\/c8a96a/g, '400x300/e8ecf1/91a8d0');

  fs.writeFileSync(filePath, content);
}
console.log('HTML files updated for Serenity theme');
