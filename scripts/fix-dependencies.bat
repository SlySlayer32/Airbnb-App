@echo off
echo 🧹 Cleaning up dependency conflicts...
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from the project root.
    exit /b 1
)

echo 📁 Working directory: %CD%
echo.

REM Clean up existing installations
echo 🗑️  Removing existing node_modules and lock files...
if exist "node_modules" (
    echo Removing node_modules directory...
    rmdir /s /q "node_modules"
    echo ✅ node_modules removed
) else (
    echo ℹ️  node_modules not found, skipping
)

if exist "package-lock.json" (
    echo Removing package-lock.json...
    del /q "package-lock.json"
    echo ✅ package-lock.json removed
) else (
    echo ℹ️  package-lock.json not found, skipping
)

if exist "yarn.lock" (
    echo Removing yarn.lock...
    del /q "yarn.lock"
    echo ✅ yarn.lock removed
) else (
    echo ℹ️  yarn.lock not found, skipping
)

if exist "pnpm-lock.yaml" (
    echo Removing pnpm-lock.yaml...
    del /q "pnpm-lock.yaml"
    echo ✅ pnpm-lock.yaml removed
) else (
    echo ℹ️  pnpm-lock.yaml not found, skipping
)

echo.

REM Clear caches
echo 🧹 Clearing caches...
echo Clearing npm cache...
npm cache clean --force
if %errorlevel% neq 0 (
    echo ⚠️  npm cache clean failed, continuing...
)

echo Clearing yarn cache...
yarn cache clean
if %errorlevel% neq 0 (
    echo ⚠️  yarn cache clean failed, continuing...
)

echo Fixing Expo dependencies...
npx expo install --fix
if %errorlevel% neq 0 (
    echo ⚠️  expo install --fix failed, continuing...
)

REM Clear Metro cache
echo Clearing Metro cache...
if exist "%USERPROFILE%\.metro" (
    rmdir /s /q "%USERPROFILE%\.metro"
    echo ✅ Metro cache cleared
) else (
    echo ℹ️  Metro cache not found, skipping
)

REM Clear Expo cache
echo Clearing Expo cache...
if exist "%USERPROFILE%\.expo" (
    rmdir /s /q "%USERPROFILE%\.expo"
    echo ✅ Expo cache cleared
) else (
    echo ℹ️  Expo cache not found, skipping
)

REM Clear React Native temp files
echo Clearing React Native temp files...
for /d %%i in ("%TEMP%\react-*") do rmdir /s /q "%%i" 2>nul
for /d %%i in ("%TEMP%\metro-*") do rmdir /s /q "%%i" 2>nul
echo ✅ React Native temp files cleared

echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    exit /b 1
)

echo.

REM Verify installation
echo 🔍 Verifying installation...
echo Running TypeScript type check...
npm run type-check
if %errorlevel% neq 0 (
    echo ⚠️  TypeScript type check failed, but continuing...
)

echo Running Expo doctor...
npx expo doctor
if %errorlevel% neq 0 (
    echo ⚠️  Expo doctor failed, but continuing...
)

echo.
echo 🎉 Dependency cleanup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Run "npm run dev" to start the development server
echo 2. Run "npm run validate" to check everything is working
echo 3. If you encounter any issues, run "npm run doctor" for diagnostics
echo.
echo 🔧 Windows-specific notes:
echo - If you encounter permission errors, try running as Administrator
echo - Make sure Windows Defender isn't blocking the operations
echo - Close any IDEs or editors that might be locking files
echo.
pause
