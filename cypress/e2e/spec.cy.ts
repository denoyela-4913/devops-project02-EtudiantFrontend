describe('Initial navigation', () => {
  it('redirects the root path to the login page', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
    cy.contains('Login Form')
  })
})
