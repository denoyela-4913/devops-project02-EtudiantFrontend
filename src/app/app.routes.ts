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
  }
];
