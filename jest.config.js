module.exports = {
  preset: "ts-jest",
  collectCoverage: true,
  coverageDirectory: "reporting/coverage",
  coverageThreshold: {
    global: {
      branches: 60,
      lines: 70,
    },
  },
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/index.ts",
    "!src/**/index.tsx",
    "!src/main.ts",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
      diagnostics: {
        warnOnly: true,
      },
      tsconfig: "tsconfig.json",
    },
  },
};
