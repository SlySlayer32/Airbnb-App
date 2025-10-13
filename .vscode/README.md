# VSCode Configuration for Airbnb Cleaning Management App

This folder contains VSCode configurations optimized for React Native/Expo development with Supabase.

---

## 📁 Files Overview

### `tasks.json`
**20+ Custom Tasks** for development workflow:
- 🔥 Master Clear & Fresh Start (nuclear option)
- ⚡ Quick Clear & Restart (daily use)
- 🎯 Start Fresh (verified setup)
- ✅ Code quality checks (TypeScript, ESLint)
- 🗄️ Database/Supabase tools
- 🧹 Maintenance tasks
- 📄 Documentation helpers

### `launch.json`
**12 Debug Configurations** for various platforms:
- Android/iOS debugging (attach & launch)
- Web debugging (Chrome & Edge)
- Expo Go debugging
- TypeScript verification

### `settings.json`
**Project-Specific Settings:**
- Auto-formatting on save (Prettier)
- ESLint auto-fix
- TypeScript auto-imports
- File exclusions for performance
- React Native IntelliSense
- TODO tree highlighting

### `extensions.json`
**21 Recommended Extensions:**
- React Native tools
- Supabase/SQL tools
- Code quality tools
- Git enhancements
- AI assistance (Copilot)

### `keybindings.json`
**Quick Keyboard Shortcuts:**
- `Ctrl+Shift+Alt+C` - Master Clear
- `Ctrl+Shift+Alt+R` - Quick Restart
- `Ctrl+Shift+Alt+S` - Start Fresh
- `Ctrl+Shift+Alt+X` - Stop Processes
- `Ctrl+Shift+Alt+T` - TypeScript Check
- `Ctrl+Shift+Alt+E` - Verify Environment
- `Ctrl+Shift+Alt+D` - Open Testing Guide

### `TASKS_GUIDE.md`
**Complete task documentation** with:
- When to use each task
- What each task does
- Time estimates
- Troubleshooting guide
- Daily workflow recommendations

---

## 🚀 Quick Start

### First Time Setup
1. Install recommended extensions (VSCode will prompt)
2. Press `Ctrl+Shift+Alt+S` to start fresh
3. Read `TASKS_GUIDE.md` for details

### Daily Workflow
1. **Morning:** `Ctrl+Shift+Alt+S` (Start Fresh)
2. **After changes:** `Ctrl+Shift+Alt+R` (Quick Restart)
3. **Before commit:** `Ctrl+Shift+Alt+T` (TypeScript Check)
4. **When broken:** `Ctrl+Shift+Alt+C` (Master Clear)

---

## 🎯 Most Used Tasks

### Access Tasks
- **Via Command Palette:** `Ctrl+Shift+P` → "Tasks: Run Task"
- **Via Keyboard:** `Ctrl+Shift+Alt+P` → Select task
- **Via Keyboard (Direct):** Use shortcuts above

### Top 5 Tasks

1. **🔥 Master Clear & Fresh Start** (`Ctrl+Shift+Alt+C`)
   - Full nuclear cleanup
   - Use weekly or when things break
   - Takes ~3-5 minutes

2. **⚡ Quick Clear & Restart** (`Ctrl+Shift+Alt+R`)
   - Fast cache clear
   - Use after every code change
   - Takes ~10 seconds

3. **🎯 Start Fresh** (`Ctrl+Shift+Alt+S`)
   - Verified setup check
   - Use every morning
   - Takes ~5 seconds

4. **Verify: TypeScript Check** (`Ctrl+Shift+Alt+T`)
   - Check for type errors
   - Use before committing
   - Takes ~15 seconds

5. **Maint: Stop All Processes** (`Ctrl+Shift+Alt+X`)
   - Kill hung processes
   - Use when Expo won't start
   - Instant

---

## 🐛 Debugging

### Start Debugging
1. Press `F5` or click Debug icon (left sidebar)
2. Select configuration:
   - **Debug: Android (Attach)** - For Android device
   - **Debug: iOS (Attach)** - For iOS simulator
   - **Debug: Web (Chrome)** - For web browser

### Breakpoints
- Click left of line numbers to add breakpoints
- Debug console opens automatically
- Variables inspector shows current state

---

## ✅ Code Quality

### Auto-Formatting
- **On Save:** Files auto-format with Prettier
- **On Save:** ESLint auto-fixes issues
- **Manual Format:** `Shift+Alt+F`

