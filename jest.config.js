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
  modulePathIgnorePatterns: ['e2e'],
  // watchPathIgnorePatterns: ['e2e'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverage: true,
};