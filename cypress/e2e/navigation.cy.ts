// Résolution des routes : redirections et accès aux pages publiques.
// L'état d'authentification (connexion, garde, expiration, déconnexion) est dans authentication.cy.ts.
describe('Navigation', () => {
  it('redirige la racine "/" vers /login', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
    cy.contains('Login Form')
  })

  it('redirige une URL inconnue vers /login (route wildcard)', () => {
    cy.visit('/cette-route-nexiste-pas')
    cy.url().should('include', '/login')
  })

  it('sert la page /login sans authentification', () => {
    cy.visit('/login')
    cy.get('input[formcontrolname="login"]').should('exist')
    cy.get('input[formcontrolname="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('sert la page /register sans authentification', () => {
    cy.visit('/register')
    cy.contains('Registration Form')
  })
})
