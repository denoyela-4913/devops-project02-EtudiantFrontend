/** Construit un faux JWT (signature bidon) avec un claim `exp` dans le futur, pour les mocks de connexion. */
function fakeJwt(): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const exp = Math.floor(Date.now() / 1000) + 3600
  return `${base64url({ alg: 'HS256' })}.${base64url({ exp })}.signature`
}

function fillLoginForm(login: string, password: string): void {
  cy.get('input[formcontrolname="login"]').type(login)
  cy.get('input[formcontrolname="password"]').type(password)
  cy.get('button[type="submit"]').click()
}

describe('Authentication flow', () => {
  it('logs in successfully and reaches the protected student area', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { token: fakeJwt() }
    }).as('login')

    cy.visit('/login')
    fillLoginForm('etudiant', 'password123')

    cy.wait('@login')
    cy.url().should('include', '/etudiants')
    cy.contains('Gestion des étudiants')
  })

  it('shows an error and stays on /login when credentials are rejected', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('login')

    cy.visit('/login')
    fillLoginForm('etudiant', 'wrong-password')

    cy.wait('@login')
    cy.contains('Login or password is invalid')
    cy.url().should('include', '/login')
  })

  it('redirects to /login when accessing a protected route without a session', () => {
    cy.visit('/etudiants/liste')

    cy.url().should('include', '/login')
  })

  it('logging out then revisiting a protected route redirects to /login again', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { token: fakeJwt() }
    }).as('login')

    cy.visit('/login')
    fillLoginForm('etudiant', 'password123')
    cy.wait('@login')
    cy.url().should('include', '/etudiants')

    cy.contains('button', 'Déconnexion').click()
    cy.url().should('include', '/login')

    cy.visit('/etudiants/liste')
    cy.url().should('include', '/login')
  })
})
