# VSCode Tasks & Debugging Guide
## Airbnb Cleaning Management App

---

## 🚀 Quick Start Tasks

### Master Tasks (Most Used)

**Press `Ctrl+Shift+P` → Type "Tasks: Run Task" → Select:**

### 🔥 Master Clear & Fresh Start
**When to use:** After major changes, when things break, or weekly cleanup
**What it does:**
1. Kills all Node/Expo processes
2. Deletes `.expo`, `.metro`, `node_modules/.cache`
3. Removes `node_modules` and `package-lock.json`
4. Reinstalls all dependencies
5. Starts Expo with cleared cache

**Time:** ~3-5 minutes  
**Effect:** Nuclear option - guaranteed fresh start

---

### ⚡ Quick Clear & Restart
**When to use:** Daily after code changes, before testing
**What it does:**
1. Kills all Node/Expo processes
2. Clears `.expo` and `.metro` folders
3. Starts Expo with cleared cache

**Time:** ~10 seconds  
**Effect:** Fast refresh, keeps node_modules

---

### 🎯 Start Fresh (Verified Setup)
**When to use:** Every morning, after switching branches
**What it does:**
1. Verifies current directory
2. Checks `.env.local` exists
3. Clears `.expo` cache
4. Starts Expo with cleared cache

**Time:** ~5 seconds  
**Effect:** Ensures correct setup before starting

---

## 🔧 Development Tasks

### Regular Development
- **Dev: Start Server** - Normal Expo start
- **Dev: Start with Clear Cache** - Expo start with cache clear
- **Dev: Run on Android** - Launch on Android device/emulator
- **Dev: Run on iOS** - Launch on iOS simulator/device
- **Dev: Run on Web** - Launch in browser

---

## ✅ Code Quality Tasks

### Verification
- **Verify: TypeScript Check** - Check for type errors (`tsc --noEmit`)
- **Verify: Lint** - Check code style (ESLint)
- **Verify: All Checks** - Run both TypeScript and lint
- **Verify: Environment Setup** - Check directory, .env.local, node_modules

---

## 🗄️ Database Tasks

### Supabase
- **DB: Check Supabase Connection** - Display current Supabase config and expected tables

---

## 🧹 Maintenance Tasks

### Cleanup
- **Maint: Clear Expo Cache Only** - Delete `.expo` folder
- **Maint: Clear Metro Cache Only** - Delete `.metro` and `node_modules/.cache`
- **Maint: Stop All Processes** - Kill all Node/Expo processes
- **Maint: Install Dependencies** - Run `npm install`
- **Maint: Clean & Reinstall** - Delete `node_modules` and reinstall

---

## 📄 Documentation Tasks

- **Docs: Open Testing Guide** - Opens `SEED_DATA_SUMMARY.md`
- **Docs: Update Manifests** - Updates component/service documentation

---

## 🐛 Debugging Guide

### Debug Configurations (F5 or Debug Panel)

#### Mobile Debugging
1. **Debug: Android (Attach)** - Attach to running Android app
2. **Debug: iOS (Attach)** - Attach to running iOS app
3. **Debug: Expo Go (Android)** - Launch and debug in Expo Go
4. **Debug: Expo Go (iOS)** - Launch and debug in Expo Go

#### Web Debugging
1. **Debug: Web (Chrome)** - Launch in Chrome with DevTools
2. **Debug: Web (Edge)** - Launch in Edge with DevTools

#### Launch Configurations
- **Launch: Android** - Build and run Android
- **Launch: iOS** - Build and run iOS
- **Launch: Web** - Start web server

---

## 🎯 Recommended Daily Workflow

### Morning Startup
1. Open VSCode
2. Run: **🎯 Start Fresh (Verified Setup)**
3. Wait for Expo to load
4. Scan QR code in Expo Go

### After Code Changes
1. Save files
2. Run: **⚡ Quick Clear & Restart**
3. App hot-reloads

### When Things Break
1. Run: **🔥 Master Clear & Fresh Start**
2. Get coffee (takes 3-5 minutes)
3. Everything works again

### Before Committing
1. Run: **Verify: All Checks**
2. Fix any TypeScript or linting errors
3. Commit your code

---

## 🔥 Troubleshooting

### Problem: App shows Expo welcome screen
**Solution:** Run **🎯 Start Fresh (Verified Setup)**
- Checks you're in the right directory
- Verifies `.env.local` exists
- Clears cache properly

### Problem: "Network request failed" errors
**Solution:** 
1. Run **Verify: Environment Setup**
2. Check Supabase credentials in `.env.local`
3. Run **DB: Check Supabase Connection**

### Problem: Metro bundler won't start
**Solution:** Run **🔥 Master Clear & Fresh Start**

### Problem: Changes not reflecting in app
**Solution:** Run **⚡ Quick Clear & Restart**

### Problem: TypeScript errors after pulling code
**Solution:**
1. Run **Maint: Clean & Reinstall**
2. Run **Verify: TypeScript Check**

---

## ⌨️ Keyboard Shortcuts

- **Ctrl+Shift+P** → Tasks: Run Task (opens task menu)
- **Ctrl+Shift+B** → Run default build task (Master Clear)
- **F5** → Start debugging (opens debug menu)
- **Ctrl+Shift+D** → Open debug panel

---

## 🧪 Testing Workflow

### Test as Property Owner
1. Run **🎯 Start Fresh**
2. Login: `jacobmerlin22@gmail.com`
3. Verify: 2 properties visible
4. Check: Notifications show up

### Test as Cleaner
1. Login: `j37598864+5@gmail.com` (Maria Garcia)
2. Verify: Active session card shows
3. Check: "IN PROGRESS" banner displays
4. Verify: 3 properties assigned

---

## 📊 Current Database Setup

**Tables Created:**
- ✅ profiles (user accounts)
- ✅ properties (4 test properties)
- ✅ cleaning_sessions (6 sessions)
- ✅ cleaning_updates (real-time communication)
- ✅ team_members (cleaner assignments)
- ✅ notifications (alerts)
- ✅ photo_proof_requirements (quality control)
- ✅ linen_requirements (auto-calculated)

**Test Data:**
- 4 users (2 owners, 2 cleaners)
- 4 properties
- 6 cleaning sessions
- 48 total records

---

## 🔗 Useful Links

- **Supabase Dashboard:** https://app.supabase.com
- **Expo Dashboard:** https://expo.dev
- **Project Docs:** See `/docs` folder
- **Testing Guide:** `SEED_DATA_SUMMARY.md`

---

## 💡 Pro Tips

1. **Use Master Clear sparingly** - It's slow but guaranteed to work
2. **Quick Clear is your friend** - Use it after every significant change
3. **Start Fresh each morning** - Ensures environment is correct
4. **Check TypeScript before committing** - Saves CI/CD time
5. **Keep Supabase Dashboard open** - Helpful for checking data

---

**Last Updated:** October 10, 2025  
**Version:** 1.0  
**Author:** AI Development Assistant

