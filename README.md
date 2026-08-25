# EtudiantFrontend

<p align="center">
    <img src="https://img.shields.io/badge/Angular-19.2-red">
    <img src="https://img.shields.io/badge/Angular--Material-19.2-red">
    <img src="https://img.shields.io/badge/RxJS-7.8-blueviolet">
    <img src="https://img.shields.io/badge/Jest-29.7-brightgreen">
    <img src="https://img.shields.io/badge/Cypress-15.21-brightgreen">
    <img src="https://img.shields.io/badge/license-Unspecified-lightgrey">
</p>

Application front-end **Angular** de gestion des étudiants (authentification et CRUD étudiants), consommant une API REST backend.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

---

## 📋 Sommaire

- [📐 Architecture générale](#-architecture-générale)
- [⚙️ Stack technique](#️-stack-technique)
- [🖥️ Pages & fonctionnalités](#️-pages--fonctionnalités)
- [🔌 Consommation de l'API backend](#-consommation-de-lapi-backend)
- [🔐 Authentification](#-authentification)
- [🚀 Installation & lancement](#-installation--lancement)
- [🧪 Tests](#-tests)
- [📖 Documentation du code](#-documentation-du-code)
- [📦 Tableau des dépendances importantes](#-tableau-des-dépendances-importantes)
- [🛠️ Code scaffolding](#-code-scaffolding)
- [📚 Ressources complémentaires](#-ressources-complémentaires)

---

## 📐 Architecture générale

```
EtudiantFrontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/       # Interfaces TS (Etudiant, Login, Register, LoginResponse)
│   │   │   └── service/      # Services Angular (AuthService, UserService, EtudiantService, ...)
│   │   ├── pages/
│   │   │   ├── login/                # Connexion
│   │   │   ├── register/             # Inscription
│   │   │   ├── etudiant-menu/        # Menu de navigation étudiants
│   │   │   ├── etudiant-list/        # Liste des étudiants
│   │   │   ├── etudiant-detail/      # Détail d'un étudiant
│   │   │   ├── etudiant-create/      # Création d'un étudiant
│   │   │   ├── etudiant-update/      # Modification d'un étudiant
│   │   │   └── etudiant-delete/      # Suppression d'un étudiant
│   │   ├── shared/
│   │   │   └── material.module.ts    # Regroupement des modules Angular Material
│   │   ├── app.routes.ts             # Table de routage
│   │   └── app.config.ts             # Configuration de l'application (providers)
│   └── ...
├── cypress/
│   └── e2e/                          # Tests end-to-end Cypress
├── proxy.conf.json                   # Proxy /api vers le backend (dev)
└── package.json
```

---

## ⚙️ Stack technique

| Couche | Technologie |
|---|---|
| Framework | Angular 19 (standalone components) |
| UI | Angular Material 19 + Angular CDK |
| Réactivité | RxJS 7.8 |
| Tests unitaires | Jest 29 (`jest-preset-angular`) |
| Tests e2e / composants | Cypress 15 |
| Documentation | Compodoc |

---

## 🖥️ Pages & fonctionnalités

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Connexion utilisateur |
| Register | `/register` | Création de compte |
| Menu étudiants | `/etudiants` | Point d'entrée de la gestion des étudiants |
| Liste étudiants | `/etudiants/liste` | Affiche tous les étudiants |
| Détail étudiant | `/etudiants/detail` | Affiche un étudiant |
| Créer étudiant | `/etudiants/creer` | Formulaire de création |
| Modifier étudiant | `/etudiants/modifier` | Formulaire de modification |
| Supprimer étudiant | `/etudiants/supprimer` | Suppression d'un étudiant |

---

## 🔌 Consommation de l'API backend

En développement, les appels `/api/*` sont redirigés vers le backend via `proxy.conf.json` (`ng serve --proxy-config proxy.conf.json`, cible par défaut `http://localhost:8080`).

| Méthode | Route | Service | Description |
|---|---|---|---|
| `POST` | `/api/login` | `UserService.login` | Authentifie l'utilisateur, retourne un token |
| `POST` | `/api/register` | `UserService.register` | Crée un nouvel utilisateur |
| `GET` | `/api/etudiants` | `EtudiantService.getAll` | Liste tous les étudiants |
| `GET` | `/api/etudiants/:id` | `EtudiantService.getById` | Récupère un étudiant par ID |
| `POST` | `/api/etudiants` | `EtudiantService.create` | Crée un étudiant |
| `PUT` | `/api/etudiants/:id` | `EtudiantService.update` | Modifie un étudiant |
| `DELETE` | `/api/etudiants/:id` | `EtudiantService.delete` | Supprime un étudiant |

---

## 🔐 Authentification

- Le token retourné par `/api/login` est conservé côté client dans le `sessionStorage` (`AuthService`, clé `authToken`).
- `AuthService.isLoggedIn()` permet de vérifier la présence du token pour protéger les routes.
- Un intercepteur HTTP fonctionnel (`authInterceptor`, `core/interceptors/auth.interceptor.ts`) rattache automatiquement le token en en-tête `Authorization: Bearer <token>` sur chaque requête sortante, tant qu'un token est présent en session.

---

## 🚀 Installation & lancement

### Prérequis
- Node.js (compatible Angular CLI 19)
- Un backend exposant les routes `/api/*` décrites ci-dessus (par défaut attendu sur `http://localhost:8080`)

### Développement

```bash
npm install
npm start
```

Ouvrez ensuite `http://localhost:4200/`. L'application se recharge automatiquement à chaque modification des sources, et les appels `/api` sont proxyfiés vers le backend.

### Production

```bash
npm run build
```

Les artefacts compilés sont générés dans `dist/`.

---

## 🧪 Tests

Point d'entrée unique vers tous les rapports générés localement : [RAPPORTS-TESTS.html](RAPPORTS-TESTS.html) (même principe et même gabarit visuel que le point d'entrée du backend). Régénéré automatiquement avec les chiffres réels du dernier run — `npm run test` (via le script `posttest`, une fois `coverage/coverage-summary.json` réellement écrit) et `npm run cypress:run` / une spec lancée depuis `npm run cypress:open` (via `after:run` dans [cypress-report.ts](test-report-support/cypress-report.ts)) — voir [generate-entry-point.js](test-report-support/generate-entry-point.js).

### Tests unitaires (Jest)

```bash
npm run test          # exécution unique
npm run test:watch    # mode watch
```

| Fichier | Catégorie | Couvre |
|---|---|---|
| [app.component.spec.ts](src/app/app.component.spec.ts) | Unitaire | Création du composant racine et valeur du titre de l'application |
| [core/service/auth.service.spec.ts](src/app/core/service/auth.service.spec.ts) | Unitaire | `setToken`/`getToken`/`isLoggedIn`/`logout` (sessionStorage) |
| [core/service/etudiant.service.spec.ts](src/app/core/service/etudiant.service.spec.ts) | Unitaire | `getAll`/`getById`/`create`/`update`/`delete` via `HttpTestingController` |
| [core/service/user.service.spec.ts](src/app/core/service/user.service.spec.ts) | Unitaire | `register`/`login` via `HttpTestingController` |
| [core/service/user-mock.service.spec.ts](src/app/core/service/user-mock.service.spec.ts) | Unitaire | `register`/`login` renvoient bien un `Observable` |
| [core/interceptors/auth.interceptor.spec.ts](src/app/core/interceptors/auth.interceptor.spec.ts) | Intégration | En-tête `Authorization` ajouté si token présent, absent sinon |
| [pages/login/login.component.spec.ts](src/app/pages/login/login.component.spec.ts) | Intégration | Formulaire invalide / succès (token stocké + navigation) / erreur / reset |
| [pages/register/register.component.spec.ts](src/app/pages/register/register.component.spec.ts) | Intégration | Formulaire invalide / appel `register` réussi / reset |
| [pages/etudiant-menu/etudiant-menu.component.spec.ts](src/app/pages/etudiant-menu/etudiant-menu.component.spec.ts) | Intégration | Actions exposées + déconnexion |
| [pages/etudiant-list/etudiant-list.component.spec.ts](src/app/pages/etudiant-list/etudiant-list.component.spec.ts) | Intégration | Chargement succès/erreur + déconnexion |
| [pages/etudiant-detail/etudiant-detail.component.spec.ts](src/app/pages/etudiant-detail/etudiant-detail.component.spec.ts) | Intégration | Recherche invalide/succès/erreur + déconnexion |
| [pages/etudiant-create/etudiant-create.component.spec.ts](src/app/pages/etudiant-create/etudiant-create.component.spec.ts) | Intégration | Création invalide/succès/erreur/reset + déconnexion |
| [pages/etudiant-update/etudiant-update.component.spec.ts](src/app/pages/etudiant-update/etudiant-update.component.spec.ts) | Intégration | Chargement + mise à jour invalide/succès/erreur + déconnexion |
| [pages/etudiant-delete/etudiant-delete.component.spec.ts](src/app/pages/etudiant-delete/etudiant-delete.component.spec.ts) | Intégration | Suppression invalide/succès/erreur + déconnexion |

> Couverture de code : 100 % (statements/branches/fonctions/lignes) sur `src/app/**/*.ts` (hors modèles et fichiers de config `app.config.ts`/`app.routes.ts`, exclus de la mesure faute de logique à tester).

Chaque exécution (`npm run test`, `npm run test:watch`) génère/actualise un rapport HTML consultable à tout moment : **`test-report/rapport-tests-unit.html`**. Règle de mise à jour (même principe que le rapport de tests du backend) :
- run couvrant **plusieurs fichiers** `*.spec.ts` (campagne complète) → le rapport est **réinitialisé** puis reconstruit ;
- run ciblé sur **un seul fichier** → l'historique est conservé, seules les lignes des tests exécutés sont **mises à jour**.

Le rapport inclut une colonne **Catégorie**, déduite automatiquement du chemin du fichier de test (voir `categoryFor` dans [jest-report-reporter.js](test-report-support/jest-report-reporter.js)) :
- **Unitaire** : une seule classe testée (service, composant racine), dépendances absentes ou mockées (HTTP simulé via `HttpTestingController`).
- **Intégration** : composant Angular orchestré avec de vrais collaborateurs (Router, AuthService) via `TestBed`, ou intercepteur testé avec le vrai pipeline `HttpClient`.

### Tests end-to-end & composants (Cypress)

```bash
npm run cypress:open  # interface interactive
npm run cypress:run   # exécution headless (CI)
```

- Les tests e2e se trouvent dans `cypress/e2e/` (baseUrl `http://localhost:4200`).
- Les tests de composants (`*.cy.ts` à côté de chaque page) utilisent le devServer Angular/Webpack.

| Fichier | Catégorie | Couvre |
|---|---|---|
| [cypress/e2e/nrg_e2e.cy.ts](cypress/e2e/nrg_e2e.cy.ts) | E2E | Gabarit généré par défaut : visite `/login` (aucun scénario métier encore écrit) |
| [pages/etudiant-menu/etudiant-menu.component.cy.ts](src/app/pages/etudiant-menu/etudiant-menu.component.cy.ts) | Fonctionnel | `EtudiantMenuComponent` se monte sans erreur |
| [pages/etudiant-list/etudiant-list.component.cy.ts](src/app/pages/etudiant-list/etudiant-list.component.cy.ts) | Fonctionnel | `EtudiantListComponent` se monte sans erreur |
| [pages/etudiant-detail/etudiant-detail.component.cy.ts](src/app/pages/etudiant-detail/etudiant-detail.component.cy.ts) | Fonctionnel | `EtudiantDetailComponent` se monte sans erreur |
| [pages/etudiant-create/etudiant-create.component.cy.ts](src/app/pages/etudiant-create/etudiant-create.component.cy.ts) | Fonctionnel | `EtudiantCreateComponent` se monte sans erreur |
| [pages/etudiant-update/etudiant-update.component.cy.ts](src/app/pages/etudiant-update/etudiant-update.component.cy.ts) | Fonctionnel | `EtudiantUpdateComponent` se monte sans erreur |
| [pages/etudiant-delete/etudiant-delete.component.cy.ts](src/app/pages/etudiant-delete/etudiant-delete.component.cy.ts) | Fonctionnel | `EtudiantDeleteComponent` se monte sans erreur |

> Les tests de composants restent des smoke tests (« le composant se monte »), pas encore des scénarios utilisateur complets. Le test e2e est un gabarit sans assertion métier.

Chaque exécution (`npm run cypress:run`, ou une spec lancée depuis `npm run cypress:open`) génère/actualise **`test-report/rapport-tests-cypress.html`**, avec la même règle reset/update que le rapport Jest : plusieurs specs prévues → réinitialisation ; une seule spec (ou un test filtré via `.only`) → seules ses lignes sont mises à jour.

Ce rapport inclut aussi une colonne **Catégorie** (voir `categoryFor` dans [cypress-report.ts](test-report-support/cypress-report.ts)) :
- **Fonctionnel** : rendu réel du composant dans un navigateur (Cypress Component Testing).
- **E2E** : navigation dans un vrai navigateur contre l'application démarrée (`cypress/e2e/`).

---

## 📖 Documentation du code

La documentation technique du code est générée avec [Compodoc](https://compodoc.app/) :

```bash
npm run compodoc              # génère la documentation statique
npm run compodoc:serve        # génère et sert la documentation
npm run compodoc:serve:watch  # génère, sert et régénère à chaque changement
```

---

## 📦 Tableau des dépendances importantes

| Package | Version | Rôle |
|---|---|---|
| `@angular/core` | ^19.2.0 | Framework Angular |
| `@angular/router` | ^19.2.0 | Routage SPA |
| `@angular/forms` | ^19.2.0 | Formulaires réactifs/template-driven |
| `@angular/material` | ^19.2.19 | Composants UI Material Design |
| `@angular/cdk` | ^19.2.19 | Primitives UI (Component Dev Kit) |
| `rxjs` | ~7.8.0 | Programmation réactive |
| `jest` | ^29.7.0 | Test runner unitaire (dev) |
| `jest-preset-angular` | ^14.5.1 | Intégration Jest / Angular (dev) |
| `cypress` | 15.21.0 | Tests e2e et composants (dev) |
| `@cypress/schematic` | ^4.3.0 | Intégration Cypress / Angular CLI (dev) |
| `@compodoc/compodoc` | — | Génération de documentation (dev, via npx) |

---

## 🛠️ Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

---

## 📚 Ressources complémentaires

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
