module.exports = {
  "roots": [
    'test'
  ],
  "snapshotSerializers": [
    "<rootDir>/node_modules/enzyme-to-json/serializer"
  ],
  "setupFilesAfterEnv": [
    "<rootDir>/test/setup.js"
  ]
}
