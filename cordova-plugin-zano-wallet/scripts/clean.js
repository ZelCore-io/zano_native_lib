#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const wwwDir = path.join(__dirname, '..', 'www');

// Files to clean
const patterns = ['.js', '.d.ts', '.js.map'];

try {
  if (fs.existsSync(wwwDir)) {
    const files = fs.readdirSync(wwwDir);

    files.forEach(file => {
      if (patterns.some(pattern => file.endsWith(pattern))) {
        const filePath = path.join(wwwDir, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`Removed: ${file}`);
        } catch (err) {
          console.warn(`Could not remove ${file}: ${err.message}`);
        }
      }
    });

    console.log('Clean completed successfully');
  } else {
    console.log('www directory does not exist, nothing to clean');
  }
} catch (err) {
  console.error('Clean script error:', err.message);
  process.exit(0); // Don't fail the build
}
