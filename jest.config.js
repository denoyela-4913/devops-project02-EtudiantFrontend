
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/app/**/*.ts', '!src/app/**/*.spec.ts', '!src/app/**/*.cy.ts', '!src/app/core/models/**'],
  // Câblage DI/routage sans logique : les tester n'apporterait rien et fausserait le pourcentage.
  coveragePathIgnorePatterns: ['src/app/app.config.ts', 'src/app/app.routes.ts'],
  // json-summary alimente coverage/coverage-summary.json, lu par generate-entry-point.js
  // pour afficher le pourcentage global sur RAPPORTS-TESTS.html.
  coverageReporters: ['html', 'json-summary'],
  reporters: ['default', '<rootDir>/test-report-support/jest-report-reporter.js'],
};
