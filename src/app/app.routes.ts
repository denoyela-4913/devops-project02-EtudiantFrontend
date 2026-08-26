import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { EtudiantMenuComponent } from './pages/etudiant-menu/etudiant-menu.component';
import { EtudiantListComponent } from './pages/etudiant-list/etudiant-list.component';
import { EtudiantDetailComponent } from './pages/etudiant-detail/etudiant-detail.component';
import { EtudiantCreateComponent } from './pages/etudiant-create/etudiant-create.component';
import { EtudiantUpdateComponent } from './pages/etudiant-update/etudiant-update.component';
import { EtudiantDeleteComponent } from './pages/etudiant-delete/etudiant-delete.component';
import { authGuard } from './core/guards/auth.guard';

/**
 * Routes de l'application. Le sous-arbre `/etudiants/*` est protégé par `authGuard` posé sur la
 * route parente : toute tentative d'y accéder sans JWT valide redirige vers `/login`.
 *
 * La route wildcard (`**`) capture toute URL qui ne correspond à aucune route déclarée
 * ci-dessus (ex. `/etudiants/xxx`, `/etudiants/detail/6` — ce dernier n'a pas de segment `:id`).
 * Sans elle, Angular abandonne silencieusement la navigation faute de correspondance : le guard
 * n'est jamais évalué (il n'est atteint que si toute l'URL matche l'arbre `etudiants/*`), et la
 * vue précédente peut rester affichée. La wildcard doit rester le DERNIER élément du tableau :
 * les routes sont testées dans l'ordre et `**` matche tout.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'etudiants',
    canActivate: [authGuard],
    children: [
      { path: '', component: EtudiantMenuComponent },
      { path: 'liste', component: EtudiantListComponent },
      { path: 'detail', component: EtudiantDetailComponent },
      { path: 'creer', component: EtudiantCreateComponent },
      { path: 'modifier', component: EtudiantUpdateComponent },
      { path: 'supprimer', component: EtudiantDeleteComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
