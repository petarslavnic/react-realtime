module.exports = {
  roots: [
    "test",
  ],
  testMatch: [
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  snapshotSerializers: [
    "<rootDir>/node_modules/enzyme-to-json/serializer",
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test/setupEnzyme.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  }
}
