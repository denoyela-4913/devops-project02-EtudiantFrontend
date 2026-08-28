import { fakeJwt } from './jwt'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Visite `path` avec un JWT déjà posé en `sessionStorage` avant le démarrage de l'app,
       * pour atteindre directement un écran protégé par `authGuard` sans repasser par /login.
       * `{ expired: true }` pose un token périmé (claim `exp` dans le passé).
       */
      visitAuthenticated(path: string, options?: { expired?: boolean }): Chainable<Cypress.AUTWindow>
    }
  }
}

Cypress.Commands.add('visitAuthenticated', (path: string, options?: { expired?: boolean }) => {
  const token = fakeJwt(options?.expired ? -3600 : 3600)
  return cy.visit(path, {
    onBeforeLoad(win) {
      win.sessionStorage.setItem('authToken', token)
    }
  })
})

export {}
