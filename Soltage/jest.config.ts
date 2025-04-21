import type { Config } from 'jest';


const config: Config = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    transform: {
        ".(ts|tsx)": "ts-jest"
    },
    moduleNameMapper: {
        "\\.svg$": "<rootDir>/__mocks__/fileMock.js"
      },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/coverage",
        "package.json",
        "package-lock.json",
        ".scannerwork/",
        ".env",
        "reportWebVitals.ts",
        "setupTests.ts",
        "index.tsx"
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    testResultsProcessor: "jest-sonar-reporter",
    testMatch: ["**/__tests__/**/*.(spec|test).[jt]s?(x)"]
};

export default config;
