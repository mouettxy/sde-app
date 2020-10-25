module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
    browser: true,
  },

  globals: {
    localStorage: true,
    fetch: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  plugins: ['prettier'],

  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        printWidth: 120,
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/space-before-function-paren': 0,
    'space-before-function-paren': 0,
    'no-unused-vars': 0,
    'trailing-comma': 0,
  },

  extends: ['plugin:vue/essential', '@vue/typescript/recommended', '@vue/prettier/@typescript-eslint'],
}
