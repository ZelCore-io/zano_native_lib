#!/usr/bin/env node

/**
 * Downloads pre-built native libraries from GitHub releases
 * This runs as a post-install hook when installing from npm
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const GITHUB_REPO = 'zano/cordova-plugin-zano-wallet';
const RELEASE_TAG = 'v1.0.0'; // Update this with actual release
const BINARIES_ARCHIVE = `zano-native-libs-${RELEASE_TAG}.tar.gz`;

module.exports = async function(context) {
    console.log('Checking for native libraries...');

    const pluginDir = context.opts.plugin.dir;
    const nativeDir = path.join(pluginDir, 'native');
    const androidLibs = path.join(nativeDir, 'android');
    const iosLibs = path.join(nativeDir, 'ios');

    // Check if libraries already exist
    const hasAndroidLibs = fs.existsSync(path.join(androidLibs, 'arm64-v8a'));
    const hasBoostLibs = fs.existsSync(path.join(androidLibs, 'boost'));
    const hasOpenSSLLibs = fs.existsSync(path.join(androidLibs, 'openssl'));
    const hasIosLibs = fs.existsSync(path.join(iosLibs, 'libwallet.a.xcframework'));

    if (hasAndroidLibs && hasBoostLibs && hasOpenSSLLibs && hasIosLibs) {
        console.log('✓ Native libraries already present');
        return;
    }

    // Check if we're in the main repository (libraries available locally)
    const rootDir = path.resolve(pluginDir, '..');
    const localAndroid = path.join(rootDir, '_install_android');
    const localIos = path.join(rootDir, '_install_ios', 'lib');

    if (fs.existsSync(localAndroid) && fs.existsSync(localIos)) {
        console.log('Copying native libraries from local repository...');

        // Copy Android libraries with proper structure
        const abis = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64'];
        for (const abi of abis) {
            const srcLib = path.join(localAndroid, abi, 'lib');
            const destLib = path.join(androidLibs, abi, 'lib');
            if (fs.existsSync(srcLib)) {
                copyRecursive(srcLib, destLib);
                console.log(`  ✓ Copied ${abi} Zano libraries`);
            }
        }

        // Copy include headers
        const srcInclude = path.join(localAndroid, 'include');
        const destInclude = path.join(androidLibs, 'include');
        if (fs.existsSync(srcInclude)) {
            copyRecursive(srcInclude, destInclude);
            console.log('  ✓ Copied headers');
        }

        // Copy Boost libraries
        const boostSrc = path.join(rootDir, '_libs_android/boost');
        const boostDest = path.join(androidLibs, 'boost');
        if (fs.existsSync(boostSrc)) {
            for (const abi of abis) {
                const srcBoost = path.join(boostSrc, abi, 'lib');
                const destBoost = path.join(boostDest, abi, 'lib');
                if (fs.existsSync(srcBoost)) {
                    copyRecursive(srcBoost, destBoost);
                    console.log(`  ✓ Copied ${abi} Boost libraries`);
                }
            }
        }

        // Copy OpenSSL libraries
        const opensslSrc = path.join(rootDir, '_libs_android/openssl');
        const opensslDest = path.join(androidLibs, 'openssl');
        if (fs.existsSync(opensslSrc)) {
            for (const abi of abis) {
                const srcSsl = path.join(opensslSrc, abi, 'lib');
                const destSsl = path.join(opensslDest, abi, 'lib');
                if (fs.existsSync(srcSsl)) {
                    copyRecursive(srcSsl, destSsl);
                    console.log(`  ✓ Copied ${abi} OpenSSL libraries`);
                }
            }
        }

        // Copy iOS libraries
        copyRecursive(localIos, iosLibs);
        console.log('  ✓ Copied iOS libraries');

        console.log('✓ Native libraries copied from local repository');
        return;
    }

    // Download from GitHub releases
    console.log('Downloading pre-built native libraries from GitHub...');
    console.log(`Release: ${RELEASE_TAG}`);

    const downloadUrl = `https://github.com/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/${BINARIES_ARCHIVE}`;
    const archivePath = path.join(pluginDir, BINARIES_ARCHIVE);

    try {
        await downloadFile(downloadUrl, archivePath);
        console.log('✓ Downloaded native libraries');

        console.log('Extracting libraries...');
        await extractArchive(archivePath, nativeDir);
        console.log('✓ Extracted native libraries');

        // Clean up
        fs.unlinkSync(archivePath);
        console.log('✓ Native libraries ready');
    } catch (error) {
        console.error('✗ Failed to download/extract native libraries:', error.message);
        console.error('\nAlternative: You can manually download the libraries from:');
        console.error(`  ${downloadUrl}`);
        console.error(`And extract them to: ${nativeDir}`);
        console.error('\nOr build them yourself using build_android_libs.sh and build_ios_libs.sh');
        throw error;
    }
};

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Follow redirect
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Download failed with status ${response.statusCode}`));
                return;
            }

            const totalSize = parseInt(response.headers['content-length'], 10);
            let downloaded = 0;

            response.on('data', (chunk) => {
                downloaded += chunk.length;
                const percent = ((downloaded / totalSize) * 100).toFixed(1);
                process.stdout.write(`\rDownloading... ${percent}%`);
            });

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(''); // New line after progress
                resolve();
            });
        }).on('error', (err) => {
            fs.unlinkSync(dest);
            reject(err);
        });
    });
}

async function extractArchive(archivePath, destDir) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const command = `tar -xzf "${archivePath}" -C "${destDir}"`;
    await execAsync(command);
}

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) {
        return false;
    }

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

    return true;
}

// Allow running standalone
if (require.main === module) {
    module.exports({
        opts: {
            plugin: {
                dir: path.resolve(__dirname, '..')
            }
        }
    }).catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}
