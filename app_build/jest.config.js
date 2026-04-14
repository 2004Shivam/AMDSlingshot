/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: { jsx: "react", esModuleInterop: true, allowSyntheticDefaultImports: true },
    }],
  },
  moduleNameMapper: {
    "\\.module\\.css$": "<rootDir>/src/tests/__mocks__/styleMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/tests/**/*.test.ts", "<rootDir>/src/tests/**/*.test.tsx"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/tests/**"],
  coverageReporters: ["text", "lcov"],
};

module.exports = config;
