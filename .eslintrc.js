module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true
  },
  extends: 'airbnb',
  plugins: [
    'react'
  ],
  rules: {
    'react/jsx-curly-spacing': 0,
    'react/jsx-filename-extension': 0,
    'react/forbid-prop-types': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'arrow-body-style': 1,
    'arrow-parens': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': 1,
    'no-underscore-dangle': 0,
    'no-confusing-arrow': 0,
    'no-plusplus': 0,
    'no-constant-condition': 0
  }
};
