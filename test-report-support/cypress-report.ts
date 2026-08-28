/**
 * Génère un rapport HTML consultable à tout moment (test-report/rapport-tests-cypress.html)
 * listant tous les tests Cypress (e2e + composants) exécutés, leur statut et leur heure de passage.
 *
 * Branché depuis `setupNodeEvents` des blocs `e2e` et `component` de cypress.config.ts.
 *
 * Règle simple pour décider s'il faut repartir de zéro ou juste mettre à jour une ligne :
 * si le run couvre plusieurs fichiers de spec (ex: `cypress run`, campagne complète),
 * le rapport est réinitialisé avant d'être rempli. S'il ne couvre qu'un seul fichier
 * (ex: exécution ciblée d'une spec, ou test filtré via `.only`), les résultats précédents
 * sont conservés et seules les lignes des tests réellement exécutés sont mises à jour.
 */

import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateEntryPoint } = require('./generate-entry-point');

const DATA_FILE = path.join(__dirname, '..', 'test-report', 'results-cypress.csv');
const HTML_FILE = path.join(__dirname, '..', 'test-report', 'rapport-tests-cypress.html');

interface TestRow {
  fichier: string;
  categorie: string;
  test: string;
  statut: string;
  heure: string;
  detail: string;
}

// Rendu réel du composant dans un navigateur (Cypress Component Testing) => Fonctionnel.
// Navigation dans un vrai navigateur contre l'app démarrée => E2E.
function categoryFor(fichier: string): string {
  if (/^cypress\/e2e\//.test(fichier)) {
    return 'E2E';
  }
  return 'Fonctionnel';
}

// Mêmes classes CSS que le badge de catégorie du rapport backend (rapport-tests.html).
function categoryClass(categorie: string): string {
  switch (categorie) {
    case 'Unitaire':
      return 'cat-unitaire';
    case 'Intégration':
      return 'cat-integration';
    case 'Architecture':
      return 'cat-architecture';
    case 'Fonctionnel':
      return 'cat-fonctionnel';
    case 'E2E':
      return 'cat-e2e';
    default:
      return 'cat-non-categorise';
  }
}

function categoryBreakdown(values: TestRow[]): string {
  const counts = new Map<string, number>();
  for (const r of values) {
    counts.set(r.categorie, (counts.get(r.categorie) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([categorie, count]) => `${count} ${categorie.toLowerCase()}`)
    .join(' · ');
}

function timeNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function sanitize(value: string | undefined): string {
  return (value || '').replace(/\|/g, '/').replace(/\r?\n/g, ' ');
}

function escapeHtml(value: string | undefined): string {
  return (value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function loadExisting(): Map<string, TestRow> {
  const results = new Map<string, TestRow>();
  if (!fs.existsSync(DATA_FILE)) {
    return results;
  }
  try {
    const lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
      const parts = line.split('|');
      if (parts.length !== 6) {
        continue;
      }
      const [fichier, categorie, test, statut, heure, detail] = parts;
      results.set(`${fichier}#${test}`, { fichier, categorie, test, statut, heure, detail });
    }
  } catch (e) {
    // Rapport illisible/corrompu : on repart d'un rapport vide plutôt que de faire échouer les tests.
  }
  return results;
}

function persist(results: Map<string, TestRow>): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const lines = [...results.values()].map((r) => [r.fichier, r.categorie, r.test, r.statut, r.heure, r.detail].join('|'));
  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
}

function writeHtml(results: Map<string, TestRow>): void {
  const values = [...results.values()];
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
<title>Rapport de tests - etudiant-frontend (Cypress)</title>
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
  .cat-architecture { background: #15803d; }
  .cat-fonctionnel { background: #a16207; }
  .cat-e2e { background: #9d174d; }
  .cat-non-categorise { background: #6b7280; }
</style>
</head>
<body>
<h1>Rapport de tests - etudiant-frontend (Cypress e2e + composants)</h1>
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

export function registerTestReport(on: Cypress.PluginEvents): void {
  let results = loadExisting();

  on('before:run', (details: any) => {
    results = loadExisting();
    const specs: string[] = (details.specs || []).map((s: any) =>
      path.relative(process.cwd(), s.relative || s.absolute).replace(/\\/g, '/')
    );
    // Campagne = plusieurs specs : on repart de zéro pour CES fichiers uniquement. Ainsi un
    // run e2e (`cypress run`) n'efface pas les lignes des tests de composants (`cypress run
    // --component`, exécuté dans un step CI séparé) et inversement.
    if (specs.length > 1) {
      for (const [key, row] of [...results.entries()]) {
        if (specs.includes(row.fichier)) {
          results.delete(key);
        }
      }
    }
  });

  on('after:spec', (spec: Cypress.Spec, specResults: any) => {
    const fichier = path.relative(process.cwd(), spec.relative || spec.absolute).replace(/\\/g, '/');
    const categorie = categoryFor(fichier);
    const tests = (specResults && specResults.tests) || [];
    for (const test of tests) {
      const fullName = (test.title || []).join(' > ');
      const statut = test.state === 'passed' ? 'OK' : test.state === 'failed' ? 'ECHEC' : 'IGNORE';
      const detail = test.displayError ? String(test.displayError).split('\n')[0] : '';
      results.set(`${fichier}#${fullName}`, {
        fichier,
        categorie,
        test: fullName,
        statut,
        heure: timeNow(),
        detail: sanitize(detail),
      });
    }
  });

  on('after:run', () => {
    persist(results);
    writeHtml(results);
    generateEntryPoint();
  });
}
