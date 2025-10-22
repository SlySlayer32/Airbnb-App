module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo',
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      // React Native Reanimated plugin (must be last)
      'react-native-reanimated/plugin',

      // Import sorting and optimization
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/contexts': './contexts',
            '@/services': './services',
            '@/types': './types',
            '@/utils': './utils',
            '@/app': './app',
            '@/data': './data',
            '@/constants': './constants',
          },
        },
      ],

      // React Native dotenv
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
      ],

      // Optional chaining and nullish coalescing
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',

      // Class properties
      '@babel/plugin-proposal-class-properties',

      // Object rest spread
      '@babel/plugin-proposal-object-rest-spread',

      // Async/await
      '@babel/plugin-transform-async-to-generator',

      // Decorators (if needed)
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
    env: {
      development: {
        plugins: [
          // Development-only plugins
          'react-refresh/babel',
        ],
      },
      production: {
        plugins: [
          // Production optimizations
          'transform-remove-console',
          'transform-remove-debugger',
        ],
      },
      test: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
        plugins: [
          '@babel/plugin-transform-modules-commonjs',
        ],
      },
    },
  };
};
