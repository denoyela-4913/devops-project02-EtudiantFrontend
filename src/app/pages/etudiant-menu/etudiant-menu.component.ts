import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-etudiant-menu',
  imports: [RouterLink],
  templateUrl: './etudiant-menu.component.html',
  styleUrl: './etudiant-menu.component.css'
})
export class EtudiantMenuComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  actions = [
    { label: 'Liste des étudiants', path: '/etudiants/liste' },
    { label: 'Détails d\'un étudiant', path: '/etudiants/detail' },
    { label: 'Créer un étudiant', path: '/etudiants/creer' },
    { label: 'Modifier un étudiant', path: '/etudiants/modifier' },
    { label: 'Supprimer un étudiant', path: '/etudiants/supprimer' }
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
