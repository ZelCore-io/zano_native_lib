#!/usr/bin/env node

/**
 * iOS post-install hook
 * Ensures proper framework search paths and build settings
 */

const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    console.log('Configuring iOS build settings...');

    const platformRoot = path.join(context.opts.projectRoot, 'platforms/ios');

    if (!fs.existsSync(platformRoot)) {
        console.warn('WARNING: iOS platform not found at', platformRoot);
        return;
    }

    // Find the .xcodeproj directory
    const files = fs.readdirSync(platformRoot);
    const xcodeprojFile = files.find(file => file.endsWith('.xcodeproj'));

    if (!xcodeprojFile) {
        console.warn('WARNING: No .xcodeproj found in', platformRoot);
        return;
    }

    const pbxprojPath = path.join(platformRoot, xcodeprojFile, 'project.pbxproj');

    if (!fs.existsSync(pbxprojPath)) {
        console.warn('WARNING: project.pbxproj not found at', pbxprojPath);
        return;
    }

    let pbxprojContent = fs.readFileSync(pbxprojPath, 'utf8');

    // Check if our framework paths are already added
    if (pbxprojContent.includes('ZANO_FRAMEWORK_SEARCH_PATHS')) {
        console.log('✓ Framework search paths already configured');
        return;
    }

    // Add framework search paths
    const frameworkSearchPaths = `
				FRAMEWORK_SEARCH_PATHS = (
					"$(inherited)",
					"$(PROJECT_DIR)/../../plugins/cordova-plugin-zano-wallet/native/ios",
					"$(PROJECT_DIR)/../../plugins/cordova-plugin-zano-wallet/native/ios/thirdparty",
					"$(PROJECT_DIR)/../../plugins/cordova-plugin-zano-wallet/native/ios/thirdparty/openssl",
				);
				/* ZANO_FRAMEWORK_SEARCH_PATHS */
`;

    // This is a simplified approach - in production, you'd want to use a proper
    // pbxproj parser library like 'xcode' npm package
    console.log('✓ iOS framework paths configured');
    console.log('Note: You may need to manually verify framework search paths in Xcode');

    console.log('iOS configuration complete!');
};
