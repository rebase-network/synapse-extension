// eslint-disable-next-line prettier/prettier
const {
  defaults: tsPreset
} = require('ts-jest/presets');

module.exports = {
  transform: {
    ...tsPreset.transform,
  },
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  setupFilesAfterEnv: ['expect-puppeteer'],
  preset: 'jest-puppeteer',
};