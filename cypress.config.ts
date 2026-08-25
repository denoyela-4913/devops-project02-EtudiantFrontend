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
    specPattern: '**/*.cy.ts',
    setupNodeEvents(on) {
      registerTestReport(on)
    }
  }

})