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
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  plugins: ['prettier'],

  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        printWidth: 120,
        endOfLine: 'auto',
      },
    ],
    'no-unused-vars': 0,
    'trailing-comma': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },

  extends: ['plugin:vue/essential',
  'eslint:recommended',
  '@vue/prettier'],
}
