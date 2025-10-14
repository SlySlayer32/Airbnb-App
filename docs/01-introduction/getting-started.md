# Getting Started

## Quick Start

Your Airbnb Cleaning Management app is properly configured and ready to run!

### What's Working

- ✅ Custom dashboard (no Expo welcome screen)
- ✅ Demo mode enabled (works without Supabase)
- ✅ All screens accessible (Properties, Schedule, Team, etc.)
- ✅ Proper authentication flow
- ✅ Role-based access (property owners, cleaners, co-hosts)

## Running the App

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- VS Code (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Airbnb-App.git
cd Airbnb-App

# Install dependencies
npm install
```

### Starting the Development Server

#### Method 1: VS Code Debugger (Recommended)

1. Press `F5` or go to "Run and Debug" panel (Ctrl+Shift+D)
2. Select "Expo: Start" from dropdown
3. Press the green play button
4. Once Metro bundler starts, press `w` for web or `a` for Android

#### Method 2: Terminal

```bash
npx expo start
```

Then choose your platform:
- Press `w` for web browser
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Platform Options

**Web Browser (Easiest for Testing)**
```bash
npx expo start --web
```

**Android Emulator**
```bash
npx expo start --android
```

**iOS Simulator (Mac Only)**
```bash
npx expo start --ios
```

**Expo Go App on Phone**
1. Download Expo Go from App Store or Google Play
2. Scan QR code from terminal
3. App loads on your device

## Demo Mode

The app runs in demo mode by default with mock data:

- Yellow banner indicates demo mode
- All features accessible for testing
- No Supabase configuration required

### Enabling Full Functionality

1. **Set up Supabase:**
   - Create a project at https://supabase.com
   - Copy your project URL and anon key

2. **Create `.env` file:**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Restart the app:**
   ```bash
   npx expo start --clear
   ```

## What You'll See

When the app loads:

- **Dashboard:** Main overview with stats and quick actions
- **Properties:** Manage your Airbnb listings
- **Schedule:** View cleaning schedules and bookings
- **Team:** Manage cleaners and co-hosts
- **Invoices:** Track payments and billing
- **Maintenance:** Handle repair requests
- **Reports:** View performance analytics

## VS Code Setup

### Opening the Project Correctly

**Important:** Always open the project folder, not individual files.

**Option 1: File Explorer**
1. Navigate to project folder in File Explorer
2. Right-click in the folder
3. Select "Open with Code"

**Option 2: Terminal**
```powershell
cd "E:\Airbnb-App"
code .
```

**Option 3: VS Code**
1. File → Open Folder
2. Navigate to project folder
3. Click "Select Folder"

### Recommended Extensions

VS Code will suggest installing:
- ESLint
- Prettier
- React Native Tools
- Error Lens
- GitLens
- Path Intellisense

Click "Install All" when prompted!

### Features Enabled

- ✅ Auto-format on save (Prettier)
- ✅ Auto-fix ESLint errors on save
- ✅ TypeScript strict checking
- ✅ Auto-organize imports
- ✅ Path intellisense for `@/` imports
- ✅ One-click debugging with F5

## Verification

Run these commands to verify setup:

```powershell
# Check you're in the right place
Get-Location  # Should show project directory

# Check Node version
node --version  # Should be v18+ or v22.13.1

# Check dependencies installed
Test-Path node_modules  # Should output: True

# Check Expo installed
Test-Path node_modules\expo  # Should output: True

# Type check (should pass with 0 errors)
npm run type-check

# Start app
npx expo start --clear
```

## Expected Result

When app starts successfully:
- ✅ Dashboard with "Good morning" greeting
- ✅ Yellow banner: "Demo Mode - Configure Supabase..." (if in demo mode)
- ✅ Dashboard stats
- ✅ Quick actions buttons
- ✅ **NOT** the default Expo welcome screen

## Development Workflow

1. **Make changes** to `.tsx` files
2. **Save** (Ctrl+S) - auto-formats and fixes lint errors
3. **See changes** immediately in browser/app (Fast Refresh)
4. **Check types**: `npm run type-check`
5. **Commit**: Git will auto-stage changes

## Troubleshooting

### Terminal starts in wrong directory

**Solution 1: Reload VS Code Window**
1. Press `Ctrl+Shift+P`
2. Type "Reload Window"
3. Press Enter

**Solution 2: Close and Reopen VS Code**
1. Close VS Code completely
2. Open File Explorer to project folder
3. Right-click → "Open with Code"

### "Unable to find expo in this project"

**Cause:** Running from wrong directory

**Solution:**
```powershell
# Check where you are
Get-Location

# If not in project folder, go there
cd "E:\Airbnb-App"

# Verify node_modules exists
Test-Path node_modules

# If False, run
npm install
```

### Still seeing Expo welcome screen

The app is running in demo mode. To see your custom dashboard:
1. Check that `.env` has valid Supabase credentials (if using real data)
2. Restart Expo: `npx expo start --clear`
3. The demo dashboard should load automatically

### Still Having Issues?

1. Close VS Code completely
2. Delete `.expo` folder if it exists
3. Open PowerShell (not in VS Code)
4. Run:
   ```powershell
   cd "E:\Airbnb-App"
   Get-Location  # Confirm you're in right place
   code .        # Opens VS Code in THIS directory
   ```
5. In VS Code, open new terminal and verify location
6. Press **F5** to start using the debugger

## Business Impact

This setup means:
- **No technical barriers** - App runs immediately in demo mode
- **Full feature testing** - You can explore all functionality
- **Easy Supabase integration** - Just add your credentials when ready
- **Professional appearance** - No default Expo screens

Your Airbnb property management platform is ready to use and demonstrate to potential users!

---

**Last Updated:** January 2025
**Node Version:** 22.13.1
**Expo SDK:** 54

