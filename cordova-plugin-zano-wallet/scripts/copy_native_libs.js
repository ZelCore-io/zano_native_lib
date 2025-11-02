#!/usr/bin/env node

/**
 * This hook copies the pre-built Zano native libraries from the parent repository
 * into the plugin's native directory before installation.
 */

const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const pluginDir = context.opts.plugin.dir;
    const rootDir = path.resolve(pluginDir, '..');

    console.log('Copying Zano native libraries...');
    console.log('Plugin dir:', pluginDir);
    console.log('Root dir:', rootDir);

    // Paths
    const androidSrcDir = path.join(rootDir, '_install_android');
    const androidDestDir = path.join(pluginDir, 'native', 'android');
    const boostSrcDir = path.join(rootDir, '_libs_android', 'boost');
    const opensslSrcDir = path.join(rootDir, '_libs_android', 'openssl');

    const iosSrcDir = path.join(rootDir, '_install_ios', 'lib');
    const iosDestDir = path.join(pluginDir, 'native', 'ios');

    // Helper to copy directory recursively
    function copyRecursive(src, dest) {
        if (!fs.existsSync(src)) {
            console.warn('WARNING: Source directory does not exist:', src);
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

    // Copy Android libraries with proper structure
    console.log('Copying Android libraries...');
    const abis = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64'];
    let androidSuccess = true;

    for (const abi of abis) {
        const srcLib = path.join(androidSrcDir, abi, 'lib');
        const destLib = path.join(androidDestDir, abi, 'lib');
        if (fs.existsSync(srcLib)) {
            copyRecursive(srcLib, destLib);
            console.log(`  ✓ Copied ${abi} libraries`);
        } else {
            console.warn(`  ⚠ ${abi} libraries not found`);
            androidSuccess = false;
        }
    }

    // Copy include headers
    const srcInclude = path.join(androidSrcDir, 'include');
    const destInclude = path.join(androidDestDir, 'include');
    if (fs.existsSync(srcInclude)) {
        copyRecursive(srcInclude, destInclude);
        console.log('  ✓ Copied headers');
    } else {
        console.warn('  ⚠ Headers not found');
        androidSuccess = false;
    }

    if (androidSuccess) {
        console.log('✓ Android Zano libraries copied successfully');
    } else {
        console.error('✗ Failed to copy some Android libraries');
        console.error('  Make sure to run build_android_libs.sh first');
    }

    // Copy Boost libraries
    console.log('Copying Boost libraries...');
    if (fs.existsSync(boostSrcDir)) {
        for (const abi of abis) {
            const srcBoost = path.join(boostSrcDir, abi, 'lib');
            const destBoost = path.join(androidDestDir, 'boost', abi, 'lib');
            if (fs.existsSync(srcBoost)) {
                copyRecursive(srcBoost, destBoost);
                console.log(`  ✓ Copied ${abi} Boost libraries`);
            }
        }
    } else {
        console.warn('  ⚠ Boost libraries not found');
    }

    // Copy OpenSSL libraries
    console.log('Copying OpenSSL libraries...');
    if (fs.existsSync(opensslSrcDir)) {
        for (const abi of abis) {
            const srcSsl = path.join(opensslSrcDir, abi, 'lib');
            const destSsl = path.join(androidDestDir, 'openssl', abi, 'lib');
            if (fs.existsSync(srcSsl)) {
                copyRecursive(srcSsl, destSsl);
                console.log(`  ✓ Copied ${abi} OpenSSL libraries`);
            }
        }
    } else {
        console.warn('  ⚠ OpenSSL libraries not found');
    }

    // Copy iOS libraries
    console.log('Copying iOS libraries...');
    if (copyRecursive(iosSrcDir, iosDestDir)) {
        console.log('✓ iOS libraries copied successfully');
    } else {
        console.error('✗ Failed to copy iOS libraries');
        console.error('  Make sure to run build_ios_libs.sh first');
    }

    console.log('Native library copy complete!');
};
