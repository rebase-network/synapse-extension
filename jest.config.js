// eslint-disable-next-line prettier/prettier
const {
  pathsToModuleNameMapper
} = require('ts-jest/utils');
// eslint-disable-next-line prettier/prettier
const {
  compilerOptions
} = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.scss$': '<rootDir>/config/jest/cssTransform.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: '<rootDir>/config/jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testEnvironment: 'jsdom', // jest-puppeteer will modify it, so we need to explicitly specify it although it's the default value
};