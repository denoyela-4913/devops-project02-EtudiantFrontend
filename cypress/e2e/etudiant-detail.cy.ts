describe('Etudiant detail', () => {
  beforeEach(() => {
    cy.visitAuthenticated('/etudiants/detail')
  })

  it('displays the student matching the searched id', () => {
    cy.intercept('GET', '/api/etudiants/1', {
      id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com'
    }).as('getById')

    cy.get('input[formcontrolname="id"]').type('1')
    cy.get('button[type="submit"]').click()
    cy.wait('@getById')

    cy.contains('td', 'Ada')
    cy.contains('td', 'Lovelace')
    cy.contains('td', 'ada@example.com')
  })

  it('shows "Étudiant introuvable" when the id does not exist', () => {
    cy.intercept('GET', '/api/etudiants/999', { statusCode: 404 }).as('getById')

    cy.get('input[formcontrolname="id"]').type('999')
    cy.get('button[type="submit"]').click()
    cy.wait('@getById')

    cy.contains('Étudiant introuvable.')
  })
})
