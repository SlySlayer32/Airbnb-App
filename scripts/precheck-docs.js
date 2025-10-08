#!/usr/bin/env node

/**
 * Pre-check script to validate that required documentation scripts exist
 * before running npm scripts.
 * 
 * Usage: node scripts/precheck-docs.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const SCRIPTS_DIR = path.join(PROJECT_ROOT, 'scripts');

const REQUIRED_SCRIPTS = [
  'update-manifests.js',
  'validate-docs.js',
];

console.log('🔍 Checking documentation scripts...\n');

let allScriptsPresent = true;

REQUIRED_SCRIPTS.forEach(script => {
  const scriptPath = path.join(SCRIPTS_DIR, script);
  
  if (fs.existsSync(scriptPath)) {
    console.log(`   ✅ ${script}`);
  } else {
    console.log(`   ❌ ${script} - MISSING`);
    allScriptsPresent = false;
  }
});

console.log('');

if (!allScriptsPresent) {
  console.error('❌ Error: Required documentation scripts are missing!');
  console.error('');
  console.error('💡 How to fix:');
  console.error('   • Ensure scripts/update-manifests.js exists');
  console.error('   • Ensure scripts/validate-docs.js exists');
  console.error('   • Check that you have pulled the latest changes');
  console.error('');
  process.exit(1);
}

console.log('✅ All documentation scripts are present\n');
process.exit(0);
