// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  globalIgnores(['dist/*', 'android/*', 'ios/*', '.expo/*']),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/self-closing-comp': 'warn',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
]);
