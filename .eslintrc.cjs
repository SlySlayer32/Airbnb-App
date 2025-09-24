// Legacy ESLint configuration (CommonJS) to ensure compatibility on Windows & with classic extends.
module.exports = {
  root: true,
  extends: ['expo', '@expo/eslint-config'],
  ignorePatterns: ['dist/*', 'node_modules/*'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/no-unescaped-entities': 'off'
  }
};
