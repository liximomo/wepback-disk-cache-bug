// jest.config.js
module.exports = {
  verbose: true,

  forceExit: false,

  bail: false,

  globals: {
    'ts-jest': {
      tsConfig: {
        allowJs: true,
        target: 'es6',
        lib: ['esnext'],
        module: 'commonjs',
        moduleResolution: 'node',
        skipLibCheck: true,
        esModuleInterop: true,
        noUnusedLocals: false
      }
    }
  },

  testEnvironment: 'node',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  preset: 'ts-jest/presets/js-with-ts',

  roots: ['<rootDir>/test'],

  watchPathIgnorePatterns: ['/fixtures'],

  testMatch: [
    '<rootDir>/test/**/*.test.[jt]s?(x)',
    '**/__tests__/**/*.test.[jt]s?(x)'
  ],
};
