#!/usr/bin/env node

/**
 * Update Manifests Script
 *
 * Scans the codebase and updates file counts in .ai/ manifest files
 * to keep documentation synchronized with actual code.
 *
 * Usage: node scripts/update-manifests.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const PROJECT_ROOT = path.join(__dirname, '..');
const AI_DIR = path.join(PROJECT_ROOT, '.ai');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');
const SERVICES_DIR = path.join(PROJECT_ROOT, 'services');
const APP_DIR = path.join(PROJECT_ROOT, 'app');

console.log('🔄 Updating .ai/ manifests with current file counts...\n');

/**
 * Count files in a directory with specific extension
 */
function countFiles(dir, extension) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const files = fs.readdirSync(dir);
  return files.filter(file => file.endsWith(extension)).length;
}

/**
 * Count files recursively
 */
function countFilesRecursive(dir, extension) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  let count = 0;

  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);

    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.')) {
        traverse(filePath);
      } else if (file.endsWith(extension)) {
        count++;
      }
    });
  }

  traverse(dir);
  return count;
}

/**
 * Get list of component files
 */
function getComponentFiles() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx'))
    .map(file => file.replace('.tsx', ''));
}

/**
 * Get list of service files
 */
function getServiceFiles() {
  if (!fs.existsSync(SERVICES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(SERVICES_DIR)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.replace('.ts', ''));
}

/**
 * Get list of screen files
 */
function getScreenFiles() {
  if (!fs.existsSync(APP_DIR)) {
    return [];
  }

  const screens = [];

  // Main screens
  const mainFiles = fs
    .readdirSync(APP_DIR)
    .filter(file => file.endsWith('.tsx'));
  screens.push(...mainFiles);

  // Auth screens
  const authDir = path.join(APP_DIR, 'auth');
  if (fs.existsSync(authDir)) {
    const authFiles = fs
      .readdirSync(authDir)
      .filter(file => file.endsWith('.tsx'));
    screens.push(...authFiles.map(f => `auth/${f}`));
  }

  return screens;
}

// Get current counts
const componentCount = countFiles(COMPONENTS_DIR, '.tsx');
const serviceCount = countFiles(SERVICES_DIR, '.ts') - 1; // Exclude index.ts
const screenCount = countFilesRecursive(APP_DIR, '.tsx');

console.log('📊 Current File Counts:');
console.log(`   Components: ${componentCount}`);
console.log(`   Services: ${serviceCount}`);
console.log(`   Screens: ${screenCount}`);
console.log('');

// List files
console.log('📝 Component Files:');
getComponentFiles().forEach(name => console.log(`   - ${name}`));
console.log('');

console.log('📝 Service Files:');
getServiceFiles().forEach(name => console.log(`   - ${name}`));
console.log('');

console.log('📝 Screen Files:');
getScreenFiles().forEach(name => console.log(`   - ${name}`));
console.log('');

console.log('✅ Manifest scan complete!');
console.log('');
console.log('💡 To update the actual manifest files:');
console.log('   1. Compare counts above with .ai/README.md');
console.log('   2. Verify new components are in .ai/COMPONENT_MANIFEST.md');
console.log('   3. Verify new services are in .ai/SERVICE_MANIFEST.md');
console.log('   4. Verify new screens are in .ai/SCREEN_MANIFEST.md');
console.log('');
console.log('📚 Note: This script provides counts. Manual documentation');
console.log('   of new files is still required for complete manifest entries.');
