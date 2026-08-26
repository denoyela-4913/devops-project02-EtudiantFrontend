describe('Etudiant delete', () => {
  beforeEach(() => {
    cy.visitAuthenticated('/etudiants/supprimer')
  })

  it('deletes a student and shows a success message', () => {
    cy.intercept('DELETE', '/api/etudiants/1', { statusCode: 204 }).as('delete')

    cy.get('input[formcontrolname="id"]').type('1')
    cy.get('button[type="submit"]').click()
    cy.wait('@delete')

    cy.contains('Étudiant supprimé avec succès.')
  })

  it('shows an error message when the deletion fails', () => {
    cy.intercept('DELETE', '/api/etudiants/999', { statusCode: 404 }).as('delete')

    cy.get('input[formcontrolname="id"]').type('999')
    cy.get('button[type="submit"]').click()
    cy.wait('@delete')

    cy.contains('La suppression a échoué.')
  })
})
