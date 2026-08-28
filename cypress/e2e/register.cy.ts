// Écran d'inscription. NB : le composant ne gère PAS l'échec (pas de callback `error`,
// pas de redirection — voir le TODO dans register.component.ts) ; seul le succès est couvert ici.
describe('Inscription', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('affiche le formulaire d\'inscription', () => {
    cy.contains('Registration Form')
    cy.get('input[formcontrolname="firstName"]').should('exist')
    cy.get('input[formcontrolname="lastName"]').should('exist')
    cy.get('input[formcontrolname="login"]').should('exist')
    cy.get('input[formcontrolname="password"]').should('exist')
  })

  it('envoie l\'inscription avec le contenu du formulaire et notifie le succès', () => {
    cy.intercept('POST', '/api/register', { statusCode: 201, body: {} }).as('register')
    cy.on('window:alert', cy.stub().as('alert'))

    cy.get('input[formcontrolname="firstName"]').type('Grace')
    cy.get('input[formcontrolname="lastName"]').type('Hopper')
    cy.get('input[formcontrolname="login"]').type('ghopper')
    cy.get('input[formcontrolname="password"]').type('secret')
    cy.contains('button', 'Register').click()

    cy.wait('@register').its('request.body').should('deep.equal', {
      firstName: 'Grace', lastName: 'Hopper', login: 'ghopper', password: 'secret'
    })
    cy.get('@alert').should('have.been.calledWith', 'SUCCESS!! :-)')
  })

  it('affiche les erreurs de validation et n\'appelle pas l\'API si le formulaire est vide', () => {
    cy.intercept('POST', '/api/register').as('register')

    cy.contains('button', 'Register').click()

    cy.contains('First Name is required')
    cy.contains('Last Name is required')
    cy.contains('Login is required')
    cy.contains('password is required')
    cy.get('@register.all').should('have.length', 0)
  })
})
