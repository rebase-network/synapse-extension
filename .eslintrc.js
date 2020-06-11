// Refer to: https://github.com/iamturns/eslint-config-airbnb-typescript#i-use-eslint-config-airbnb-with-react-support

module.exports = {
  plugins: ["prettier"],
  extends: ['airbnb-typescript', "plugin:prettier/recommended"],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": true
    }]
  }
};