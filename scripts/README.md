# Dependency Fix Scripts

This directory contains scripts to help resolve dependency conflicts and clean up your project.

## 🚀 Quick Start

### For Windows Users

```bash
npm run fix:dependencies:win
```

### For macOS/Linux Users

```bash
npm run fix:dependencies:unix
```

### Cross-Platform (Auto-detects OS)

```bash
npm run fix:dependencies
```

## 📋 What These Scripts Do

### 1. **Clean Installation Files**

- Removes `node_modules` directory
- Removes lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)

### 2. **Clear All Caches**

- npm cache
- yarn cache (if available)
- Metro bundler cache
- Expo cache
- React Native temp files

### 3. **Fix Expo Dependencies**

- Runs `npx expo install --fix` to ensure Expo packages are compatible

### 4. **Reinstall Dependencies**

- Runs `npm install` to install all dependencies fresh

### 5. **Verify Installation**

- Runs TypeScript type checking
- Runs Expo doctor for diagnostics

## 🔧 Platform-Specific Features

### Windows (`fix-dependencies.bat`)

- Uses Windows-native commands (`rmdir`, `del`)
- Handles Windows path separators
- Includes Windows-specific troubleshooting tips
- Pauses at the end to show results

### Cross-Platform (`fix-dependencies.js`)

- Auto-detects operating system
- Uses appropriate commands for each platform
- Handles file permissions gracefully
- Continues on non-critical errors

## 🛠️ Manual Steps (If Scripts Fail)

If the automated scripts don't work, you can run these commands manually:

### Windows

```cmd
REM Remove files
rmdir /s /q node_modules
del package-lock.json
del yarn.lock

REM Clear caches
npm cache clean --force
rmdir /s /q "%USERPROFILE%\.metro"
rmdir /s /q "%USERPROFILE%\.expo"

REM Reinstall
npm install
```

### macOS/Linux

```bash
# Remove files
rm -rf node_modules
rm -f package-lock.json yarn.lock

# Clear caches
npm cache clean --force
rm -rf ~/.metro
rm -rf ~/.expo

# Reinstall
npm install
```

## 🚨 Troubleshooting

### Permission Errors

- **Windows**: Run Command Prompt as Administrator
- **macOS**: Check npm permissions with `npm config get prefix`
- **Linux**: Use `sudo` if necessary, but prefer fixing npm permissions

### File Lock Errors

- Close all IDEs and editors
- Close Metro bundler (`Ctrl+C` in terminal)
- Restart your computer if files remain locked

### Network Issues

- Check your internet connection
- Try using a different npm registry: `npm config set registry https://registry.npmjs.org/`
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (macOS)

### Expo Issues

- Run `npx expo doctor` for specific Expo-related problems
- Check Expo CLI version: `npx expo --version`
- Update Expo CLI: `npm install -g @expo/cli`

## 📚 Additional Resources

- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/)
- [npm Cache Issues](https://docs.npmjs.com/cli/v8/commands/npm-cache)
- [Metro Bundler Issues](https://facebook.github.io/metro/docs/troubleshooting)
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)

## 🔄 When to Use These Scripts

Use these scripts when you encounter:

- Dependency version conflicts
- Metro bundler errors
- Expo installation issues
- TypeScript compilation errors
- Cache-related problems
- After updating Node.js or npm versions
- When switching between package managers

## ⚠️ Important Notes

1. **Backup your work** before running these scripts
2. **Close all development servers** before running
3. **These scripts will delete your node_modules** - this is intentional
4. **Run from project root** - scripts check for `package.json`
5. **May take several minutes** - especially on slower machines

## 🎯 Expected Results

After running successfully, you should see:

- ✅ All dependencies installed without conflicts
- ✅ TypeScript compilation successful
- ✅ Expo doctor shows no critical issues
- ✅ Development server starts without errors

If you still encounter issues after running these scripts, the problem may be:

- Environment-specific (Node.js version, OS permissions)
- Project configuration issues
- Network/proxy issues
- Hardware limitations
