# React Native / Expo Project Environment Setup

Complete checklist for setting up a development environment matching the chatmode pipeline (Steps
2–4: Enhance Request → Build Plan → TDD).

---

## Prerequisites

### Required Accounts & Services

- [ ] **GitHub Account**
  - Personal or organization account
  - Two-factor authentication enabled
  - Personal access token (PAT) with repo, workflow, and packages scopes

- [ ] **Supabase Account**
  - Free or paid tier
  - Project created with organization/workspace
  - Database password saved securely
  - API keys (anon/public and service role) saved

- [ ] **Expo Account**
  - Free or paid tier (EAS Build/Submit requires paid)
  - Organization created (if team project)
  - Access token generated for CI/CD

- [ ] **npm Account** (optional, for private packages)
  - Access token for CI/CD if using private registry

---

## Development Tools

### Core Runtime & Package Manager

- [ ] **Node.js** (LTS version recommended)
  - Version: 18.x or 20.x
  - Install: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- [ ] **Package Manager** (choose one)
  - **npm** (included with Node.js) — default
  - **Yarn** (v1.x or v3.x) — `npm install -g yarn`
  - **pnpm** (fast alternative) — `npm install -g pnpm`

### Version Control

- [ ] **Git**
  - Version: 2.x+
  - Install: https://git-scm.com/
  - Verify: `git --version`
  - Configure:
    ```powershell
    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```

### Code Editor

- [ ] **Visual Studio Code**
  - Version: Latest stable
  - Install: https://code.visualstudio.com/

- [ ] **VS Code Extensions** (recommended)
  - **ESLint** (`dbaeumer.vscode-eslint`)
  - **Prettier** (`esbenp.prettier-vscode`)
  - **TypeScript** (built-in, ensure enabled)
  - **React Native Tools** (`msjsdiag.vscode-react-native`)
  - **Expo Tools** (`expo.vscode-expo-tools`)
  - **GitLens** (`eamodio.gitlens`)
  - **GitHub Copilot** (`GitHub.copilot`)
  - **GitHub Copilot Chat** (`GitHub.copilot-chat`)
  - **Gluestack** (`gluestack.gluestack-vscode`) (optional, for UI components)
  - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) (for NativeWind)

---

## Mobile Development Tools

### React Native / Expo CLI

- [ ] **Expo CLI**
  - Install globally: `npm install -g expo-cli`
  - Verify: `expo --version`
  - Login: `expo login`

- [ ] **EAS CLI** (for build/submit)
  - Install globally: `npm install -g eas-cli`
  - Verify: `eas --version`
  - Login: `eas login`

### iOS Development (macOS only)

- [ ] **Xcode** (macOS only)
  - Version: 14.x or 15.x (latest stable)
  - Install from Mac App Store
  - Accept license: `sudo xcodebuild -license accept`
  - Install Command Line Tools: `xcode-select --install`

- [ ] **CocoaPods** (iOS dependency manager)
  - Install: `sudo gem install cocoapods`
  - Verify: `pod --version`

- [ ] **iOS Simulator**
  - Comes with Xcode
  - Launch via Xcode → Open Developer Tool → Simulator
  - Or via CLI: `open -a Simulator`

- [ ] **Rosetta 2** (for Apple Silicon Macs)
  - Install if needed: `softwareupdate --install-rosetta`

### Android Development (Windows, macOS, Linux)

- [ ] **Android Studio**
  - Version: Latest stable (Hedgehog or newer)
  - Install: https://developer.android.com/studio
  - Components to install during setup:
    - Android SDK
    - Android SDK Platform (API 33 or 34)
    - Android Virtual Device (AVD)
    - Intel x86 Emulator Accelerator (HAXM) or Android Emulator Hypervisor Driver (Windows)

- [ ] **Android SDK Environment Variables** (Windows)
  - Add to System Environment Variables:
    ```
    ANDROID_HOME = C:\Users\<YourUsername>\AppData\Local\Android\Sdk
    ```
  - Add to PATH:
    ```
    %ANDROID_HOME%\platform-tools
    %ANDROID_HOME%\emulator
    %ANDROID_HOME%\tools
    %ANDROID_HOME%\tools\bin
    ```
  - Verify: `adb --version`

