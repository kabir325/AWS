/* Validates the site data and generates Markdown documentation into ../docs.
 * Usage: node tools/build-docs.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'site', 'data');
const outDir = path.join(root, 'docs');

const files = ['_init.js', 'foundations.js', 'compute.js', 'storage.js', 'database.js', 'networking.js',
  'security.js', 'integration.js', 'management.js', 'analytics.js', 'migration.js', 'extras.js'];

const sandbox = { window: {} };
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(dataDir, f), 'utf8'), sandbox, { filename: f });
const A = sandbox.AWS;

/* ---------- Validation ---------- */
const errors = [];
const ids = new Set();
const checkQ = (q, where) => {
  const ans = Array.isArray(q.a) ? q.a : [q.a];
  if (!q.q || !Array.isArray(q.o) || q.o.length < 3) errors.push(`${where}: malformed question`);
  if (ans.some(a => typeof a !== 'number' || a < 0 || a >= q.o.length)) errors.push(`${where}: answer index out of range`);
  if (ans.length > 1 && !/Choose (TWO|THREE)/.test(q.q)) errors.push(`${where}: multi-answer question should say "Choose TWO/THREE"`);
  if (ans.length === 1 && /Choose (TWO|THREE)/.test(q.q)) errors.push(`${where}: says Choose but has one answer`);
  if (![1, 2, 3, 4].includes(q.d)) errors.push(`${where}: missing domain`);
  if (!q.e) errors.push(`${where}: missing explanation`);
};
A.services.forEach(s => {
  if (ids.has(s.id)) errors.push(`duplicate id ${s.id}`);
  ids.add(s.id);
  if (!A.categories.some(c => c.id === s.cat)) errors.push(`${s.id}: unknown category ${s.cat}`);
  s.s.forEach(sec => sec.i.forEach((it, j) => { if (it.length < 2 || !it[0] || !it[1]) errors.push(`${s.id} / ${sec.h} item ${j}: malformed`); }));
  s.q.forEach((q, i) => checkQ(q, `${s.id} q${i + 1}`));
});
A.scenarios.forEach((q, i) => checkQ(q, `scenario ${i + 1}`));

const nonAscii = [];
for (const f of files) {
  fs.readFileSync(path.join(dataDir, f), 'utf8').split('\n').forEach((line, n) => {
    if (/[^\x00-\x7F]/.test(line)) nonAscii.push(`${f}:${n + 1}`);
  });
}
if (nonAscii.length) errors.push('non-ASCII characters at ' + nonAscii.join(', '));

if (errors.length) {
  console.error('Validation failed:\n - ' + errors.join('\n - '));
  process.exit(1);
}

/* ---------- Markdown generation ---------- */
const LET = 'ABCDEFGH';
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ascii = s => String(s)
  .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
  .replace(/[\u2013\u2014]/g, '-').replace(/\u2026/g, '...');
const cell = s => ascii(s).replace(/\|/g, '\\|');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const ordered = A.categories.flatMap(c => A.services.filter(s => s.cat === c.id));
const catDir = c => String(A.categories.indexOf(c) + 1).padStart(2, '0') + '-' + c.id;

function questionMd(q, n) {
  const ans = Array.isArray(q.a) ? q.a : [q.a];
  return [
    `**Q${n}.** ${ascii(q.q)}`,
    '',
    ...q.o.map((o, i) => `- ${LET[i]}. ${ascii(o)}`),
    '',
    '<details><summary>Answer</summary>',
    '',
    `**${ans.map(a => LET[a]).join(', ')}** - ${ascii(q.e)}`,
    '',
    `_Domain: ${A.domains[q.d]}_`,
    '',
    '</details>',
    ''
  ].join('\n');
}

