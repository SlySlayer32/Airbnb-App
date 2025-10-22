# Airbnb Property Manager

A production-grade React Native application built with Expo for managing Airbnb properties, cleaning schedules, maintenance tasks, and team coordination.

## 🚀 Features

- **Property Management**: Complete property lifecycle management
- **Cleaning Coordination**: Schedule and track cleaning tasks
- **Maintenance Tracking**: Monitor and manage maintenance requests
- **Team Management**: Coordinate with cleaning staff and maintenance teams
- **Real-time Updates**: Live notifications and status updates
- **Photo Documentation**: Capture and organize property photos
- **Multi-platform**: iOS, Android, and Web support

## 🛠 Tech Stack

### Core Technologies
- **React Native** 0.81.4 with Expo SDK 54
- **TypeScript** with strict mode
- **Expo Router** for file-based routing
- **Gluestack UI** for universal component library
- **NativeWind** for styling

### State Management & Data
- **TanStack Query** for server state management
- **Zustand** for client state management
- **Supabase** for backend services
- **React Hook Form** + **Zod** for forms and validation

### Performance & Optimization
- **@shopify/flash-list** for high-performance lists
- **React Native Reanimated** for smooth animations
- **React Native MMKV** for fast local storage
- **Expo Secure Store** for sensitive data

### Development Tools
- **ESLint** + **Prettier** for code quality
- **Jest** + **React Native Testing Library** for testing
- **Detox** for E2E testing
- **Husky** + **lint-staged** for pre-commit hooks

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Supabase account and project

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd airbnb-property-manager
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Run on Devices

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## 📁 Project Structure

```
├── app/                    # Expo Router pages
│   ├── auth/              # Authentication screens
│   ├── properties.tsx     # Property management
│   ├── maintenance.tsx    # Maintenance tracking
│   └── ...
├── components/            # Reusable UI components
├── contexts/             # React contexts
├── services/             # Business logic and API calls
├── types/                # TypeScript type definitions
├── utils/                 # Utility functions
├── data/                  # Mock data and constants
└── assets/               # Images, fonts, etc.
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e:build
npm run test:e2e
```

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:clean        # Start with clean cache
npm run dev:tunnel       # Start with tunnel for external access

# Building
npm run build            # Build for all platforms
npm run build:web        # Build for web only
npm run prebuild         # Generate native code

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking
npm run validate         # Run all quality checks

# Platform Specific
npm run ios              # Run on iOS
npm run android          # Run on Android
npm run web              # Run on Web

# Production Builds
npm run ios:release      # Build iOS for production
npm run android:release  # Build Android for production

# Utilities
npm run clean            # Clean all caches
npm run doctor           # Check project health
npm run update:check     # Check for dependency updates
```

## 🏗 Production Deployment

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for production
eas build --platform all --profile production
```

### App Store Deployment

```bash
# Submit to App Store
eas submit --platform ios --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
EXPO_PUBLIC_APP_NAME=Airbnb Property Manager
EXPO_PUBLIC_ENVIRONMENT=development

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=false
```

## 📱 Platform Support

- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0)
- **Web**: Modern browsers with ES2022 support

## 🎨 UI Components

This project uses **Gluestack UI** for consistent, accessible components across platforms:

- Universal compatibility (iOS, Android, Web)
- WCAG 2.1 AA accessibility compliance
- Dark mode support
- Responsive design
- TypeScript support

## 🔄 State Management

### Server State (TanStack Query)
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['properties'],
  queryFn: fetchProperties,
});
```

### Client State (Zustand)
```typescript
const useAppStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

## 📊 Performance

- **Bundle Analysis**: `npm run analyze:bundle`
- **Performance Monitoring**: Built-in React Native performance tools
- **Memory Optimization**: Efficient list rendering with FlashList
- **Image Optimization**: Expo Image with WebP support

## 🛡 Security

- **Secure Storage**: Expo Secure Store for sensitive data
- **Biometric Authentication**: Face ID / Touch ID support
- **Environment Variables**: Secure configuration management
- **Input Validation**: Zod schemas for all data validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write tests for new features
- Follow conventional commit messages
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- Gluestack UI for the universal component library
- Supabase for the backend infrastructure
- React Native community for continuous improvements
