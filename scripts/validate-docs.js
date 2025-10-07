#!/usr/bin/env node

/**
 * Documentation Validation Script
 * 
 * Validates that .ai/ documentation structure is complete and properly organized.
 * 
 * Usage: node scripts/validate-docs.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const AI_DIR = path.join(PROJECT_ROOT, '.ai');

console.log('🔍 Validating .ai/ documentation structure...\n');

// Required files in .ai/ directory
const REQUIRED_FILES = [
  'README.md',
  'QUICK_REFERENCE.md',
  'COMPONENT_MANIFEST.md',
  'SERVICE_MANIFEST.md',
  'SCREEN_MANIFEST.md',
  'CONVENTIONS.md',
  'WORKFLOWS.md',
  'PROMPTING_GUIDE.md',
  'GITHUB_WORKFLOW.md',
  'TROUBLESHOOTING.md',
  'MIGRATION_GUIDE.md',
];

// Check if .ai/ directory exists
if (!fs.existsSync(AI_DIR)) {
  console.error('❌ .ai/ directory not found!');
  process.exit(1);
}

console.log('✅ .ai/ directory exists\n');

// Check each required file
let allFilesPresent = true;
let totalSize = 0;

console.log('📄 Checking required files:\n');

REQUIRED_FILES.forEach(file => {
  const filePath = path.join(AI_DIR, file);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    
    console.log(`   ✅ ${file.padEnd(30)} (${sizeKB} KB)`);
  } else {
    console.log(`   ❌ ${file.padEnd(30)} MISSING`);
    allFilesPresent = false;
  }
});

console.log('');
console.log(`📊 Total Documentation Size: ${(totalSize / 1024).toFixed(2)} KB`);
console.log('');

// Check for proper cross-references
console.log('🔗 Checking cross-references:\n');

const readmeContent = fs.readFileSync(path.join(AI_DIR, 'README.md'), 'utf8');
const hasQuickRefLink = readmeContent.includes('QUICK_REFERENCE.md');
const hasComponentLink = readmeContent.includes('COMPONENT_MANIFEST.md');
const hasServiceLink = readmeContent.includes('SERVICE_MANIFEST.md');

console.log(`   ${hasQuickRefLink ? '✅' : '❌'} README links to QUICK_REFERENCE`);
console.log(`   ${hasComponentLink ? '✅' : '❌'} README links to COMPONENT_MANIFEST`);
console.log(`   ${hasServiceLink ? '✅' : '❌'} README links to SERVICE_MANIFEST`);
console.log('');

// Check root README reference
const rootReadmePath = path.join(PROJECT_ROOT, 'README.md');
const rootReadmeContent = fs.readFileSync(rootReadmePath, 'utf8');
const rootHasAiLink = rootReadmeContent.includes('.ai/README.md');

console.log('🏠 Checking root README:\n');
console.log(`   ${rootHasAiLink ? '✅' : '❌'} Root README links to .ai/README.md`);
console.log('');

// Summary
console.log('📋 Validation Summary:\n');

if (allFilesPresent && hasQuickRefLink && hasComponentLink && hasServiceLink && rootHasAiLink) {
  console.log('   ✅ All validation checks passed!');
  console.log('   📚 Documentation structure is complete and properly cross-referenced.');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. Run: node scripts/update-manifests.js (to verify counts)');
  console.log('   2. Test AI assistant comprehension');
  console.log('   3. Update CHANGELOG.md with documentation changes');
} else {
  console.log('   ⚠️  Some validation checks failed. Please review above.');
  process.exit(1);
}
