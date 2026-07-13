const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium';
const files = ['index.html', 'presentes.html', 'lua-de-mel.html'];

const fallbackQR = "https://api.qrserver.com/v1/create-qr-code/?data=00020126360014BR.GOV.BCB.PIX0111389916211355204000053039865802BR5911GABRIEL%20MEN6008BRASILIA62070503%2A%2A%2A6304ED15&size=240x240&margin=12&color=2-2-2&bgcolor=255-255-255&ecc=M";

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/id="pix-qrcode" src=""/g, `id="pix-qrcode" src="${fallbackQR}"`);
  fs.writeFileSync(filePath, content);
}
console.log('Fixed QR Code src');
