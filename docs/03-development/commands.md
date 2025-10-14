# Development Commands

> Quick reference for all npm scripts and common commands

## Development Commands

### Start Development Server
```bash
npm start                    # Start Expo dev server (Metro bundler)
npm run ios                  # Launch iOS simulator
npm run android              # Launch Android emulator
npm run web                  # Launch web browser
```

### Type Checking & Linting
```bash
npm run lint                 # TypeScript type checking (npx tsc --noEmit)
npm run type-check           # Same as lint (explicit alias)
```

### Testing
```bash
npm test                     # Run Jest tests
npm run test:watch           # Watch mode (re-run on file change)
npm run test:coverage        # Coverage report
```

### Documentation
```bash
npm run docs:update          # Regenerate component/service manifests
npm run docs:validate        # Check docs are in sync with code
npm run docs:precheck        # Validate before doc operations
```

### Build & Deploy
```bash
npm run build                # Build for web (expo export)
npm run doctor               # Diagnose Expo configuration issues
```

### Clean & Reset
```bash
npm run dev:clean            # Clear all caches and restart
```

## Git Commands

### Basic Operations
```bash
git status                   # Check current changes
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git push origin main         # Push to GitHub
git pull origin main         # Pull latest changes
```

### Viewing Changes
```bash
git --no-pager diff          # View changes
git --no-pager log -5        # View last 5 commits
git log --oneline -10        # Compact commit history
```

### Branch Operations
```bash
git checkout -b feature/name # Create and switch to new branch
git branch                   # List all branches
git checkout main            # Switch to main branch
git branch -d feature/name   # Delete branch
```

## Expo Commands

### Development
```bash
expo start                   # Start development server
expo start --clear           # Clear cache and start
expo start --tunnel          # Use tunnel connection
```

### Building
```bash
eas build --platform ios     # Build iOS app
eas build --platform android # Build Android app
eas build --platform web     # Build web version
```

### Updates
```bash
eas update --branch production # Deploy OTA update
eas update --branch staging    # Deploy to staging
```

## Debugging Commands

### Metro Bundler
```bash
npm start -- --clear         # Clear cache
npm start -- --reset-cache   # Reset cache
```

### React Native Debugger
```bash
# Open React Native Debugger
# Shake device or Cmd+D (iOS) / Cmd+M (Android)
# Select "Debug"
```

### Performance Profiling
```bash
# Enable performance monitor
# Shake device → "Show Performance Monitor"
```

## Package Management

### Install Dependencies
```bash
npm install                  # Install all dependencies
npm install package-name     # Install specific package
npm install -D package-name  # Install dev dependency
```

### Update Dependencies
```bash
npm outdated                 # Check for outdated packages
npm update                   # Update all packages
npm install package@latest   # Update specific package
```

### Clean Install
```bash
rm -rf node_modules          # Remove node_modules
rm package-lock.json         # Remove lock file
npm install                  # Fresh install
```

## Database Commands

### Supabase CLI
```bash
supabase login               # Login to Supabase
supabase init                # Initialize Supabase in project
supabase db pull             # Pull database schema
supabase db push             # Push database schema
supabase db reset            # Reset database
```

## Common Workflows

### Daily Development
```bash
# Morning
git pull origin main         # Get latest changes
npm start                    # Start dev server

# End of day
git add .
git commit -m "FEATURE: Description"
git push origin main
```

### Debugging Issues
```bash
# 1. Clear caches
npm run dev:clean

# 2. Check TypeScript
npm run lint

# 3. Restart Metro
npm start -- --clear

# 4. Check logs
# Look at Metro console output
```

### Deploying Updates
```bash
# 1. Build
eas build --platform all

# 2. Submit to stores
eas submit --platform ios
eas submit --platform android

# 3. Deploy OTA update
eas update --branch production
```

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm start` |
| Type check | `npm run lint` |
| Run tests | `npm test` |
| Clear cache | `npm run dev:clean` |
| Build for web | `npm run build` |
| View git changes | `git --no-pager diff` |
| Create branch | `git checkout -b feature/name` |
| Push changes | `git push origin main` |

---

**Last Updated**: January 2025

