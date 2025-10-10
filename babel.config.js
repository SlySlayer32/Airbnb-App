module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env.local',
          safe: true,
          allowUndefined: false,
          example: '.env.example',
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ]
  };
};