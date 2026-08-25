import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { EtudiantCreateComponent } from './etudiant-create.component'

describe('EtudiantCreateComponent', () => {
  it('should mount', () => {
    cy.mount(EtudiantCreateComponent, { providers: [provideHttpClient(), provideRouter([])] })
  })
})