#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🧹 Cleaning up dependency conflicts...\n');

// Detect platform
const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';

console.log(`🖥️  Detected platform: ${os.platform()}\n`);

// Function to run commands safely
function runCommand(command, description, options = {}) {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, {
      stdio: 'inherit',
      shell: isWindows,
      ...options
    });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    if (options.continueOnError) {
      console.log(`⚠️  Continuing despite error...\n`);
      return false;
    }
    process.exit(1);
  }
  return true;
}

// Function to safely remove files/directories
function safeRemove(target, description) {
  try {
    if (fs.existsSync(target)) {
      console.log(`🗑️  ${description}...`);
      if (fs.statSync(target).isDirectory()) {
        fs.rmSync(target, { recursive: true, force: true });
      } else {
        fs.unlinkSync(target);
      }
      console.log(`✅ ${description} completed\n`);
    } else {
      console.log(`ℹ️  ${description} not found, skipping\n`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${target}:`, error.message);
    console.log(`⚠️  Continuing...\n`);
  }
}

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root.');
  process.exit(1);
}

console.log('📁 Working directory:', process.cwd());

// Clean up existing installations
console.log('🗑️  Removing existing node_modules and lock files...');
safeRemove('node_modules', 'Removing node_modules directory');
safeRemove('package-lock.json', 'Removing package-lock.json');
safeRemove('yarn.lock', 'Removing yarn.lock');
safeRemove('pnpm-lock.yaml', 'Removing pnpm-lock.yaml');

// Clear various caches
console.log('🧹 Clearing caches...');

// Clear npm cache
runCommand('npm cache clean --force', 'Clearing npm cache', { continueOnError: true });

// Clear yarn cache if yarn is available
runCommand('yarn cache clean', 'Clearing yarn cache', { continueOnError: true });

// Clear Expo cache
runCommand('npx expo install --fix', 'Fixing Expo dependencies', { continueOnError: true });

// Clear Metro cache
const metroCacheDir = path.join(os.homedir(), '.metro');
safeRemove(metroCacheDir, 'Clearing Metro cache');

// Clear Expo cache directory
const expoCacheDir = path.join(os.homedir(), '.expo');
safeRemove(expoCacheDir, 'Clearing Expo cache');

// Clear React Native cache
if (isWindows) {
  runCommand('rmdir /s /q %TEMP%\\react-*', 'Clearing React Native temp files', { continueOnError: true });
  runCommand('rmdir /s /q %TEMP%\\metro-*', 'Clearing Metro temp files', { continueOnError: true });
} else {
  runCommand('rm -rf $TMPDIR/react-*', 'Clearing React Native temp files', { continueOnError: true });
  runCommand('rm -rf $TMPDIR/metro-*', 'Clearing Metro temp files', { continueOnError: true });
}

// Install dependencies
console.log('📦 Installing dependencies...');
runCommand('npm install', 'Installing npm dependencies');

// Verify installation
console.log('🔍 Verifying installation...');
runCommand('npm run type-check', 'Running TypeScript type check', { continueOnError: true });

// Additional verification
runCommand('npx expo doctor', 'Running Expo doctor', { continueOnError: true });

console.log('🎉 Dependency cleanup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm run dev" to start the development server');
console.log('2. Run "npm run validate" to check everything is working');
console.log('3. If you encounter any issues, run "npm run doctor" for diagnostics');
console.log('\n🔧 Platform-specific notes:');
if (isWindows) {
  console.log('- Windows: If you encounter permission errors, try running as Administrator');
  console.log('- Windows: Make sure Windows Defender isn\'t blocking the operations');
} else if (isMac) {
  console.log('- macOS: If you encounter permission errors, check your npm permissions');
} else {
  console.log('- Linux: Make sure you have proper file permissions');
}
