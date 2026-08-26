describe('Etudiant menu', () => {
  beforeEach(() => {
    cy.visitAuthenticated('/etudiants')
  })

  it('lists all the CRUD actions and the logout button', () => {
    cy.contains('Gestion des étudiants')
    cy.contains('a', 'Liste des étudiants')
    cy.contains('a', "Détails d'un étudiant")
    cy.contains('a', 'Créer un étudiant')
    cy.contains('a', 'Modifier un étudiant')
    cy.contains('a', 'Supprimer un étudiant')
    cy.contains('button', 'Déconnexion')
  })

  it('navigates to the student list when its link is clicked', () => {
    cy.intercept('GET', '/api/etudiants', []).as('getAll')

    cy.contains('a', 'Liste des étudiants').click()

    cy.url().should('include', '/etudiants/liste')
    cy.wait('@getAll')
  })
})
