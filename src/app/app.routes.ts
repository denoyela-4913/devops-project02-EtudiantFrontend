import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { EtudiantMenuComponent } from './pages/etudiant-menu/etudiant-menu.component';
import { EtudiantListComponent } from './pages/etudiant-list/etudiant-list.component';
import { EtudiantDetailComponent } from './pages/etudiant-detail/etudiant-detail.component';
import { EtudiantCreateComponent } from './pages/etudiant-create/etudiant-create.component';
import { EtudiantUpdateComponent } from './pages/etudiant-update/etudiant-update.component';
import { EtudiantDeleteComponent } from './pages/etudiant-delete/etudiant-delete.component';

/**
 * Routes de l'application. Aucune n'est protégée par un guard : l'accès aux pages `/etudiants/*`
 * sans être connecté est possible côté navigation, seules les requêtes HTTP échoueront (401)
 * faute de JWT valide.
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
    component: EtudiantMenuComponent
  },
  {
    path: 'etudiants/liste',
    component: EtudiantListComponent
  },
  {
    path: 'etudiants/detail',
    component: EtudiantDetailComponent
  },
  {
    path: 'etudiants/creer',
    component: EtudiantCreateComponent
  },
  {
    path: 'etudiants/modifier',
    component: EtudiantUpdateComponent
  },
  {
    path: 'etudiants/supprimer',
    component: EtudiantDeleteComponent
  }
];
