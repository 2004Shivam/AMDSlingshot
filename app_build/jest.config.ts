import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react" } }],
  },
  moduleNameMapper: {
    // Handle CSS modules
    "\\.module\\.css$": "<rootDir>/src/tests/__mocks__/styleMock.ts",
    // Handle Next.js path aliases
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/tests/**/*.test.ts", "<rootDir>/src/tests/**/*.test.tsx"],
  setupFilesAfterFramework: ["@testing-library/jest-dom"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/tests/**",
  ],
};

export default config;