- [ ] **Android SDK Environment Variables** (macOS/Linux)
  - Add to `~/.zshrc` or `~/.bashrc`:
    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
  - Apply: `source ~/.zshrc` (or `~/.bashrc`)
  - Verify: `adb --version`

- [ ] **Android Emulator / Virtual Device**
  - Create AVD in Android Studio:
    - Tools → Device Manager → Create Virtual Device
    - Recommended: Pixel 5 or Pixel 6 with API 33 or 34
  - Launch via Android Studio or CLI: `emulator -avd <device_name>`

- [ ] **Java Development Kit (JDK)**
  - Version: JDK 17 (required for Android Gradle 8.x)
  - Install: https://adoptium.net/ or use Android Studio's bundled JDK
  - Verify: `java --version`

---

## Testing Tools

### Unit & Component Testing

- [ ] **Jest** (included in Expo projects by default)
  - Verify in `package.json` under `devDependencies`

- [ ] **React Native Testing Library**
  - Install: `npm install --save-dev @testing-library/react-native @testing-library/jest-native`

- [ ] **React Hooks Testing Library**
  - Install: `npm install --save-dev @testing-library/react-hooks`

### E2E Testing (Optional, for Step 4 TDD)

- [ ] **Detox** (for iOS/Android E2E tests)
  - Install CLI: `npm install -g detox-cli`
  - Install in project: `npm install --save-dev detox`
  - Setup guide: https://wix.github.io/Detox/docs/introduction/getting-started
  - Requires platform-specific configuration

- [ ] **Appium** (alternative to Detox)
  - Install: `npm install -g appium`
  - Verify: `appium --version`

---

## Backend & Database Tools

### Supabase CLI

- [ ] **Supabase CLI**
  - Install (Windows): `scoop install supabase`
  - Install (macOS): `brew install supabase/tap/supabase`
  - Install (npm, cross-platform): `npm install -g supabase`
  - Verify: `supabase --version`
  - Login: `supabase login`

### PostgreSQL Client (Optional, for local DB inspection)

- [ ] **pgAdmin** or **Postico** (macOS) or **DBeaver**
  - Install from respective websites
  - Connect to Supabase DB using connection string from dashboard

---

## CI/CD & Automation Tools

### GitHub CLI (Optional, helpful for PR/issue automation)

- [ ] **GitHub CLI**
  - Install (Windows): `winget install GitHub.cli` or download from https://cli.github.com/
  - Install (macOS): `brew install gh`
  - Verify: `gh --version`
  - Login: `gh auth login`

### Docker (Optional, for containerized builds or local Supabase)

- [ ] **Docker Desktop**
  - Install: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version`

---

## Linting & Formatting Tools

- [ ] **ESLint** (project-specific, via npm)
  - Usually included in Expo projects
  - Verify in `package.json` under `devDependencies`

- [ ] **Prettier** (project-specific, via npm)
  - Install: `npm install --save-dev prettier`
  - Add `.prettierrc` config to project

- [ ] **TypeScript**
  - Included in Expo projects with TypeScript template
  - Verify: `npx tsc --version`

---

## Optional Tools & Utilities

### Performance & Debugging

- [ ] **React DevTools** (browser extension or standalone)
  - Install standalone: `npm install -g react-devtools`
  - Launch: `react-devtools`

- [ ] **Flipper** (debugging platform for React Native)
  - Install: https://fbflipper.com/
  - Note: Expo SDK 49+ uses Metro's built-in debugger; Flipper less common now

- [ ] **Reactotron** (debugging and monitoring)
  - Install: https://github.com/infinitered/reactotron
  - Install client: `npm install --save-dev reactotron-react-native`

### Image Optimization

- [ ] **ImageMagick** or **Sharp** (for image processing in scripts)
  - ImageMagick: https://imagemagick.org/
  - Sharp (Node.js): `npm install --save-dev sharp`

### API Testing

- [ ] **Postman** or **Insomnia**
  - Install from respective websites
  - Useful for testing Supabase REST/GraphQL endpoints

---

## Project Setup Checklist

Once tools are installed, set up your React Native/Expo project:

### 1. Create New Project

```powershell
# Create Expo project with TypeScript
npx create-expo-app@latest my-app --template expo-template-blank-typescript

# Navigate to project
cd my-app

# Install dependencies
npm install
```

### 2. Install Core Dependencies

```powershell
# State Management
npm install zustand @tanstack/react-query

