const sharp = require('sharp');
const fs = require('fs');

async function compressImage() {
  const inputPath = 'assets/images/capa.jpg';
  const outputPath = 'assets/images/capa.webp';

  try {
    await sharp(inputPath)
      .resize(1920) // Resize to max 1920 width to save space
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log('Image compressed successfully.');
  } catch (error) {
    console.error('Error compressing image:', error);
  }
}

compressImage();
