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
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/app': './app',
            '@/components': '../../components',
            '@/contexts': '../../contexts',
            '@/services': '../../services',
            '@/types': '../../types',
            '@/utils': '../../utils',
            '@/data': '../../data',
            '@/constants': '../../constants',
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '../../.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-async-to-generator',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
    env: {
      development: {
        plugins: ['react-refresh/babel'],
      },
      production: {
        plugins: ['transform-remove-console', 'transform-remove-debugger'],
      },
      test: {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    },
  };
};
