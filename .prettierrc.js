module.exports = {
  // Basic formatting
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',

  // Plugin configurations
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  // Import sorting configuration
  importOrder: [
    // React and React Native imports
    '^react$',
    '^react-native$',
    '^react/(.*)$',
    '^react-native/(.*)$',

    // Expo imports
    '^expo(.*)$',
    '^@expo/(.*)$',

    // Third-party libraries
    '^@(?!gluestack-ui|supabase|tanstack|shopify|gorhom|legendapp|hookform|react-navigation|react-native-community|testing-library)(.*)$',

    // Gluestack UI
    '^@gluestack-ui/(.*)$',

    // Supabase
    '^@supabase/(.*)$',

    // TanStack
    '^@tanstack/(.*)$',

    // Shopify
    '^@shopify/(.*)$',

    // Gorhom
    '^@gorhom/(.*)$',

    // Legendapp
    '^@legendapp/(.*)$',

    // Hookform
    '^@hookform/(.*)$',

    // React Navigation
    '^@react-navigation/(.*)$',

    // React Native Community
    '^@react-native-community/(.*)$',

    // Testing Library
    '^@testing-library/(.*)$',

    // Internal imports (absolute paths)
    '^@/(.*)$',

    // Relative imports
    '^\\.\\./(.*)$',
    '^\\./(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,

  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.{yml,yaml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};
