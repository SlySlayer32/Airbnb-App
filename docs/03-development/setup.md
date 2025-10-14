# Development Setup

> Complete guide to setting up the development environment

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version
- **Expo CLI**: Installed globally (`npm install -g expo-cli`)

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/airbnb-cleaning-app.git
cd airbnb-cleaning-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` file in project root:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Get Supabase credentials**:
1. Go to https://supabase.com
2. Create new project (or use existing)
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### 4. Start Development Server
```bash
npm start
```

Then choose:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web browser

## Platform-Specific Setup

### iOS Development (macOS only)
```bash
# Install Xcode from App Store
# Install CocoaPods
sudo gem install cocoapods

# Install iOS dependencies
cd ios
pod install
cd ..
```

### Android Development
```bash
# Install Android Studio
# Configure Android SDK
# Create Android Virtual Device (AVD)

# Start Android emulator
npm run android
```

### Web Development
```bash
# No additional setup needed
npm run web
```

## Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- TypeScript Vue Plugin
- React Native Tools
- Expo Tools

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and restart
npm start -- --clear
```

### Module Resolution Issues
```bash
# Clear watchman
watchman watch-del-all

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

## Next Steps

- Read [Workflows Guide](./workflows.md)
- Review [Commands Reference](./commands.md)
- Check [Troubleshooting Guide](./troubleshooting.md)

