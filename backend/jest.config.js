export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts: ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js: '$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest|express-rate-limit)/)',
  ],
};