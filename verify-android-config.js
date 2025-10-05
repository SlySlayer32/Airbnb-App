#!/usr/bin/env node

/**
 * Verification script for Android package configuration
 * This script verifies that the required Android package and iOS bundle identifier
 * are properly configured in app.json
 */

const config = require('@expo/config');
const path = require('path');

console.log('\n🔍 Verifying Android Package Configuration...\n');

try {
  // Get the Expo configuration
  const projectRoot = __dirname;
  const { exp } = config.getConfig(projectRoot);

  let hasErrors = false;

  // Check Android package
  console.log('📱 Android Configuration:');
  if (exp.android && exp.android.package) {
    console.log('  ✓ android.package:', exp.android.package);
    
    // Validate package name format
    const packageRegex = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
    if (packageRegex.test(exp.android.package)) {
      console.log('  ✓ Package format is valid (follows Java naming conventions)');
    } else {
      console.log('  ✗ Package format is invalid');
      hasErrors = true;
    }
  } else {
    console.log('  ✗ android.package is missing!');
    hasErrors = true;
  }

  // Check Android version code
  if (exp.android && exp.android.versionCode) {
    console.log('  ✓ android.versionCode:', exp.android.versionCode);
  } else {
    console.log('  ⚠ android.versionCode is missing (recommended for versioning)');
  }

  // Check iOS bundle identifier
  console.log('\n🍎 iOS Configuration:');
  if (exp.ios && exp.ios.bundleIdentifier) {
    console.log('  ✓ ios.bundleIdentifier:', exp.ios.bundleIdentifier);
  } else {
    console.log('  ⚠ ios.bundleIdentifier is missing (recommended for consistency)');
  }

  // Check consistency
  console.log('\n🔗 Cross-Platform Consistency:');
  if (exp.android?.package && exp.ios?.bundleIdentifier) {
    if (exp.android.package === exp.ios.bundleIdentifier) {
      console.log('  ✓ Android package and iOS bundle identifier match');
    } else {
      console.log('  ⚠ Android package and iOS bundle identifier differ');
      console.log('    This is acceptable but may cause confusion');
    }
  }

  // Summary
  if (hasErrors) {
    console.log('\n❌ Configuration has errors that need to be fixed\n');
    process.exit(1);
  } else {
    console.log('\n✅ Configuration Verification Complete!');
    console.log('\nThe app can now be:');
    console.log('  • Opened and debugged on Android devices');
    console.log('  • Built for Android with proper app identification');
    console.log('  • Deployed to Google Play Store');
    console.log('  • Debugged with VS Code and other development tools\n');
  }

} catch (error) {
  console.error('\n✗ Configuration verification failed:', error.message);
  console.error('\nPlease ensure:');
  console.error('  1. app.json exists and is valid JSON');
  console.error('  2. @expo/config package is installed');
  console.error('  3. You are running this from the project root\n');
  process.exit(1);
}
