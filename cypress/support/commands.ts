/** Construit un faux JWT (signature bidon) avec un claim `exp` dans le futur. */
function fakeJwt(): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const exp = Math.floor(Date.now() / 1000) + 3600
  return `${base64url({ alg: 'HS256' })}.${base64url({ exp })}.signature`
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Visite `path` avec un JWT valide déjà en `sessionStorage` avant que l'app ne démarre,
       * pour atteindre directement les écrans protégés par `authGuard` sans repasser par /login.
       */
      visitAuthenticated(path: string): Chainable<Cypress.AUTWindow>
    }
  }
}

Cypress.Commands.add('visitAuthenticated', (path: string) => {
  return cy.visit(path, {
    onBeforeLoad(win) {
      win.sessionStorage.setItem('authToken', fakeJwt())
    }
  })
})

export {}
