module.exports = {
  rootDir: '../',
  testMatch: ['<rootDir>/**/*.test.js'],
  moduleDirectories: [
    '<rootDir>/node_modules',
    './node_modules',
    '<rootDir>/jest',
  ],
  setupFiles: ['<rootDir>/jest/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest/setupForEach.js'],
  transformIgnorePatterns: ['node_modules'],
  verbose: true,
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/jest/'],
  coverageThreshold: {
    global: {
      branches: 99.9,
      functions: 99.5,
    },
  },
  globals: {},
  testEnvironment: 'jsdom',
};
