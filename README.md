# Airbnb Property Manager 🏠

A comprehensive property management application built with React Native and Expo, featuring cleaning schedules, maintenance tracking, team management, and more.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SlySlayer32/Airbnb-App.git
   cd Airbnb-App
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with your Supabase credentials:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 🔧 Development Mode

Start the development server with one of these commands:

```bash
# Start the development server
npm start
# or
npm run start
# or
npx expo start
```

**Development Options:**

- Press `a` - Open on Android emulator
- Press `i` - Open on iOS simulator  
- Press `w` - Open in web browser
- Press `r` - Reload the app
- Press `m` - Toggle menu
- Scan QR code with Expo Go app on your device

**Platform-specific commands:**

```bash
# Android development
npm run android

# iOS development  
npm run ios

# Web development
npm run web
```

## 🛠️ Configuration Files

### Core Configuration

#### `app.json` - Expo Configuration

Main Expo configuration file containing:

- App metadata (name, version, slug)
- Platform-specific settings (iOS, Android, Web)
- Plugins and extensions
- Splash screen and icon configurations
- Runtime settings

#### `package.json` - Dependencies & Scripts

- Project dependencies and devDependencies
- Available npm scripts
- Project metadata

#### `.env` - Environment Variables

- Supabase connection settings
- API keys and secrets
- Environment-specific configurations

### Development Tools

#### `eslint.config.js` - Code Linting

ESLint configuration for code quality and consistency:

```bash
# Run linting
npm run lint

# Run linting with auto-fix
npx eslint . --fix
```

#### `tsconfig.json` - TypeScript Configuration

TypeScript compiler settings:

- Type checking rules
- Module resolution
- Path mappings
- Target compilation settings

#### `babel.config.js` - JavaScript Transpilation

Babel configuration for JavaScript/TypeScript compilation:

- Preset configurations
- Plugin settings
- Environment-specific transforms

#### `metro.config.js` - Metro Bundler

Metro bundler configuration for React Native:

- Asset resolution
- Module bundling rules
- Platform-specific configurations

## 📱 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm start` | Start development server |
| `android` | `npm run android` | Start on Android emulator |
| `ios` | `npm run ios` | Start on iOS simulator |
| `web` | `npm run web` | Start web development |
| `lint` | `npm run lint` | Run ESLint code analysis |
| `build` | `npm run build` | Build for web production |
| `reset-project` | `npm run reset-project` | Reset to blank project |

## 🏗️ Project Structure

```text
├── app/                    # Main application screens (file-based routing)
│   ├── auth/              # Authentication screens
│   ├── lib/               # Supabase configuration
│   └── _layout.tsx        # Root layout component
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── services/              # API and business logic
├── types/                 # TypeScript type definitions
├── data/                  # Mock data and constants
├── assets/                # Images, fonts, and static files
├── .github/workflows/     # GitHub Actions CI/CD
└── Configuration files
```

## 🔍 Code Quality Tools

### ESLint Setup

- **Config**: `eslint.config.js`
- **Extends**: `eslint-config-expo`
- **Run**: `npm run lint`

### TypeScript Setup

- **Config**: `tsconfig.json`
- **Version**: ~5.9.2
- **Type checking**: Integrated with development server

### Development Workflow

1. Make changes to your code
2. Save files (auto-reload in development)
3. Run `npm run lint` to check code quality
4. Use TypeScript for type safety
5. Test on multiple platforms

## 🚦 CI/CD Pipeline

GitHub Actions workflow located in `.github/workflows/`:

- Automated testing on push/PR
- TypeScript type checking
- ESLint code quality checks
- Environment setup and dependency installation

## 🎯 Features

- **Property Management**: Add, edit, and track rental properties
- **Cleaning Schedules**: Manage cleaning sessions and updates
- **Maintenance Tracking**: Log and track maintenance requests
- **Team Management**: Organize team members and roles
- **Invoice Management**: Handle billing and payments
- **Reports & Analytics**: Generate insights and reports
- **Multi-platform**: iOS, Android, and Web support

## 🔗 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Supabase
- **Navigation**: Expo Router (file-based)
- **State Management**: React Context
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Styling**: React Native built-in styles

## 📚 Learn More

### Expo Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)

### React Native Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)

### Backend Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**

   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**

   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Environment variables not loading**
   - Ensure `.env` file is in root directory
   - Restart development server after changes

4. **TypeScript errors**

   ```bash
   npx tsc --noEmit
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

Happy coding! 🎉