### Type Checking
- **Auto:** TypeScript errors show inline
- **Manual:** Run "Verify: TypeScript Check" task
- **Command:** `npx tsc --noEmit`

### Linting
- **Auto:** ESLint problems show inline
- **Manual:** Run "Verify: Lint" task
- **Command:** `npm run lint`

---

## 🗄️ Supabase Integration

### Check Connection
Run task: **DB: Check Supabase Connection**

Shows:
- Current Supabase URL
- Expected database tables
- Environment configuration

### Database Tables
Expected in your Supabase:
- ✅ profiles
- ✅ properties
- ✅ cleaning_sessions
- ✅ cleaning_updates
- ✅ team_members
- ✅ notifications
- ✅ photo_proof_requirements
- ✅ linen_requirements

---

## 🔧 Troubleshooting

### Task Won't Run
- Check you're in project directory
- Try: `Ctrl+Shift+Alt+E` (Verify Environment)
- Check terminal for errors

### Metro Won't Start
1. `Ctrl+Shift+Alt+X` (Stop Processes)
2. Wait 5 seconds
3. `Ctrl+Shift+Alt+R` (Quick Restart)

### Still Broken?
1. Close VSCode
2. Reopen VSCode
3. `Ctrl+Shift+Alt+C` (Master Clear)
4. Get coffee (takes 3-5 minutes)

### Environment Issues
- Run: **Verify: Environment Setup**
- Check: `.env.local` exists
- Verify: Supabase credentials correct
- Confirm: `node_modules` installed

---

## 📚 Documentation

### Project Docs
- `/docs` - Complete project documentation
- `SEED_DATA_SUMMARY.md` - Test data & login credentials
- `TASKS_GUIDE.md` - Detailed task guide

### Open Guides
- **Testing Guide:** `Ctrl+Shift+Alt+D`
- **Task Guide:** Open `TASKS_GUIDE.md` manually

---

## 🎨 Customization

### Add Your Own Tasks
Edit `.vscode/tasks.json`:
```json
{
  "label": "My Custom Task",
  "type": "shell",
  "command": "your-command-here",
  "detail": "Description shown in menu"
}
```

### Add Keybindings
Edit `.vscode/keybindings.json`:
```json
{
  "key": "ctrl+shift+alt+m",
  "command": "workbench.action.tasks.runTask",
  "args": "My Custom Task"
}
```

### Modify Settings
Edit `.vscode/settings.json` for project-specific preferences

---

## 📊 Performance Tips

### Optimize VSCode
1. Close unused tabs
2. Disable unused extensions
3. Increase memory: `files.maxMemoryForLargeFilesMB: 4096`
4. Exclude folders: Already configured in `settings.json`

### Optimize Metro
- Runs faster with cleared cache
- Use Quick Restart daily
- Use Master Clear weekly

---

## 🔗 Useful Extensions

### Must-Have (Auto-Recommended)
- **React Native Tools** - Debugging & IntelliSense
- **Prettier** - Code formatting
- **ESLint** - Code quality
- **GitLens** - Git superpowers

### Nice-to-Have
- **TODO Tree** - Track TODOs and business rules
- **SQLTools** - Database queries
- **Error Lens** - Inline error display
- **Import Cost** - See package sizes

---

## 💡 Pro Tips

1. **Use keyboard shortcuts** - Faster than mouse
2. **Master Clear sparingly** - It's slow but guaranteed
3. **Quick Restart often** - After every significant change
4. **Check TypeScript before commit** - Saves CI/CD time
5. **Keep task menu open** - Pin it for quick access
6. **Read TASKS_GUIDE.md** - Comprehensive workflow guide

---

## 🎯 Success Checklist

After setup, verify:
- [ ] Recommended extensions installed
- [ ] `Ctrl+Shift+Alt+S` starts Expo successfully
- [ ] `.env.local` contains real Supabase credentials
- [ ] Breakpoints work when debugging
- [ ] Auto-formatting works on save
- [ ] TypeScript errors show inline
- [ ] Tasks menu accessible via `Ctrl+Shift+P`

---

## 📞 Support

If issues persist:
1. Read `TASKS_GUIDE.md`
2. Run **Verify: Environment Setup**
3. Check `.env.local` configuration
4. Try **Master Clear & Fresh Start**
5. Restart VSCode completely

---

**Created:** October 10, 2025  
**Last Updated:** October 10, 2025  
**Version:** 1.0  
**Project:** Airbnb Cleaning Management Platform

