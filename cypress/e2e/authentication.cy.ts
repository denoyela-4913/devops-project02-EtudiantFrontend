import { fakeJwt } from '../support/jwt'

// État d'authentification de bout en bout : connexion/déconnexion, garde de route (`authGuard`),
// et intercepteur HTTP (`authInterceptor`) — token expiré, 401 en cours de session, en-tête Bearer.
// L'API `/api/*` est simulée ; le JWT est un faux (signature bidon, claim `exp` seul).

function submitLogin(login: string, password: string): void {
  cy.get('input[formcontrolname="login"]').type(login)
  cy.get('input[formcontrolname="password"]').type(password)
  cy.get('button[type="submit"]').click()
}

describe('Authentification', () => {
  it('connexion réussie : stocke le JWT et atteint la zone étudiants', () => {
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: fakeJwt() } }).as('login')

    cy.visit('/login')
    submitLogin('etudiant', 'password123')

    cy.wait('@login')
    cy.url().should('include', '/etudiants')
    cy.contains('Gestion des étudiants')
  })

  it('identifiants rejetés (401) : message d\'erreur, maintien sur /login', () => {
    cy.intercept('POST', '/api/login', { statusCode: 401, body: { message: 'Invalid credentials' } }).as('login')

    cy.visit('/login')
    submitLogin('etudiant', 'mauvais-mot-de-passe')

    cy.wait('@login')
    cy.contains('Login or password is invalid')
    cy.url().should('include', '/login')
  })

  it('route protégée sans session : redirection vers /login', () => {
    cy.visit('/etudiants/liste')
    cy.url().should('include', '/login')
  })

  it('déconnexion : retour à /login et route protégée de nouveau bloquée', () => {
    cy.visitAuthenticated('/etudiants')
    cy.contains('button', 'Déconnexion').click()
    cy.url().should('include', '/login')

    cy.visit('/etudiants/liste')
    cy.url().should('include', '/login')
  })

  it('JWT expiré : la garde purge le token et redirige vers /login', () => {
    cy.visitAuthenticated('/etudiants/liste', { expired: true })

    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('authToken')).to.be.null
    })
  })

  it('401 sur un appel API authentifié : déconnexion automatique et redirection', () => {
    cy.intercept('GET', '/api/etudiants', { statusCode: 401 }).as('getAll')

    cy.visitAuthenticated('/etudiants/liste')
    cy.wait('@getAll')

    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('authToken')).to.be.null
    })
  })

  it('les requêtes authentifiées portent l\'en-tête Authorization: Bearer <token>', () => {
    cy.intercept('GET', '/api/etudiants', []).as('getAll')

    cy.visitAuthenticated('/etudiants/liste')
    cy.window().then((win) => {
      const token = win.sessionStorage.getItem('authToken')
      cy.wait('@getAll').its('request.headers.authorization').should('eq', `Bearer ${token}`)
    })
  })
})
