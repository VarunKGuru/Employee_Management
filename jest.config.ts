import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// Create a custom Jest config using Next.js
const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

const config: Config = {
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Handle CSS imports (if needed)
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',

    // Handle absolute imports (optional, based on tsconfig)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

export default createJestConfig(config);
