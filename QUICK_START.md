# 🚀 Quick Start Guide

## ⚠️ IMPORTANT: How to Open This Project Correctly

**The #1 cause of issues is opening VS Code from the wrong directory!**

### ✅ Correct Way to Open VS Code:

**Option 1: Using File Explorer**
1. Navigate to `E:\Airbnb App` in File Explorer
2. Right-click in the folder (not on a file)
3. Select "Open with Code"

**Option 2: Using Terminal**
```powershell
cd "E:\Airbnb App"
code .
```

**Option 3: Using VS Code**
1. File → Open Folder
2. Navigate to `E:\Airbnb App`
3. Click "Select Folder"

### ❌ What NOT to Do:
- Don't open VS Code from your home directory and then navigate to files
- Don't open individual files - always open the **folder**
- Don't use "Add Folder to Workspace" - use "Open Folder"

---

## 🏃 Running the App

### Method 1: VS Code Debugger (RECOMMENDED)
1. Press `F5` or go to "Run and Debug" panel (Ctrl+Shift+D)
2. Select "Expo: Start" from dropdown
3. Press the green play button
4. Once Metro bundler starts, press `w` for web or `a` for Android

### Method 2: VS Code Terminal
1. Open new terminal in VS Code: Ctrl+`
2. Verify you're in project directory:
   ```powershell
   Get-Location  # Should show E:\Airbnb App
   ```
3. If not in correct directory:
   ```powershell
   cd "E:\Airbnb App"
   ```
4. Start Expo:
   ```powershell
   npx expo start --clear
   ```

### Method 3: External PowerShell
```powershell
cd "E:\Airbnb App"
npx expo start --clear
```

---

## 🔧 Troubleshooting

### Problem: Terminal starts in `C:\Users\Sly` instead of project folder

**Solution 1: Reload VS Code Window**
1. Press `Ctrl+Shift+P`
2. Type "Reload Window"
3. Press Enter
4. Try opening terminal again

**Solution 2: Close and Reopen VS Code**
1. Close VS Code completely
2. Open File Explorer to `E:\Airbnb App`
3. Right-click → "Open with Code"

**Solution 3: Check PowerShell Profile**
Your PowerShell profile might be changing directories. Run:
```powershell
notepad $PROFILE
```
Look for any `cd` or `Set-Location` commands and remove/comment them out.

### Problem: "Unable to find expo in this project"

**Cause:** Running from wrong directory

**Solution:**
```powershell
# Check where you are
Get-Location

# If not in E:\Airbnb App, go there
cd "E:\Airbnb App"

# Verify node_modules exists
Test-Path node_modules

# If False, run
npm install
```

### Problem: Still seeing Expo welcome screen

**This means the app IS running - it's just not configured yet!**

**Solution:** The app is in demo mode. To see your custom dashboard:
1. Check that `.env.local` has valid Supabase credentials
2. Restart Expo: `npx expo start --clear`
3. The demo dashboard should load automatically

---

## 📦 What Was Set Up

### Configuration Files Created:
- ✅ `.vscode/settings.json` - Auto-formatting, linting, TypeScript settings
- ✅ `.vscode/launch.json` - Debug configurations (press F5 to use)
- ✅ `.vscode/extensions.json` - Recommended extensions
- ✅ `.nvmrc` - Node version (22.13.1)
- ✅ `.editorconfig` - Code style consistency

### Features Enabled:
- ✅ Auto-format on save (Prettier)
- ✅ Auto-fix ESLint errors on save
- ✅ TypeScript strict checking
- ✅ Auto-organize imports
- ✅ Path intellisense for `@/` imports
- ✅ Terminal starts in project folder
- ✅ One-click debugging with F5

### Recommended VS Code Extensions:
When you open the project, VS Code will suggest installing:
- ESLint
- Prettier
- React Native Tools
- Error Lens (shows errors inline)
- GitLens
- Path Intellisense

**Click "Install All" when prompted!**

---

## ✅ Verify Everything Works

Run these commands in VS Code terminal:

```powershell
# 1. Check you're in the right place
Get-Location  # Should output: E:\Airbnb App

# 2. Check Node version
node --version  # Should be v22.13.1

# 3. Check dependencies installed
Test-Path node_modules  # Should output: True

# 4. Check Expo installed
Test-Path node_modules\expo  # Should output: True

# 5. Type check (should pass with 0 errors)
npm run type-check

# 6. Start app
npx expo start --clear
```

If all checks pass, press `w` for web or scan QR code with Expo Go app.

---

## 🎯 Expected Result

When app starts, you should see:
- ✅ Dashboard with "Good morning" greeting
- ✅ Yellow banner: "Demo Mode - Configure Supabase..."
- ✅ Dashboard stats
- ✅ Quick actions buttons

**NOT** the default Expo welcome screen!

---

## 📝 Development Workflow

1. **Make changes** to `.tsx` files
2. **Save** (Ctrl+S) - auto-formats and fixes lint errors
3. **See changes** immediately in browser/app (Fast Refresh)
4. **Check types**: `npm run type-check`
5. **Commit**: Git will auto-stage changes (smart commit enabled)

---

## 🆘 Still Having Issues?

1. **Close VS Code completely**
2. **Delete `.expo` folder** if it exists
3. **Open PowerShell** (not in VS Code)
4. Run:
   ```powershell
   cd "E:\Airbnb App"
   Get-Location  # Confirm you're in right place
   code .        # Opens VS Code in THIS directory
   ```
5. In VS Code, open new terminal and verify location:
   ```powershell
   Get-Location  # Should be E:\Airbnb App
   ```
6. Press **F5** to start using the debugger

---

**Last Updated:** October 11, 2025
**Node Version:** 22.13.1
**Expo SDK:** 54