# UI Libraries
npm install @gluestack-ui/themed nativewind tailwindcss

# Backend
npm install @supabase/supabase-js

# Navigation (Expo Router)
npx expo install expo-router react-native-safe-area-context react-native-screens

# Performance
npm install @shopify/flash-list react-native-reanimated react-native-mmkv

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install expo-haptics expo-image
```

### 3. Install Dev Dependencies

```powershell
# Testing
npm install --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks

# Linting & Formatting
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks

# TypeScript Types
npm install --save-dev @types/react @types/react-native
```

### 4. Configure TypeScript

Ensure `tsconfig.json` has strict mode:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
```

### 5. Configure Testing

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**', '!**/.expo/**'],
};
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  Link: 'Link',
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));
```

### 6. Initialize Supabase

```powershell
# Initialize Supabase in project
supabase init

# Link to remote project (optional, for migrations)
supabase link --project-ref <your-project-ref>

# Generate TypeScript types from Supabase schema
supabase gen types typescript --project-id <your-project-id> > types/database.ts
```

### 7. Initialize Git & GitHub

```powershell
# Initialize Git
git init

# Create .gitignore (Expo template includes one)
# Ensure it has:
# node_modules/
# .expo/
# .env
# .env.local

# Create initial commit
git add .
git commit -m "Initial commit: Expo + TypeScript + Supabase setup"

# Create GitHub repo (via gh CLI)
gh repo create my-app --private --source=. --remote=origin

# Push to GitHub
git push -u origin main
```

### 8. Set Up Environment Variables

Create `.env` file (add to `.gitignore`):

```
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 9. Configure EAS (for builds)

```powershell
# Initialize EAS
eas init

# Configure build profiles in eas.json
# Default profiles created automatically

# Build for development (local)
eas build --profile development --platform ios

# Build for preview (TestFlight/Internal Testing)
eas build --profile preview --platform android
```

---

## Verification Commands

Run these to verify everything is installed correctly:

```powershell
# Core tools
node --version
npm --version
git --version

# Expo
expo --version
eas --version

# Mobile dev (macOS)
xcodebuild -version
pod --version

# Mobile dev (all platforms)
adb --version
java --version

# Backend
supabase --version

# Optional
gh --version
docker --version
```

---

## Next Steps

Once your environment is set up:

1. ✅ **Run the project**: `npx expo start`
2. ✅ **Run tests**: `npm test`
3. ✅ **Follow chatmode pipeline**:
   - Step 2: Enhance Request → create GitHub Issue(s) with specification
   - Step 3: Build Plan → generate PR description and implementation plan
   - Step 4: TDD → execute RED → GREEN → REFACTOR loops

---

## Troubleshooting

### Common Issues

**Metro bundler won't start**

- Clear cache: `npx expo start --clear`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Android emulator not detected**

- Ensure `ANDROID_HOME` is set correctly
- Verify `adb devices` shows your emulator
- Restart emulator and run `adb kill-server && adb start-server`

**iOS build fails**

- Run `pod install` in `ios/` folder (if using bare workflow)
- Clean build: `xcodebuild clean` or via Xcode
- Ensure Xcode Command Line Tools are installed: `xcode-select --install`

**TypeScript errors**

- Restart TypeScript server in VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
- Check `tsconfig.json` extends `expo/tsconfig.base`

**Supabase connection fails**

- Verify environment variables are set correctly
- Check Supabase dashboard for API keys
- Ensure RLS policies allow access (disable for testing, then re-enable)

**Tests fail with module not found**

- Add missing modules to `transformIgnorePatterns` in `jest.config.js`
- Ensure `jest.setup.js` mocks Expo modules correctly

---

## Resources

- **React Native**: https://reactnative.dev/
- **Expo**: https://docs.expo.dev/
- **Gluestack UI**: https://ui.gluestack.io/
- **NativeWind**: https://www.nativewind.dev/
- **TanStack Query**: https://tanstack.com/query/latest
- **Zustand**: https://zustand-demo.pmnd.rs/
- **Supabase**: https://supabase.com/docs
- **Detox**: https://wix.github.io/Detox/
- **React Native Testing Library**: https://callstack.github.io/react-native-testing-library/

---

**Last Updated**: October 25, 2025  
**Compatible with**: Expo SDK 54, React Native 0.81.4, Node.js 18.x/20.x
