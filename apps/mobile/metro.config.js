const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: 'mobile',
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
    platforms: ['ios', 'android', 'native', 'web'],
    extraNodeModules: {
      '@supabase/node-fetch': path.resolve(
        __dirname,
        '../../shims',
        'node-fetch.js'
      ),
    },
    alias: {
      '@': path.resolve(__dirname),
      '@/app': path.resolve(__dirname, 'app'),
      '@/components': path.resolve(__dirname, '../../components'),
      '@/contexts': path.resolve(__dirname, '../../contexts'),
      '@/services': path.resolve(__dirname, '../../services'),
      '@/types': path.resolve(__dirname, '../../types'),
      '@/utils': path.resolve(__dirname, '../../utils'),
      '@/data': path.resolve(__dirname, '../../data'),
      '@/constants': path.resolve(__dirname, '../../constants'),
    },
  },
  server: {
    port: 8081,
    enhanceMiddleware: middleware => (req, res, next) => {
      if (req.url && req.url.includes('%20')) {
        req.url = decodeURIComponent(req.url);
      }
      return middleware(req, res, next);
    },
  },
  cacheStores: [
    {
      name: 'filesystem',
      options: {
        cacheDirectory: path.resolve(__dirname, '.metro-cache'),
      },
    },
  ],
};

module.exports = withNxMetro(mergeConfig(defaultConfig, customConfig), {
  debug: false,
  extensions: [],
  watchFolders: [],
});
