import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { EtudiantDetailComponent } from './etudiant-detail.component'

describe('EtudiantDetailComponent', () => {
  it('should mount', () => {
    cy.mount(EtudiantDetailComponent, { providers: [provideHttpClient(), provideRouter([])] })
  })
})