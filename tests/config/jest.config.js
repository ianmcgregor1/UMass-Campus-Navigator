const path = require('path');

const rootDir = path.resolve(__dirname, '../..');

module.exports = {
  rootDir,
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  projects: [
    {
      displayName: 'backend',
      rootDir,
      testMatch: ['<rootDir>/tests/Backend/**/*.test.js'],
      testEnvironment: 'node',
      setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')]
    },
    {
      displayName: 'frontend',
      rootDir,
      testMatch: ['<rootDir>/tests/Frontend/**/*.test.tsx', '<rootDir>/tests/Frontend/**/*.test.ts'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
      moduleNameMapper: {
        '\\.(css|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: {
            jsx: 'react',
            esModuleInterop: true,
            allowSyntheticDefaultImports: true
          }
        }]
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
    }
  ]
};