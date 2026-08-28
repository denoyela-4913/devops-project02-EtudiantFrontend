
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
  // Seuil de couverture bloquant : `jest --coverage` (donc `npm test`) échoue sous ce
  // plancher. Un seuil que rien n'applique se dégrade silencieusement au fil des PR ;
  // le rapport HTML reste pour le diagnostic, mais seul ce gate décide si le build passe.
  // Aligné sur le backend (jacoco:check) : 80% de LIGNES au niveau GLOBAL uniquement, pas
  // fichier par fichier (un plancher par fichier pénaliserait à tort le câblage trivial
  // dont la couverture est binaire). 80% = quality gate SonarQube par défaut ; le code
  // métier hors exclusions est déjà à ~96%, donc un plancher qui protège sans bloquer.
  // Branches volontairement hors gate (comme le backend) : trop sensible aux fichiers de
  // config, et le rapport HTML suffit pour la suivre.
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  reporters: ['default', '<rootDir>/test-report-support/jest-report-reporter.js'],
};
