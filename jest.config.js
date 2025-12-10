module.exports = {
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  projects: [
    {
      displayName: 'backend',
      testMatch: ['**/tests/Backend/**/*.test.js'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
    },
    {
      displayName: 'frontend',
      testMatch: ['**/tests/Frontend/**/*.test.tsx', '**/tests/Frontend/**/*.test.ts'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
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