let count = 0;
for (const s of ordered) {
  const c = A.categories.find(x => x.id === s.cat);
  const dir = path.join(outDir, catDir(c));
  fs.mkdirSync(dir, { recursive: true });
  const lines = [
    `# ${ascii(s.name)}`,
    '',
    `> ${ascii(s.tag)}`,
    '',
    `Category: **${ascii(c.name)}** | Exam importance: ${'*'.repeat(s.imp)}${'-'.repeat(3 - s.imp)} | [Back to index](../README.md)`,
    '',
    '## Contents',
    '',
    ...s.s.map(sec => `- [${ascii(sec.h)}](#${slug(sec.h)})`),
    '- [Exam tips](#exam-tips)',
    `- [Practice questions](#practice-questions)`,
    ''
  ];
  s.s.forEach(sec => {
    lines.push(`## ${ascii(sec.h)}`, '');
    sec.i.forEach(it => {
      lines.push(`- **${ascii(it[0])}** - ${ascii(it[1])}`);
      (it[2] || []).forEach(cc => lines.push(`  - **${ascii(cc[0])}** - ${ascii(cc[1])}`));
    });
    lines.push('');
  });
  lines.push('## Exam tips', '', ...s.tips.map(t => `- ${ascii(t)}`), '');
  lines.push('## Practice questions', '');
  s.q.forEach((q, i) => lines.push(questionMd(q, i + 1)));
  fs.writeFileSync(path.join(dir, s.id + '.md'), lines.join('\n'));
  count++;
}

/* Cheat sheet */
const C = A.cheats;
const cheat = ['# SAA-C03 Cheat Sheet', '', '[Back to index](README.md)', '', '## Exam strategy', '',
  ...C.strategy.map((t, i) => `${i + 1}. ${ascii(t)}`), '', '## If the question says... pick', '',
  '| Keyword | Answer |', '| --- | --- |', ...C.keywords.map(k => `| ${cell(k[0])} | **${cell(k[1])}** |`), ''];
C.compare.forEach(t => {
  cheat.push(`## ${ascii(t.title)}`, '', '| ' + t.cols.map(cell).join(' | ') + ' |', '|' + t.cols.map(() => ' --- |').join(''));
  t.rows.forEach(r => cheat.push('| ' + r.map(cell).join(' | ') + ' |'));
  cheat.push('');
});
cheat.push('## Numbers to remember', '', '| Item | Value |', '| --- | --- |', ...C.numbers.map(n => `| ${cell(n[0])} | **${cell(n[1])}** |`), '');
fs.writeFileSync(path.join(outDir, 'cheat-sheet.md'), cheat.join('\n'));

/* Scenario questions */
const scen = ['# Cross-service scenario questions', '', '[Back to index](README.md)', ''];
A.scenarios.forEach((q, i) => scen.push(questionMd(q, i + 1)));
fs.writeFileSync(path.join(outDir, 'scenarios.md'), scen.join('\n'));

/* Index */
const totalQ = A.services.reduce((n, s) => n + s.q.length, 0) + A.scenarios.length;
const idx = ['# AWS Solutions Architect Associate (SAA-C03) - Revision Docs', '',
  `${ordered.length} services/topics, ${totalQ} practice questions. Generated from \`site/data\` by \`tools/build-docs.js\` - edit the data files, then re-run the script.`, '',
  '## Exam at a glance', '',
  `- ${A.exam.questions} questions (${A.exam.scored} scored), ${A.exam.minutes} minutes, pass mark ${A.exam.passScaled}/1000`,
  `- ${A.exam.format}`,
  ...Object.keys(A.domains).map(k => `- Domain ${k}: ${A.domains[k]} - ${A.domainWeights[k]}%`), '',
  '## Quick links', '', '- [Cheat sheet](cheat-sheet.md)', '- [Cross-service scenario questions](scenarios.md)', ''];
A.categories.forEach(c => {
  const list = ordered.filter(s => s.cat === c.id);
  if (!list.length) return;
  idx.push(`## ${ascii(c.name)}`, '', `_${ascii(c.blurb)}_`, '');
  list.forEach(s => idx.push(`- [${ascii(s.name)}](${catDir(c)}/${s.id}.md) ${'*'.repeat(s.imp)} - ${ascii(s.tag)}`));
  idx.push('');
});
fs.writeFileSync(path.join(outDir, 'README.md'), idx.join('\n'));

console.log(`OK: ${count} service docs, ${totalQ} questions, ${C.keywords.length} keywords, ${C.compare.length} comparison tables -> ${path.relative(root, outDir)}`);
