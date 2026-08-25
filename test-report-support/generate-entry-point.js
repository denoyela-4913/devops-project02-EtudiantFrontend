'use strict';

/**
 * Génère RAPPORTS-TESTS.html à la racine du dépôt (pas dans test-report/ ou coverage/, qui
 * n'existent qu'après une exécution des tests) : point d'entrée stable, à ouvrir directement
 * depuis le dépôt, qui pointe en relatif vers les rapports Jest/Cypress/couverture.
 *
 * Appelé automatiquement à la fin de chaque run Jest (onRunComplete) et Cypress (after:run),
 * donc régénéré avec les chiffres réels dès qu'une des deux suites tourne. Basé sur le même
 * gabarit visuel que le point d'entrée du backend (voir RAPPORTS-TESTS.html du dépôt backend).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const UNIT_CSV = path.join(ROOT, 'test-report', 'results-unit.csv');
const CYPRESS_CSV = path.join(ROOT, 'test-report', 'results-cypress.csv');
const COVERAGE_SUMMARY = path.join(ROOT, 'coverage', 'coverage-summary.json');
const OUTPUT_HTML = path.join(ROOT, 'RAPPORTS-TESTS.html');

function timeNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function readCsvSummary(file) {
  if (!fs.existsSync(file)) {
    return null;
  }
  try {
    const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
    let total = 0;
    let ok = 0;
    const byCategory = new Map();
    const files = new Set();
    for (const line of lines) {
      const parts = line.split('|');
      if (parts.length !== 6) {
        continue;
      }
      const [fichier, categorie, , statut] = parts;
      total += 1;
      if (statut === 'OK') {
        ok += 1;
      }
      byCategory.set(categorie, (byCategory.get(categorie) || 0) + 1);
      files.add(fichier);
    }
    return { total, ok, byCategory, fileCount: files.size };
  } catch (e) {
    return null;
  }
}

function categoryLabel(byCategory) {
  return [...byCategory.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([categorie, count]) => `${count} ${categorie.toLowerCase()}`)
    .join(' · ');
}

function readOverallCoveragePct() {
  if (!fs.existsSync(COVERAGE_SUMMARY)) {
    return null;
  }
  try {
    const summary = JSON.parse(fs.readFileSync(COVERAGE_SUMMARY, 'utf8'));
    return summary.total && summary.total.lines ? summary.total.lines.pct : null;
  } catch (e) {
    return null;
  }
}

function pctFr(value) {
  return value.toFixed(1).replace('.', ',');
}

function card(href, title, description, stat, statIsLink) {
  const statMarkup = statIsLink
    ? `<span class="card-arrow">${stat}</span>`
    : `<span class="card-stat">${stat}</span>`;
  return `    <a class="card" href="${href}">
      <div class="card-text">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      ${statMarkup}
    </a>`;
}

function generateEntryPoint() {
  const unit = readCsvSummary(UNIT_CSV);
  const cypress = readCsvSummary(CYPRESS_CSV);
  const overallPct = readOverallCoveragePct();

  const fileCount = (unit ? unit.fileCount : 0) + (cypress ? cypress.fileCount : 0);

  const unitDesc = unit
    ? `Liste des tests exécutés, catégorie, statut et heure de passage. ${categoryLabel(unit.byCategory)}`
    : "Aucun run pour l'instant — lancez npm run test.";
  const unitStat = unit ? `${unit.ok} / ${unit.total} tests OK` : 'résultats indisponibles';

  const cypressDesc = cypress
    ? `Liste des tests exécutés, catégorie, statut et heure de passage. ${categoryLabel(cypress.byCategory)}`
    : "Aucun run pour l'instant — lancez npm run cypress:run.";
  const cypressStat = cypress ? `${cypress.ok} / ${cypress.total} tests OK` : 'résultats indisponibles';

  const coverageDesc = 'Couverture de code Jest (lignes), rapport HTML Istanbul natif, fichier par fichier.';
  const coverageStat = overallPct !== null ? `${pctFr(overallPct)}&nbsp;%` : 'indisponible';

  const cards = [
    card('test-report/rapport-tests-unit.html', 'Rapport de tests unitaires (Jest)', unitDesc, unitStat, false),
    card('test-report/rapport-tests-cypress.html', 'Rapport de tests Cypress (e2e + composants)', cypressDesc, cypressStat, false),
    card('coverage/index.html', 'Couverture de code (Jest)', coverageDesc, coverageStat, false),
  ].join('\n\n');

  const html = ENTRY_POINT_TEMPLATE
    .replace('{{GENERATED_AT}}', timeNow())
    .replace('{{FILE_COUNT}}', String(fileCount))
    .replace('{{CARDS}}', cards);

  fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
}

const ENTRY_POINT_TEMPLATE = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Rapports — etudiant-frontend</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    color-scheme: light;
    --page: #f3f4f8; --surface: #ffffff; --border: rgba(20,22,28,0.10);
    --text-1: #14161c; --text-2: #565a66; --text-3: #8a8e99;
    --accent-ink: #322a9e; --accent-soft: #e8e6fb;
    --font-display: "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-body: "Public Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-mono: "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
      --page: #0d0e12; --surface: #15161d; --border: rgba(255,255,255,0.10);
      --text-1: #f2f2f6; --text-2: #b7bac4; --text-3: #7d8090;
      --accent-ink: #c2c0f8; --accent-soft: rgba(143,139,242,0.16);
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --page: #0d0e12; --surface: #15161d; --border: rgba(255,255,255,0.10);
    --text-1: #f2f2f6; --text-2: #b7bac4; --text-3: #7d8090;
    --accent-ink: #c2c0f8; --accent-soft: rgba(143,139,242,0.16);
  }
  * { box-sizing: border-box; }
  body { background: var(--page); margin: 0; color: var(--text-1); font-family: var(--font-body); }
  .root { max-width: 760px; margin: 0 auto; padding: 56px 24px 72px; }
  .eyebrow { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase; color: var(--accent-ink); margin: 0 0 10px; }
  h1 { font-family: var(--font-display); font-size: clamp(26px, 4vw, 34px); font-weight: 800; letter-spacing: -0.01em; margin: 0; }
  .meta { margin-top: 12px; font-family: var(--font-mono); font-size: 13px; color: var(--text-3); }
  .cards { display: grid; gap: 14px; margin-top: 36px; }
  a.card { display: flex; align-items: center; justify-content: space-between; gap: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 22px; text-decoration: none; color: inherit; transition: border-color 0.12s ease, transform 0.12s ease; }
  a.card:hover { border-color: var(--accent-ink); transform: translateY(-1px); }
  a.card:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 2px; }
  .card-text h2 { font-family: var(--font-display); font-size: 17px; font-weight: 700; margin: 0 0 4px; }
  .card-text p { margin: 0; font-size: 13.5px; color: var(--text-2); line-height: 1.5; }
  .card-stat { font-family: var(--font-mono); font-weight: 600; font-size: 15px; color: var(--accent-ink); white-space: nowrap; background: var(--accent-soft); padding: 6px 12px; border-radius: 8px; }
  .card-arrow { color: var(--text-3); font-size: 18px; }
  footer { margin-top: 32px; font-size: 12.5px; color: var(--text-3); line-height: 1.6; }
  footer code { font-family: var(--font-mono); }
</style>
</head>
<body>
<div class="root">
  <p class="eyebrow">etudiant-frontend</p>
  <h1>Rapports de tests &amp; de couverture</h1>
  <p class="meta">Généré le {{GENERATED_AT}} · {{FILE_COUNT}} fichiers de test analysés</p>

  <div class="cards">
{{CARDS}}
  </div>

  <footer>
    Régénéré automatiquement à la racine du dépôt à chaque <code>npm run test</code> / <code>npm run cypress:run</code> — les liens ci-dessus pointent vers <code>test-report/</code> et <code>coverage/</code>, qui n'existent qu'après une exécution des tests correspondants.
  </footer>
</div>
</body>
</html>
`;

module.exports = { generateEntryPoint };

// Invoqué directement (ex: script npm "posttest") plutôt que require()-é comme module.
if (require.main === module) {
  generateEntryPoint();
}
