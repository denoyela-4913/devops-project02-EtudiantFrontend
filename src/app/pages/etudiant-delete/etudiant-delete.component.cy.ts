import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { EtudiantDeleteComponent } from './etudiant-delete.component'

describe('EtudiantDeleteComponent', () => {
  it('should mount', () => {
    cy.mount(EtudiantDeleteComponent, { providers: [provideHttpClient(), provideRouter([])] })
  })
})