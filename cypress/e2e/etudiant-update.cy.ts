describe('Etudiant update', () => {
  beforeEach(() => {
    cy.visitAuthenticated('/etudiants/modifier')
  })

  it('loads a student, edits it, and shows a success message', () => {
    cy.intercept('GET', '/api/etudiants/1', {
      id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com'
    }).as('getById')
    cy.intercept('PUT', '/api/etudiants/1', { statusCode: 200 }).as('update')

    cy.get('input[formcontrolname="id"]').type('1')
    cy.contains('button', "Charger l'étudiant").click()
    cy.wait('@getById')

    cy.get('input[formcontrolname="firstName"]').should('have.value', 'Ada')
    cy.get('input[formcontrolname="lastName"]').clear().type('Byron')
    cy.contains('button', 'Enregistrer').click()
    cy.wait('@update')

    cy.contains('Étudiant modifié avec succès.')
  })

  it('shows "Étudiant introuvable" when loading an unknown id', () => {
    cy.intercept('GET', '/api/etudiants/999', { statusCode: 404 }).as('getById')

    cy.get('input[formcontrolname="id"]').type('999')
    cy.contains('button', "Charger l'étudiant").click()
    cy.wait('@getById')

    cy.contains('Étudiant introuvable.')
  })
})
