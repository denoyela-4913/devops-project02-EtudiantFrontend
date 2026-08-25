import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { EtudiantListComponent } from './etudiant-list.component'

describe('EtudiantListComponent', () => {
  it('should mount', () => {
    cy.mount(EtudiantListComponent, { providers: [provideHttpClient(), provideRouter([])] })
  })
})