const { pathsToModuleNameMapper } = require('ts-jest/utils');

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');

module.exports = {
    "rootDir": ".",
    "moduleFileExtensions": [
        "js",
        "json",
        "ts"
    ],
    'moduleNameMapper': pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    "testRegex": ".spec.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    "coverageDirectory": "./coverage",
    "testEnvironment": "node",
    "setupFiles": ['./test/setup/auto-mapper.ts']
};
