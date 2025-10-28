module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      type: 'ios.simulator',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/AirbnbPropertyManager.app',
      build:
        'xcodebuild -workspace ios/AirbnbPropertyManager.xcworkspace -scheme AirbnbPropertyManager -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      device: {
        type: 'iPhone 15 Pro',
      },
    },
    'ios.sim.release': {
      type: 'ios.simulator',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/AirbnbPropertyManager.app',
      build:
        'xcodebuild -workspace ios/AirbnbPropertyManager.xcworkspace -scheme AirbnbPropertyManager -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
      device: {
        type: 'iPhone 15 Pro',
      },
    },
    'android.emu.debug': {
      type: 'android.emulator',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      device: {
        avdName: 'Pixel_5_API_33',
      },
    },
    'android.emu.release': {
      type: 'android.emulator',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd ..',
      device: {
        avdName: 'Pixel_5_API_33',
      },
    },
  },
  testTimeout: 120000,
  artifacts: {
    rootDir: './e2e/artifacts',
    pathBuilder: './e2e/path-builder.js',
    plugins: {
      screenshot: 'failing',
      video: 'failing',
      instruments: 'all',
      log: 'all',
    },
  },
};
