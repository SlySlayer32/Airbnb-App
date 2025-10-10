/**
 * Manifest Generator
 * 
 * Scans codebase and reports file counts for manifest updates
 * Helps keep documentation synchronized with code
 * 
 * Usage: node scripts/generate-manifests.js
 */

const fs = require('fs');
const path = require('path');

const DIRECTORIES = {
  components: path.join(__dirname, '../components'),
  services: path.join(__dirname, '../services'),
  screens: path.join(__dirname, '../app'),
  types: path.join(__dirname, '../types'),
};

/**
 * Count files in directory
 */
function countFiles(dir, extension) {
  if (!fs.existsSync(dir)) {
    return { count: 0, files: [] };
  }
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  const matchingFiles = files
    .filter(file => file.isFile() && file.name.endsWith(extension))
    .map(file => file.name);
  
  return {
    count: matchingFiles.length,
    files: matchingFiles
  };
}

/**
 * Count files recursively
 */
function countFilesRecursive(dir, extension) {
  if (!fs.existsSync(dir)) {
    return { count: 0, files: [] };
  }
  
  let files = [];
  
  function scan(currentDir, prefix = '') {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    items.forEach(item => {
      if (item.isFile() && item.name.endsWith(extension)) {
        files.push(prefix + item.name);
      } else if (item.isDirectory() && !item.name.startsWith('.')) {
        scan(path.join(currentDir, item.name), prefix + item.name + '/');
      }
    });
  }
  
  scan(dir);
  
  return {
    count: files.length,
    files: files
  };
}

/**
 * Categorize components by role
 */
function categorizeComponents(files) {
  const cleaner = files.filter(f => f.startsWith('Cleaner'));
  const owner = files.filter(f => f.startsWith('Owner'));
  const shared = files.filter(f => !f.startsWith('Cleaner') && !f.startsWith('Owner'));
  
  return { cleaner, owner, shared };
}

/**
 * Main report function
 */
function generateManifestReport() {
  console.log('📊 Manifest Generator Report\n');
  console.log('='.repeat(50));
  
  // Components
  const components = countFiles(DIRECTORIES.components, '.tsx');
  const componentCategories = categorizeComponents(components.files);
  
  console.log('\n🧩 COMPONENTS');
  console.log(`   Total: ${components.count} files`);
  console.log(`   Cleaner-specific: ${componentCategories.cleaner.length}`);
  console.log(`   Owner-specific: ${componentCategories.owner.length}`);
  console.log(`   Shared: ${componentCategories.shared.length}`);
  
  // Services
  const services = countFiles(DIRECTORIES.services, '.ts');
  const serviceFiles = services.files.filter(f => 
    f !== 'index.ts' && !f.includes('.test.ts')
  );
  
  console.log('\n🔧 SERVICES');
  console.log(`   Total: ${serviceFiles.length} services`);
  serviceFiles.forEach(f => console.log(`   - ${f}`));
  
  // Screens
  const screens = countFilesRecursive(DIRECTORIES.screens, '.tsx');
  
  console.log('\n📱 SCREENS');
  console.log(`   Total: ${screens.count} screens`);
  console.log(`   Main: ${screens.files.filter(f => !f.includes('auth/')).length}`);
  console.log(`   Auth: ${screens.files.filter(f => f.includes('auth/')).length}`);
  
  // Types
  console.log('\n📝 TYPES');
  console.log(`   File: types/index.ts`);
  console.log(`   Interfaces: ~20+ (see TYPES.md)`);
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Report complete!\n');
  console.log('📝 Update these files if counts changed:');
  console.log('   - docs/manifests/COMPONENTS.md');
  console.log('   - docs/manifests/SERVICES.md');
  console.log('   - docs/manifests/SCREENS.md');
  console.log('   - docs/AI-README.md (update counts)');
  console.log('');
  
  return {
    components: components.count,
    services: serviceFiles.length,
    screens: screens.count
  };
}

// Run if called directly
if (require.main === module) {
  try {
    generateManifestReport();
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    process.exit(1);
  }
}

module.exports = { generateManifestReport };

