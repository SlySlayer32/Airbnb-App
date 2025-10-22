const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for Windows paths with spaces
config.watchFolders = [path.resolve(__dirname)];

// Platform support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add alias for @supabase/node-fetch to prevent dynamic import issues
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@supabase/node-fetch': path.resolve(__dirname, 'shims', 'node-fetch.js'),
};

// Enhanced resolver configuration
config.resolver.alias = {
  '@': path.resolve(__dirname),
  '@/components': path.resolve(__dirname, 'components'),
  '@/contexts': path.resolve(__dirname, 'contexts'),
  '@/services': path.resolve(__dirname, 'services'),
  '@/types': path.resolve(__dirname, 'types'),
  '@/utils': path.resolve(__dirname, 'utils'),
  '@/app': path.resolve(__dirname, 'app'),
  '@/data': path.resolve(__dirname, 'data'),
  '@/constants': path.resolve(__dirname, 'constants'),
};

// Enhanced transformer configuration
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

// Enhanced serializer configuration
config.serializer = {
  ...config.serializer,
  getModulesRunBeforeMainModule: () => [
    require.resolve('react-native/Libraries/Core/InitializeCore'),
  ],
};

// Fix file watching for Windows paths with spaces
config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Handle Windows path issues
      if (req.url && req.url.includes('%20')) {
        req.url = decodeURIComponent(req.url);
      }
      return middleware(req, res, next);
    };
  },
};

// Performance optimizations
config.cacheStores = [
  {
    name: 'filesystem',
    options: {
      cacheDirectory: path.resolve(__dirname, '.metro-cache'),
    },
  },
];

// Source map configuration
config.symbolicator = {
  customizeFrame: (frame) => {
    // Customize stack frame processing if needed
    return frame;
  },
};

module.exports = config;
