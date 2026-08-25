'use strict';

/**
 * Génère un rapport HTML consultable à tout moment (test-report/rapport-tests-unit.html)
 * listant tous les tests Jest exécutés, leur statut et leur heure de passage.
 *
 * Branché via `reporters` dans jest.config.js : aucune configuration supplémentaire
 * n'est nécessaire.
 *
 * Règle simple pour décider s'il faut repartir de zéro ou juste mettre à jour une ligne :
 * si le run couvre plusieurs fichiers de test (ex: `npm run test`, campagne complète),
 * le rapport est réinitialisé avant d'être rempli. S'il ne couvre qu'un seul fichier
 * (ex: `jest src/app/core/service/user.service.spec.ts`), les résultats précédents sont
 * conservés et seules les lignes des tests réellement exécutés sont mises à jour.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'test-report', 'results-unit.csv');
const HTML_FILE = path.join(__dirname, '..', 'test-report', 'rapport-tests-unit.html');

function timeNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function sanitize(value) {
  return (value || '').replace(/\|/g, '/').replace(/\r?\n/g, ' ');
}

function escapeHtml(value) {
  return (value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Une classe testée seule (dépendances absentes ou mockées) => Unitaire.
// Un composant orchestré avec de vrais collaborateurs (Router, AuthService) via TestBed => Intégration.
function categoryFor(fichier) {
  if (/\.interceptor\.spec\.ts$/.test(fichier)) {
    return 'Intégration';
  }
  if (/\/pages\/.*\.component\.spec\.ts$/.test(fichier)) {
    return 'Intégration';
  }
  return 'Unitaire';
}

// Mêmes classes CSS que le badge de catégorie du rapport backend (rapport-tests.html).
function categoryClass(categorie) {
  switch (categorie) {
    case 'Unitaire':
      return 'cat-unitaire';
    case 'Intégration':
      return 'cat-integration';
    case 'Fonctionnel':
      return 'cat-fonctionnel';
    case 'E2E':
      return 'cat-e2e';
    default:
      return 'cat-non-categorise';
  }
}

function categoryBreakdown(values) {
  const counts = new Map();
  for (const r of values) {
    counts.set(r.categorie, (counts.get(r.categorie) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([categorie, count]) => `${count} ${categorie.toLowerCase()}`)
    .join(' · ');
}

class TestReportReporter {
  constructor() {
    this.results = new Map();
  }

  loadExisting() {
    this.results.clear();
    if (!fs.existsSync(DATA_FILE)) {
      return;
    }
    try {
      const lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n').filter(Boolean);
      for (const line of lines) {
        const parts = line.split('|');
        if (parts.length !== 6) {
          continue;
        }
        const [fichier, categorie, test, statut, heure, detail] = parts;
        this.results.set(`${fichier}#${test}`, { fichier, categorie, test, statut, heure, detail });
      }
    } catch (e) {
      // Rapport illisible/corrompu : on repart d'un rapport vide plutôt que de faire échouer les tests.
    }
  }

  onRunStart(aggregatedResults) {
    this.loadExisting();
    const fullCampaign = aggregatedResults.numTotalTestSuites > 1;
    if (fullCampaign) {
      this.results.clear();
    }
  }

  onTestResult(_test, testResult) {
    const fichier = path.relative(process.cwd(), testResult.testFilePath).replace(/\\/g, '/');
    const categorie = categoryFor(fichier);
    for (const assertion of testResult.testResults) {
      const statut = assertion.status === 'passed' ? 'OK'
        : assertion.status === 'failed' ? 'ECHEC'
        : 'IGNORE';
      const detail = assertion.failureMessages && assertion.failureMessages.length
        ? assertion.failureMessages[0].split('\n')[0]
        : '';
      const key = `${fichier}#${assertion.fullName}`;
      this.results.set(key, {
        fichier,
        categorie,
        test: assertion.fullName,
        statut,
        heure: timeNow(),
        detail: sanitize(detail),
      });
    }
  }

  onRunComplete() {
    this.persist();
    this.writeHtml();
    // RAPPORTS-TESTS.html (généré par generate-entry-point.js) lit coverage/coverage-summary.json,
    // que Jest écrit APRÈS onRunComplete des reporters custom : le générer ici lirait une
    // couverture obsolète ou absente. Régénéré à la place par le script "posttest" (package.json),
    // qui s'exécute une fois que `jest` (et donc coverage-summary.json) est réellement terminé.
  }

  persist() {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const lines = [...this.results.values()].map((r) => [r.fichier, r.categorie, r.test, r.statut, r.heure, r.detail].join('|'));
    fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  }

  writeHtml() {
    const values = [...this.results.values()];
    const total = values.length;
    const ok = values.filter((r) => r.statut === 'OK').length;
    const echec = values.filter((r) => r.statut === 'ECHEC').length;
    const ignore = total - ok - echec;

    const rows = values.map((r) => {
      const cssClass = r.statut === 'OK' ? 'ok' : r.statut === 'ECHEC' ? 'echec' : 'ignore';
      const badge = `<span class="badge ${categoryClass(r.categorie)}">${escapeHtml(r.categorie)}</span>`;
      return `<tr class="${cssClass}"><td>${escapeHtml(r.fichier)}</td><td>${escapeHtml(r.test)}</td><td>${badge}</td><td>${r.statut}</td><td>${r.heure}</td><td>${escapeHtml(r.detail)}</td></tr>`;
    }).join('\n');

    const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Rapport de tests - etudiant-frontend (unitaires)</title>
<style>
  body { font-family: Arial, sans-serif; margin: 2rem; color: #222; }
  h1 { font-size: 1.4rem; }
  .summary { margin-bottom: 0.4rem; }
  .summary span { margin-right: 1.5rem; font-weight: bold; }
  .breakdown { margin-bottom: 1rem; color: #555; font-size: 0.9rem; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 0.9rem; }
  th { background: #333; color: white; }
  tr.ok { background: #e6f4ea; }
  tr.echec { background: #fbe4e4; }
  tr.ignore { background: #fff6da; }
  .ok-count { color: #1a7a34; }
  .echec-count { color: #b3261e; }
  .ignore-count { color: #9a7b00; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.78rem; font-weight: bold; color: white; }
  .cat-unitaire { background: #4338ca; }
  .cat-integration { background: #0f766e; }
  .cat-fonctionnel { background: #a16207; }
  .cat-e2e { background: #9d174d; }
  .cat-non-categorise { background: #6b7280; }
</style>
</head>
<body>
<h1>Rapport de tests - etudiant-frontend (unitaires Jest)</h1>
<p>Dernière mise à jour : ${timeNow()}</p>
<div class="summary">
  <span class="ok-count">OK : ${ok}</span>
  <span class="echec-count">Échecs : ${echec}</span>
  <span class="ignore-count">Ignorés : ${ignore}</span>
  <span>Total : ${total}</span>
</div>
<p class="breakdown">Par catégorie : ${categoryBreakdown(values)}</p>
<table>
<thead>
<tr><th>Fichier</th><th>Test</th><th>Catégorie</th><th>Statut</th><th>Heure</th><th>Détail</th></tr>
</thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>
`;

    fs.mkdirSync(path.dirname(HTML_FILE), { recursive: true });
    fs.writeFileSync(HTML_FILE, html, 'utf8');
  }
}

module.exports = TestReportReporter;
