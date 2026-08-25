import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { EtudiantUpdateComponent } from './etudiant-update.component'

describe('EtudiantUpdateComponent', () => {
  it('should mount', () => {
    cy.mount(EtudiantUpdateComponent, { providers: [provideHttpClient(), provideRouter([])] })
  })
})