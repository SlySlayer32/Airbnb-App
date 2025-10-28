---
applyTo: '**'
description: 'Platform-specific considerations for iOS, Android, and Web'
---

# Platform-Specific Guidelines

## Cross-Platform Philosophy

Write once, run everywhere - but be aware of platform differences:

- Use React Native APIs that work cross-platform
- Handle platform-specific edge cases gracefully
- Test on all target platforms
- Provide platform-specific UX where appropriate

## Platform Detection

### Basic detection

```typescript
import { Platform } from 'react-native';

// Check current platform
if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
} else if (Platform.OS === 'web') {
  // Web-specific code
}

// Platform version (iOS/Android only)
const version = Platform.Version;
// iOS: returns version number (e.g., 16)
// Android: returns API level (e.g., 33)
```

### Platform.select for values

```typescript
import { Platform } from 'react-native';

// Select value based on platform
const fontSize = Platform.select({
  ios: 16,
  android: 14,
  web: 14,
  default: 14,
});

// In styles
const styles = {
  container: {
    paddingTop: Platform.select({
      ios: 20,
      android: 0,
      web: 0,
    }),
  },
};
```

## iOS-Specific Considerations

### Safe Area handling

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Use SafeAreaView for iOS notch/home indicator
<SafeAreaView style={{ flex: 1 }}>
  <Content />
</SafeAreaView>

// Or use safe area insets
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
 paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
      <Content />
    </View>
  );
}
```

### iOS-specific permissions

```xml
<!-- ios/AirbnbApp/Info.plist -->
<dict>
  <!-- Camera access -->
  <key>NSCameraUsageDescription</key>
  <string>We need camera access to take photos of cleaned properties</string>

  <!-- Photo library -->
  <key>NSPhotoLibraryUsageDescription</key>
  <string>We need photo library access to upload cleaning photos</string>

  <!-- Location (if needed) -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>We need your location to show nearby properties</string>

  <!-- Push notifications -->
  <key>UIBackgroundModes</key>
  <array>
    <string>remote-notification</string>
  </array>
</dict>
```

### iOS keyboard behavior

```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

// Handle keyboard on iOS
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <Input />
</KeyboardAvoidingView>
```

### iOS navigation patterns

```typescript
// iOS prefers swipe-back gesture
// Expo Router handles this automatically
// Ensure nothing blocks swipe gesture area

// iOS prefers modal presentation for certain screens
<Stack.Screen
  name="auth"
  options={{
    presentation: 'modal', // iOS-style modal
    headerShown: true,
  }}
/>
```

### iOS-specific styling

```typescript
const styles = {
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};

// Apply conditionally
<Box
  sx={{
    ...Platform.select({
      ios: styles.shadowIOS,
      default: {},
    }),
  }}
/>
```

## Android-Specific Considerations

### Hardware back button

```typescript
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

function Screen() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Custom back button behavior
      if (hasUnsavedChanges) {
        showConfirmDialog();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    });

    return () => backHandler.remove();
  }, [hasUnsavedChanges]);
}
```

### Android permissions

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest>
  <!-- Camera -->
  <uses-permission android:name="android.permission.CAMERA" />

  <!-- Storage -->
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

  <!-- Location -->
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

  <!-- Push notifications -->
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
</manifest>
```

### Android-specific styling

```typescript
// Android uses elevation for shadows
const styles = {
  shadowAndroid: {
    elevation: 4, // Android shadow
  },
};

<Box
  sx={{
    ...Platform.select({
      android: styles.shadowAndroid,
      default: {},
    }),
  }}
/>
```

### Android status bar

```typescript
import { StatusBar } from 'expo-status-bar';

// Control status bar appearance
<StatusBar
  style="dark" // or "light"
  backgroundColor="#ffffff" // Android only
  translucent={false} // Android only
/>
```

### Android ripple effect

```typescript
import { Pressable, Platform } from 'react-native';

<Pressable
  android_ripple={{
    color: 'rgba(0, 0, 0, 0.1)',
    borderless: false,
  }}
  style={({ pressed }) => ({
    opacity: Platform.OS === 'ios' && pressed ? 0.7 : 1,
  })}
>
  <Text>Press me</Text>
</Pressable>
```

## Web-Specific Considerations

### Web-specific layouts

```typescript
import { Platform } from 'react-native';

// Max width for web (mobile-first)
<Box
  sx={{
    '@base': { width: '100%' },
    '@md': { maxWidth: 768, margin: '0 auto' },
    '@lg': { maxWidth: 1024 },
  }}
>
  {Platform.OS === 'web' ? (
    <WebNavigation />
  ) : (
    <MobileNavigation />
  )}
</Box>
```

### Web SEO (Next.js/Expo Web)

