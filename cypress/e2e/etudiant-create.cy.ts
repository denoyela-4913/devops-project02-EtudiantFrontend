describe('Etudiant create', () => {
  beforeEach(() => {
    cy.visitAuthenticated('/etudiants/creer')
  })

  it('creates a student and shows a success message', () => {
    cy.intercept('POST', '/api/etudiants', {
      statusCode: 201,
      body: { id: 3, firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.com' }
    }).as('create')

    cy.get('input[formcontrolname="firstName"]').type('Grace')
    cy.get('input[formcontrolname="lastName"]').type('Hopper')
    cy.get('input[formcontrolname="email"]').type('grace@example.com')
    cy.get('button[type="submit"]').click()
    cy.wait('@create')

    cy.contains('Étudiant créé avec succès.')
  })

  it('shows validation errors and does not call the API when the form is empty', () => {
    cy.intercept('POST', '/api/etudiants').as('create')

    cy.get('button[type="submit"]').click()

    cy.contains('Le prénom est requis')
    cy.contains('Le nom est requis')
    cy.contains("L'email est requis")
    cy.get('@create.all').should('have.length', 0)
  })
})
