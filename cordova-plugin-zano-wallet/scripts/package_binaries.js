#!/usr/bin/env node

/**
 * Packages native libraries for GitHub release
 * Creates a compressed archive of Android and iOS libraries
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = require('../package.json').version;
const ROOT_DIR = path.resolve(__dirname, '../..');
const PLUGIN_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = `zano-native-libs-v${VERSION}.tar.gz`;

console.log('Packaging native libraries for release...');
console.log(`Version: ${VERSION}`);

// Paths to source libraries
const androidSrc = path.join(ROOT_DIR, '_install_android');
const iosSrc = path.join(ROOT_DIR, '_install_ios', 'lib');

// Check if source directories exist
if (!fs.existsSync(androidSrc)) {
    console.error('ERROR: Android libraries not found at:', androidSrc);
    console.error('Please run build_android_libs.sh first');
    process.exit(1);
}

if (!fs.existsSync(iosSrc)) {
    console.error('ERROR: iOS libraries not found at:', iosSrc);
    console.error('Please run build_ios_libs.sh first');
    process.exit(1);
}

// Create temporary directory structure
const tempDir = path.join(PLUGIN_DIR, 'temp_native');
const androidDest = path.join(tempDir, 'android');
const iosDest = path.join(tempDir, 'ios');

console.log('Creating temporary directory...');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Copy libraries
console.log('Copying Android libraries...');
copyRecursive(androidSrc, androidDest);

console.log('Copying iOS libraries...');
copyRecursive(iosSrc, iosDest);

// Create archive
console.log('Creating compressed archive...');
const outputPath = path.join(PLUGIN_DIR, OUTPUT_FILE);
try {
    // Use tar to create compressed archive
    execSync(`tar -czf "${outputPath}" -C "${tempDir}" .`, { stdio: 'inherit' });

    // Get file size
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n✓ Package created successfully!');
    console.log(`  File: ${OUTPUT_FILE}`);
    console.log(`  Size: ${sizeMB} MB`);
    console.log(`  Path: ${outputPath}`);
    console.log('\nNext steps:');
    console.log('1. Create a new GitHub release with tag v' + VERSION);
    console.log('2. Upload this file as a release asset');
    console.log('3. Publish the plugin to npm');
} catch (error) {
    console.error('Error creating archive:', error.message);
    process.exit(1);
} finally {
    // Clean up
    console.log('\nCleaning up...');
    fs.rmSync(tempDir, { recursive: true });
}

function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
