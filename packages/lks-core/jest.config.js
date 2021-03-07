module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!**/node_modules/**",
    "!**/__tests__/**",
  ],
  testEnvironment: "node",
};
