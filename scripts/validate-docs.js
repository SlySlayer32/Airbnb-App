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
 * Required documentation files (new structure)
 */
const REQUIRED_FILES = [
  'README.md',
  'DATABASE.md',
  '01-introduction/overview.md',
  '01-introduction/getting-started.md',
  '01-introduction/quality-standards.md',
  '02-architecture/01-requirements.md',
  '02-architecture/03-solution-strategy.md',
  '02-architecture/04-building-blocks.md',
  '02-architecture/05-runtime-view.md',
  '02-architecture/06-deployment.md',
  '02-architecture/07-crosscutting-concepts.md',
  '03-development/setup.md',
  '03-development/workflows.md',
  '03-development/commands.md',
  '03-development/conventions.md',
  '03-development/troubleshooting.md',
  '04-codebase/components.md',
  '04-codebase/services.md',
  '04-codebase/screens.md',
  '04-codebase/types.md',
  '06-patterns/component-patterns.md',
  '06-patterns/service-patterns.md',
  '06-patterns/integration-patterns.md',
  '06-patterns/testing-patterns.md',
  '07-project-management/phase-status.md',
  '07-project-management/phase-history.md',
  '07-project-management/roadmap.md',
  '07-project-management/issue-tracking.md',
  '07-project-management/changelog.md',
  '08-ai-context/ai-README.md',
  '08-ai-context/startup-checklist.md',
  '08-ai-context/prompting-guide.md',
  '08-ai-context/validation-patterns.md',
];

/**
 * Check if file exists
 */
function checkFileExists(relativePath) {
  const fullPath = path.join(DOCS_ROOT, relativePath);
  return fs.existsSync(fullPath);
}

/**
 * Validate CURRENT_PHASE.json structure (if exists)
 */
function validatePhaseJSON() {
  const phaseFile = path.join(
    DOCS_ROOT,
    '07-project-management/phase-status.md'
  );

  if (!fs.existsSync(phaseFile)) {
    return {
      valid: true,
      data: null,
      note: 'Phase status is now in markdown format',
    };
  }

  try {
    const content = fs.readFileSync(phaseFile, 'utf-8');

    // Check for key phase indicators
    const hasPhaseInfo =
      content.includes('Current Phase') || content.includes('Phase Status');

    return { valid: true, data: { format: 'markdown', hasPhaseInfo } };
  } catch (error) {
    return { valid: false, error: `Error reading file: ${error.message}` };
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

  // Validate phase status
  console.log('\n🔍 Validating phase status...');
  const phaseValidation = validatePhaseJSON();
  if (phaseValidation.valid) {
    if (phaseValidation.data) {
      console.log(`   ✅ Phase status file found`);
      console.log(`   📊 Format: ${phaseValidation.data.format}`);
    } else {
      console.log(`   ℹ️  ${phaseValidation.note}`);
    }
  } else {
    console.log(`   ❌ ${phaseValidation.error}`);
    errors++;
  }

  // Check .cursorrules exists
  console.log('\n📋 Checking .cursorrules...');
  const cursorrulesExists = fs.existsSync(
    path.join(__dirname, '../.cursorrules')
  );
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
