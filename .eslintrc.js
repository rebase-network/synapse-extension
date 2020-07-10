// Refer to: https://github.com/iamturns/eslint-config-airbnb-typescript#i-use-eslint-config-airbnb-with-react-support

module.exports = {
  plugins: [
    'prettier',
    'testing-library',
    'jest-dom',
  ],
  extends: [
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'plugin:testing-library/recommended',
    "plugin:testing-library/react",
    'plugin:jest-dom/recommended',
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    "spaced-comment": ["error", "always", {
      "markers": ["/"]
    }],
    'import/no-extraneous-dependencies': ["warn", {
      devDependencies: true
    }],
    'no-plusplus': ["warn", {
      allowForLoopAfterthoughts: true
    }]
  }
};