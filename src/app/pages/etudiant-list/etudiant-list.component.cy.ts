import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { EtudiantListComponent } from './etudiant-list.component'

// Exemple de référence pour le Component Testing Cypress : le composant est rendu
// pour de vrai dans un navigateur, isolé de l'application (pas de route active), avec
// l'API HTTP simulée via `cy.intercept`. Les autres écrans etudiant-* ne sont PAS
// dupliqués ici : leur logique est couverte par les specs Jest (`*.spec.ts`) et leur
// parcours complet par `cypress/e2e/etudiant-*.cy.ts`.
describe('EtudiantListComponent', () => {
  const mount = () =>
    cy.mount(EtudiantListComponent, { providers: [provideHttpClient(), provideRouter([])] })

  it('affiche dans le tableau les étudiants renvoyés par l\'API', () => {
    cy.intercept('GET', '/api/etudiants', [
      { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
      { id: 2, firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com' }
    ]).as('getAll')

    mount()
    cy.wait('@getAll')

    cy.get('table tbody tr').should('have.length', 2)
    cy.contains('td', 'Ada')
    cy.contains('td', 'alan@example.com')
  })

  it('affiche le message d\'erreur quand l\'appel API échoue', () => {
    cy.intercept('GET', '/api/etudiants', { statusCode: 500 }).as('getAll')

    mount()
    cy.wait('@getAll')

    cy.contains('Impossible de charger la liste des étudiants.')
  })
})
