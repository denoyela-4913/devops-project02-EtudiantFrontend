describe('Etudiant list', () => {
  it('displays the students returned by the API', () => {
    cy.intercept('GET', '/api/etudiants', [
      { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
      { id: 2, firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com' }
    ]).as('getAll')

    cy.visitAuthenticated('/etudiants/liste')
    cy.wait('@getAll')

    cy.contains('Liste des étudiants')
    cy.get('table tbody tr').should('have.length', 2)
    cy.contains('td', 'Ada')
    cy.contains('td', 'alan@example.com')
  })

  it('shows an error message when the API call fails', () => {
    cy.intercept('GET', '/api/etudiants', { statusCode: 500 }).as('getAll')

    cy.visitAuthenticated('/etudiants/liste')
    cy.wait('@getAll')

    cy.contains('Impossible de charger la liste des étudiants.')
  })
})
