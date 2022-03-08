const { pathsToModuleNameMapper } = require('ts-jest/utils');

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('../tsconfig');

module.exports = {
    rootDir: '../',
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    testEnvironment: 'node',
    testRegex: '.e2e-spec.ts$',
    testTimeout: 30000,
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    setupFiles: ['./test/setup/auto-mapper.ts'],
};
