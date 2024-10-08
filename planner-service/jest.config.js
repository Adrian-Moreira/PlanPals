/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  preset: '@shelf/jest-mongodb',
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};