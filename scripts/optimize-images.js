const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Images to optimize (the large product images)
const imagesToOptimize = [
  '1.png',
  '2.png',
  '3.png',
  '4.png',
  '5.png',
  'funeral.png',
  'funeral2.png',
];

async function optimizeImage(filename) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, filename.replace('.png', '.webp'));

  console.log(`Optimizing ${filename}...`);

  try {
    const info = await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const newSize = info.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(2);

    console.log(`✓ ${filename} -> ${filename.replace('.png', '.webp')}`);
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Optimized: ${(newSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Savings: ${savings}%\n`);

    return { original: originalSize, optimized: newSize };
  } catch (error) {
    console.error(`✗ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Starting image optimization...\n');

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const filename of imagesToOptimize) {
    const result = await optimizeImage(filename);
    if (result) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
    }
  }

  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(2);

  console.log('=================================');
  console.log('OPTIMIZATION COMPLETE');
  console.log('=================================');
  console.log(`Total original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total optimized size: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total savings: ${totalSavings}%`);
  console.log('\nNext steps:');
  console.log('1. Update image references from .png to .webp in your components');
  console.log('2. You can keep the .png files as fallback or delete them');
}

main().catch(console.error);
