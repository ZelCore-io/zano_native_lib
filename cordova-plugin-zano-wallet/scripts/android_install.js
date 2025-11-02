#!/usr/bin/env node

/**
 * Android post-install hook
 * Verifies Android native build configuration
 */

const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    console.log('Verifying Android native build configuration...');

    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');

    if (!fs.existsSync(platformRoot)) {
        console.log('Android platform not yet added, skipping verification');
        return;
    }

    const appBuildGradle = path.join(platformRoot, 'app/build.gradle');

    if (!fs.existsSync(appBuildGradle)) {
        console.warn('WARNING: build.gradle not found at', appBuildGradle);
        console.warn('CMake configuration may not be applied yet');
        return;
    }

    const buildGradleContent = fs.readFileSync(appBuildGradle, 'utf8');

    // Check if CMake configuration is present
    if (buildGradleContent.includes('externalNativeBuild')) {
        console.log('✓ CMake configuration present in build.gradle');
    } else {
        console.warn('⚠ CMake configuration not yet applied');
        console.warn('  It will be added when the platform is prepared');
    }

    // Verify plugin directory exists
    const pluginJniPath = path.join(context.opts.projectRoot, 'plugins/cordova-plugin-zano-wallet/src/android/jni');
    if (fs.existsSync(pluginJniPath)) {
        console.log('✓ JNI source directory present');
    } else {
        console.warn('⚠ JNI source directory not found');
    }

    console.log('Android configuration verification complete!');
};
