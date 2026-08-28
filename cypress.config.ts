import { defineConfig } from 'cypress'
import { registerTestReport } from './test-report-support/cypress-report'

export default defineConfig({

  e2e: {
    'baseUrl': 'http://localhost:4200',
    setupNodeEvents(on) {
      registerTestReport(on)
    }
  },


  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    // Uniquement les tests de composants (à côté des pages). Sans ce scope, le motif par
    // défaut engloberait aussi cypress/e2e/**/*.cy.ts, qui ne sont pas des tests de composants.
    specPattern: 'src/**/*.cy.ts',
    setupNodeEvents(on) {
      registerTestReport(on)
    }
  }

})