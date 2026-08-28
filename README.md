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
- [💬 Infobulles de statut (succès / erreur)](#-infobulles-de-statut-succès--erreur)
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
│   │   │   ├── material.module.ts    # Regroupement des modules Angular Material
│   │   │   └── utils/
│   │   │       └── http-status.util.ts  # Libellé humain d'un code HTTP (200 → "OK", 409 → "Conflict", ...)
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

## 💬 Infobulles de statut (succès / erreur)

Sur les formulaires **Créer**, **Modifier** et **Supprimer** un étudiant, le message de résultat (encadré vert = succès, encadré rouge = échec) affiche une **infobulle au survol de la souris**. Le but : rendre le résultat de l'action compréhensible même pour un lecteur qui ne connaît pas les codes HTTP — un `200` ou un `204` tout seul ne veut rien dire pour tout le monde.

L'infobulle affiche :
- **En cas de succès** : le code HTTP et son libellé standard (ex. `201 Created`). Quand le libellé seul ne suffit pas à comprendre qu'il s'agit d'une réussite (ex. `204 No Content` après une suppression), la mention `(OK)` est ajoutée à la fin.
- **En cas d'erreur** : le code HTTP et son libellé standard, puis sur la ligne suivante le message d'erreur exact renvoyé par le backend (ex. `Un étudiant avec l'email john.doe8@gmail.com existe déjà`).

| Code | Libellé HTTP | Ce que ça signifie concrètement | Où on peut le voir |
|---|---|---|---|
| `200 OK` | OK | La modification a bien été enregistrée. | Modifier (succès) |
| `201 Created` | Created | L'étudiant a bien été créé. | Créer (succès) |
| `204 No Content` | No Content (OK) | La suppression a réussi. Le serveur ne renvoie aucune donnée en retour, c'est normal pour une suppression. | Supprimer (succès) |
| `400 Bad Request` | Bad Request | Les données envoyées sont invalides ou incomplètes. | Créer, Modifier, Supprimer (erreur) |
| `401 Unauthorized` | Unauthorized | La session n'est plus valide, une reconnexion est nécessaire. | Créer, Modifier, Supprimer (erreur) |
| `403 Forbidden` | Forbidden | L'action n'est pas autorisée pour cet utilisateur. | Créer, Modifier, Supprimer (erreur) |
| `404 Not Found` | Not Found | L'étudiant demandé n'existe pas (identifiant inconnu ou déjà supprimé). | Modifier, Supprimer (erreur) |
| `409 Conflict` | Conflict | Un étudiant avec les mêmes informations (ex. email) existe déjà. | Créer, Modifier (erreur) |
| `500 Internal Server Error` | Internal Server Error | Une erreur imprévue est survenue côté serveur. | Créer, Modifier, Supprimer (erreur) |

Ce mapping code → libellé est calculé côté frontend dans [`shared/utils/http-status.util.ts`](src/app/shared/utils/http-status.util.ts), plutôt que de dépendre du `statusText` renvoyé par le navigateur (non garanti selon les environnements).

> **Détail** et **Liste** n'affichent pas cette infobulle : sur ces deux pages, le backend ne renvoie aucun message exploitable en cas d'erreur (corps de réponse vide sur 404/401/500), donc afficher uniquement un code sans explication n'apporterait pas d'information utile.

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
| [core/interceptors/auth.interceptor.spec.ts](src/app/core/interceptors/auth.interceptor.spec.ts) | Intégration | En-tête `Authorization` ajouté si token présent, absent sinon |
| [pages/login/login.component.spec.ts](src/app/pages/login/login.component.spec.ts) | Intégration | Formulaire invalide / succès (token stocké + navigation) / erreur / reset |
| [pages/register/register.component.spec.ts](src/app/pages/register/register.component.spec.ts) | Intégration | Formulaire invalide / appel `register` réussi / reset |
| [pages/etudiant-menu/etudiant-menu.component.spec.ts](src/app/pages/etudiant-menu/etudiant-menu.component.spec.ts) | Intégration | Actions exposées + déconnexion |
| [pages/etudiant-list/etudiant-list.component.spec.ts](src/app/pages/etudiant-list/etudiant-list.component.spec.ts) | Intégration | Chargement succès/erreur + déconnexion |
| [pages/etudiant-detail/etudiant-detail.component.spec.ts](src/app/pages/etudiant-detail/etudiant-detail.component.spec.ts) | Intégration | Recherche invalide/succès/erreur + déconnexion |
| [pages/etudiant-create/etudiant-create.component.spec.ts](src/app/pages/etudiant-create/etudiant-create.component.spec.ts) | Intégration | Création invalide/succès/erreur/reset + déconnexion |
| [pages/etudiant-update/etudiant-update.component.spec.ts](src/app/pages/etudiant-update/etudiant-update.component.spec.ts) | Intégration | Chargement + mise à jour invalide/succès/erreur + déconnexion |
| [pages/etudiant-delete/etudiant-delete.component.spec.ts](src/app/pages/etudiant-delete/etudiant-delete.component.spec.ts) | Intégration | Suppression invalide/succès/erreur + déconnexion |
| [app.routes.e2e-coverage.spec.ts](src/app/app.routes.e2e-coverage.spec.ts) | Architecture | Test-garde : chaque route rendant un composant est ciblée par ≥ 1 spec `cypress/e2e/`, et la suite e2e ne descend pas sous ses planchers (nombre de fichiers / de tests) |

> Couverture de code : ~96 % de lignes sur `src/app/**/*.ts` (hors modèles et fichiers de config `app.config.ts`/`app.routes.ts`, exclus de la mesure faute de logique à tester). Seuil bloquant : 80 % de lignes au niveau global (voir `jest.config.js`).

Chaque exécution (`npm run test`, `npm run test:watch`) génère/actualise un rapport HTML consultable à tout moment : **`test-report/rapport-tests-unit.html`**. Règle de mise à jour (même principe que le rapport de tests du backend) :
- run couvrant **plusieurs fichiers** `*.spec.ts` (campagne complète) → le rapport est **réinitialisé** puis reconstruit ;
- run ciblé sur **un seul fichier** → l'historique est conservé, seules les lignes des tests exécutés sont **mises à jour**.

Le rapport inclut une colonne **Catégorie**, déduite automatiquement du chemin du fichier de test (voir `categoryFor` dans [jest-report-reporter.js](test-report-support/jest-report-reporter.js)) :
- **Unitaire** : une seule classe testée (service, composant racine), dépendances absentes ou mockées (HTTP simulé via `HttpTestingController`).
- **Intégration** : composant Angular orchestré avec de vrais collaborateurs (Router, AuthService) via `TestBed`, ou intercepteur testé avec le vrai pipeline `HttpClient`.
- **Architecture** : test-garde qui ne vérifie pas le comportement de l'app mais l'intégrité d'une autre suite. Ici : [app.routes.e2e-coverage.spec.ts](src/app/app.routes.e2e-coverage.spec.ts) — voir la section Cypress ci-dessous.

### Tests end-to-end & composants (Cypress)

```bash
npm run cypress:open       # interface interactive
npm run cypress:run        # e2e headless (cypress/e2e/)
npm run cypress:component   # tests de composants headless (src/**/*.component.cy.ts)
```

- Les tests e2e se trouvent dans `cypress/e2e/` (baseUrl `http://localhost:4200`, nécessite `npm start`). Tous les appels `/api/*` sont simulés via `cy.intercept` ; les écrans protégés sont atteints avec un JWT posé en `sessionStorage` par `cy.visitAuthenticated` (voir [commands.ts](cypress/support/commands.ts) et [jwt.ts](cypress/support/jwt.ts)).
- Les tests de composants (`src/**/*.component.cy.ts`, deux exemples à côté des pages `etudiant-list` et `etudiant-menu`) montent le composant seul via le devServer Angular/Webpack de Cypress.
- **La CI exécute les deux** : step `E2E (Cypress)` puis step `Tests de composants (Cypress)` dans [ci.yml](.github/workflows/ci.yml).

| Fichier | Catégorie | Couvre |
|---|---|---|
| [cypress/e2e/navigation.cy.ts](cypress/e2e/navigation.cy.ts) | E2E | Redirections `/` → `/login`, URL inconnue → `/login` (wildcard), pages `/login` et `/register` publiques |
| [cypress/e2e/authentication.cy.ts](cypress/e2e/authentication.cy.ts) | E2E | Connexion OK (JWT stocké → zone protégée) · 401 identifiants · route protégée sans session · déconnexion · **JWT expiré → purge + `/login`** · **401 API → déconnexion auto** · **en-tête `Authorization: Bearer`** |
| [cypress/e2e/register.cy.ts](cypress/e2e/register.cy.ts) | E2E | Rendu du formulaire, inscription envoyée avec le bon payload + alerte succès, erreurs de validation sans appel API |
| [cypress/e2e/etudiant-menu.cy.ts](cypress/e2e/etudiant-menu.cy.ts) | E2E | Menu : liste des actions CRUD + déconnexion, navigation vers la liste |
| [cypress/e2e/etudiant-list.cy.ts](cypress/e2e/etudiant-list.cy.ts) | E2E | Liste : affichage des étudiants de l'API, message d'erreur si l'appel échoue |
| [cypress/e2e/etudiant-detail.cy.ts](cypress/e2e/etudiant-detail.cy.ts) | E2E | Détail : étudiant trouvé par id, « Étudiant introuvable » sur 404 |
| [cypress/e2e/etudiant-create.cy.ts](cypress/e2e/etudiant-create.cy.ts) | E2E | Création : succès + message, erreurs de validation sans appel API |
| [cypress/e2e/etudiant-update.cy.ts](cypress/e2e/etudiant-update.cy.ts) | E2E | Modification : chargement + édition + succès, « Étudiant introuvable » sur id inconnu |
| [cypress/e2e/etudiant-delete.cy.ts](cypress/e2e/etudiant-delete.cy.ts) | E2E | Suppression : succès + message, message d'erreur si l'appel échoue |
| [pages/etudiant-list/etudiant-list.component.cy.ts](src/app/pages/etudiant-list/etudiant-list.component.cy.ts) | Fonctionnel | Rendu du tableau depuis l'API simulée (`cy.intercept`) + état d'erreur — exemple de référence Component Testing |
| [pages/etudiant-menu/etudiant-menu.component.cy.ts](src/app/pages/etudiant-menu/etudiant-menu.component.cy.ts) | Fonctionnel | Rendu des entrées de menu + bouton déconnexion — exemple minimal de Component Testing (sans HTTP) |

> **Portée réelle des « e2e »** : navigateur réel + Angular complet (routing, garde, intercepteur, templates), mais **backend simulé** (`cy.intercept` sur tout `/api/*`). Ce sont des tests d'intégration frontend, pas des e2e contre une API vivante.
> Seuls **deux** tests de composants sont conservés, comme exemples de Cypress Component Testing.

#### Garde d'intégrité de la suite e2e

Le builder Angular utilisé (`@angular-devkit/build-angular:application`, esbuild) ne s'instrumente pas pour Istanbul sans surcoût disproportionné. **Les runs Cypress ne produisent donc aucune métrique de couverture et aucun seuil bloquant** — seul « le job CI est vert » garantit quelque chose. Pour éviter que la suite e2e se dégrade en silence (spec supprimée, tests vidés), un test Jest fait office de garde : [app.routes.e2e-coverage.spec.ts](src/app/app.routes.e2e-coverage.spec.ts) (catégorie **Architecture**). Il fait échouer `npm test` si :

1. une route de [app.routes.ts](src/app/app.routes.ts) qui rend un composant n'est plus référencée par aucun spec `cypress/e2e/*.cy.ts` (ajouter une route **force** à écrire son parcours e2e) ;
2. le nombre de fichiers de specs e2e, ou le nombre total de tests e2e, passe sous un plancher.

Les planchers (`MIN_SPEC_FILES`, `MIN_E2E_TESTS` dans le fichier) sont un **cliquet** : on les monte quand un ajout légitime les dépasse, on ne les baisse pas sans justification en revue. Ça ne remplace pas une vraie couverture ligne à ligne — ça empêche seulement la disparition silencieuse de pans entiers de la suite.

Chaque exécution (`cypress:run`, `cypress:component`, ou une spec depuis `cypress:open`) génère/actualise **`test-report/rapport-tests-cypress.html`**. Règle reset/update : sur une campagne multi-specs, seules les lignes des fichiers de **cette** campagne sont réinitialisées (un run e2e ne touche pas aux lignes des tests de composants et inversement) ; sur une spec isolée, seules ses lignes sont mises à jour.

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
