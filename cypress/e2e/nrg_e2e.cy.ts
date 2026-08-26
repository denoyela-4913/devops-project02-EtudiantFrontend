describe('Login page', () => {
  it('renders the login form', () => {
    cy.visit('/login')
    cy.contains('Login Form')
    cy.get('form').within(() => {
      cy.get('input[formcontrolname="login"]').should('exist')
      cy.get('input[formcontrolname="password"]').should('exist')
      cy.get('button[type="submit"]').should('exist')
    })
  })
})
