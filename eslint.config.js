// Classic (non-flat) ESLint config retained for compatibility with Expo tooling.
module.exports = {
  extends: ['expo','@expo/eslint-config'],
  ignorePatterns: ['dist/*','node_modules/*'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/no-unescaped-entities': 'off'
  }
};