```typescript
// app/properties/[id].tsx
import Head from 'expo-router/head';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const property = useProperty(id);

  return (
    <>
      <Head>
        <title>{property?.name} - Airbnb Cleaning</title>
        <meta name="description" content={property?.address} />
        <meta property="og:title" content={property?.name} />
        <meta property="og:image" content={property?.imageUrl} />
      </Head>
      <PropertyDetails property={property} />
    </>
  );
}
```

### Web-specific interactions

```typescript
// Mouse hover states (web only)
const [isHovered, setIsHovered] = useState(false);

<View
  onMouseEnter={Platform.OS === 'web' ? () => setIsHovered(true) : undefined}
  onMouseLeave={Platform.OS === 'web' ? () => setIsHovered(false) : undefined}
  style={{
    backgroundColor: isHovered ? '#f0f0f0' : '#ffffff',
  }}
>
  <Content />
</View>
```

### Web navigation

```typescript
// Web supports browser back/forward
// Expo Router handles this automatically

// For custom web navigation
if (Platform.OS === 'web') {
  window.history.pushState(null, '', '/properties');
}
```

### Web accessibility

```typescript
// Use semantic HTML on web
import { Platform } from 'react-native';

{Platform.OS === 'web' ? (
  <button onClick={handleClick}>Submit</button>
) : (
  <Pressable onPress={handleClick}>
    <Text>Submit</Text>
  </Pressable>
)}
```

## Storage Differences

### Async Storage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Works on all platforms
// iOS: Uses native UserDefaults
// Android: Uses native SharedPreferences
// Web: Uses localStorage

await AsyncStorage.setItem('key', 'value');
const value = await AsyncStorage.getItem('key');
```

### Secure Storage (native only)

```typescript
import * as SecureStore from 'expo-secure-store';

// iOS/Android only - not available on web
if (Platform.OS !== 'web') {
  await SecureStore.setItemAsync('auth_token', token);
  const token = await SecureStore.getItemAsync('auth_token');
} else {
  // Fallback for web (use with caution - not secure)
  localStorage.setItem('auth_token', token);
}
```

## Responsive Design

### Dimension-based styling

```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 375;
const isTablet = width >= 768;

// Update on dimension changes
import { useWindowDimensions } from 'react-native';

function ResponsiveComponent() {
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : width >= 480 ? 2 : 1;

  return <Grid columns={columns} />;
}
```

### Media queries (web)

```typescript
// Gluestack UI responsive tokens
<Box
  p="$4"
  sx={{
    '@sm': { p: '$6' },
    '@md': { p: '$8' },
    '@lg': { p: '$12' },
  }}
/>
```

## Testing Across Platforms

### Platform-specific tests

```typescript
describe('PropertyCard', () => {
  it('shows iOS-specific shadow', () => {
    Platform.OS = 'ios';
    const { getByTestId } = render(<PropertyCard property={mock} />);
    const card = getByTestId('property-card');
    expect(card.props.style).toHaveProperty('shadowOpacity');
  });

  it('shows Android-specific elevation', () => {
    Platform.OS = 'android';
    const { getByTestId } = render(<PropertyCard property={mock} />);
    const card = getByTestId('property-card');
    expect(card.props.style).toHaveProperty('elevation');
  });
});
```

## Build Differences

### iOS build (EAS)

```json
// eas.json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "scheme": "AirbnbApp",
        "enterpriseProvisioning": "universal"
      }
    }
  }
}
```

### Android build (EAS)

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk", // or "app-bundle"
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

### Web build

```bash
# Build for web
npx expo export --platform web

# Output in dist/
# Deploy to hosting (Vercel, Netlify, etc.)
```

## Performance Considerations

### Platform-specific optimizations

```typescript
// iOS: Disable image animations for better scrolling
import { Platform } from 'react-native';

<Image
  source={imageUrl}
  fadeDuration={Platform.OS === 'android' ? 300 : 0}
/>

// Android: Use native driver for animations
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Android performs better
}).start();
```

## Platform Checklist

Before release, verify:

### iOS

- [ ] Info.plist permissions configured
- [ ] Safe area handled properly
- [ ] Swipe-back gesture works
- [ ] Modal presentation correct
- [ ] App icons all sizes provided
- [ ] Launch screen configured
- [ ] Keyboard behavior correct
- [ ] Tested on physical device

### Android

- [ ] AndroidManifest permissions configured
- [ ] Hardware back button handled
- [ ] Elevation shadows correct
- [ ] Status bar configured
- [ ] Ripple effects on touchables
- [ ] App icons all sizes provided
- [ ] Splash screen configured
- [ ] Tested on physical device

### Web

- [ ] SEO meta tags added
- [ ] Responsive on desktop/tablet/mobile
- [ ] Browser back/forward works
- [ ] Accessibility (keyboard navigation, ARIA)
- [ ] Favicon configured
- [ ] Works in Chrome, Safari, Firefox
- [ ] PWA manifest (if applicable)
- [ ] Web-specific analytics configured
