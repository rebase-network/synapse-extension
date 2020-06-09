// Refer to: https://github.com/iamturns/eslint-config-airbnb-typescript#i-use-eslint-config-airbnb-with-react-support

module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
};