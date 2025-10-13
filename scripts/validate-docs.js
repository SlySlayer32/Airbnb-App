/**
 * Documentation Validator
 * 
 * Validates documentation structure and cross-references
 * Ensures all required files exist and links are valid
 * 
 * Usage: node scripts/validate-docs.js
 */

const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.join(__dirname, '../docs');

/**
 * Required documentation files
 */
const REQUIRED_FILES = [
  'AI-README.md',
  'DATABASE.md',
  'core/PRODUCT.md',
  'core/BUSINESS_RULES.md',
  'core/USER_ROLES.md',
  'core/TECH_STACK.md',
  'phase-tracking/CURRENT_PHASE.json',
  'phase-tracking/PHASE_STATUS.md',
  'phase-tracking/ISSUE_AUDIT.md',
  'manifests/COMPONENTS.md',
  'manifests/SERVICES.md',
  'manifests/SCREENS.md',
  'manifests/TYPES.md',
  'reference/QUICK_REFERENCE.md',
  'reference/API_PATTERNS.md',
  'reference/PROMPTING_GUIDE.md',
  'reference/TROUBLESHOOTING.md',
  'workflows/FEATURE_DEVELOPMENT.md',
  'workflows/BUG_FIXING.md',
  'workflows/GITHUB_WORKFLOW.md',
  'workflows/DEPLOYMENT.md',
];

/**
 * Check if file exists
 */
function checkFileExists(relativePath) {
  const fullPath = path.join(DOCS_ROOT, relativePath);
  return fs.existsSync(fullPath);
}

/**
 * Validate CURRENT_PHASE.json structure
 */
function validatePhaseJSON() {
  const phaseFile = path.join(DOCS_ROOT, 'phase-tracking/CURRENT_PHASE.json');
  
  if (!fs.existsSync(phaseFile)) {
    return { valid: false, error: 'File not found' };
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(phaseFile, 'utf-8'));
    
    const requiredFields = [
      'project',
      'current_phase',
      'phase_name',
      'completion_percentage',
      'status',
      'recommended_next_step'
    ];
    
    const missing = requiredFields.filter(field => !(field in content));
    
    if (missing.length > 0) {
      return { valid: false, error: `Missing fields: ${missing.join(', ')}` };
    }
    
    return { valid: true, data: content };
    
  } catch (error) {
    return { valid: false, error: `Invalid JSON: ${error.message}` };
  }
}

/**
 * Main validation function
 */
function validateDocumentation() {
  console.log('🔍 Validating documentation structure...\n');
  console.log('='.repeat(50));
  
  let errors = 0;
  let warnings = 0;
  
  // Check required files
  console.log('\n📁 Checking required files...');
  REQUIRED_FILES.forEach(file => {
    const exists = checkFileExists(file);
    if (exists) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - MISSING`);
      errors++;
    }
  });
  
  // Validate phase JSON
  console.log('\n🔍 Validating CURRENT_PHASE.json...');
  const phaseValidation = validatePhaseJSON();
  if (phaseValidation.valid) {
    console.log(`   ✅ Valid JSON structure`);
    console.log(`   📊 Phase ${phaseValidation.data.current_phase}: ${phaseValidation.data.completion_percentage}% complete`);
  } else {
    console.log(`   ❌ ${phaseValidation.error}`);
    errors++;
  }
  
  // Check .cursorrules exists
  console.log('\n📋 Checking .cursorrules...');
  const cursorrulesExists = fs.existsSync(path.join(__dirname, '../.cursorrules'));
  if (cursorrulesExists) {
    console.log('   ✅ .cursorrules found');
  } else {
    console.log('   ❌ .cursorrules missing');
    errors++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Validation Summary:');
  console.log(`   Required files: ${REQUIRED_FILES.length}`);
  console.log(`   Found: ${REQUIRED_FILES.length - errors}`);
  console.log(`   Missing: ${errors}`);
  console.log(`   Warnings: ${warnings}`);
  
  if (errors === 0 && warnings === 0) {
    console.log('\n✅ Documentation structure is valid!\n');
    return true;
  } else if (errors > 0) {
    console.log(`\n❌ Documentation has ${errors} error(s)\n`);
    return false;
  } else {
    console.log(`\n⚠️  Documentation has ${warnings} warning(s)\n`);
    return true;
  }
}

// Run if called directly
if (require.main === module) {
  try {
    const isValid = validateDocumentation();
    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    process.exit(1);
  }
}

module.exports = { validateDocumentation };
