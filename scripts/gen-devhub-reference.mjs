// Generate the DevHub (Layer 0) REST + CLI reference from the L0_devhub_deploy repository.
//
//   node scripts/gen-devhub-reference.mjs --source <L0_devhub_deploy checkout>
//       Reads ui/lib/api-catalog.ts (the dashboard's own API catalog, "mirrors the real node
//       admin API (crates/hive-cloud)") and crates/shadw-cli/src/main.rs (clap top-level
//       commands + doc comments). Writes data/devhub-api.json and site/devhub/api.md.
//   node scripts/gen-devhub-reference.mjs --check
//       Re-renders site/devhub/api.md from data/devhub-api.json; exits 1 on drift.
//
// Never hand-edit data/devhub-api.json or site/devhub/api.md.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const DATA = 'data/devhub-api.json';
const OUT = 'site/devhub/api.md';
const REPO_URL = 'https://github.com/autheo-os/L0_devhub_deploy';

function arrayLiteral(src, marker) {
  const start = src.indexOf(marker);
  if (start < 0) throw new Error('marker not found: ' + marker);
  const i = src.indexOf('[', src.indexOf('=', start));
  let depth = 0, inStr = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (inStr) { if (c === '\\') { j++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) return src.slice(i, j + 1); }
  }
  throw new Error('unterminated array for ' + marker);
}

function cliCommands(src) {
  const body = src.slice(src.search(/enum (Cmd|Command)\b/));
  const block = body.slice(body.indexOf('{') + 1, body.indexOf('\n}'));
  const out = []; let doc = [];
  for (const raw of block.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('///')) { doc.push(line.slice(3).trim()); continue; }
    const m = line.match(/^([A-Z][A-Za-z]*)\s*[({,]/);
    if (m) { out.push({command: m[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), summary: doc.join(' ')}); doc = []; }
    else if (!line.startsWith('#[')) doc = doc.length && line === '' ? doc : doc;
  }
  return out;
}

function extract(source) {
  const cat = fs.readFileSync(path.join(source, 'ui/lib/api-catalog.ts'), 'utf8');
  const categories = new Function('return ' + arrayLiteral(cat, 'export const API_CATEGORIES'))();
  const main = fs.readFileSync(path.join(source, 'crates/shadw-cli/src/main.rs'), 'utf8');
  const git = (...a) => execFileSync('git', ['-C', source, ...a], {encoding: 'utf8'}).trim();
  return {
    schemaVersion: 1,
    source: {repository: REPO_URL, commit: git('rev-parse', 'HEAD'), committed: git('log', '-1', '--format=%cI'),
             files: ['ui/lib/api-catalog.ts', 'crates/shadw-cli/src/main.rs']},
    apiBase: (cat.match(/API_BASE = "([^"]+)"/) || [])[1] || null,
    categories: categories.map(c => ({slug: c.slug, name: c.name, endpoints: c.endpoints.map(e => ({
      name: e.name, method: e.method, path: e.path, summary: e.summary,
      pathParams: e.pathParams || [], queryParams: e.queryParams || [], bodyParams: e.bodyParams || []}))})),
    cli: cliCommands(main),
  };
}

const esc = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
function params(title, list) {
  if (!list.length) return '';
  return `\n${title}:\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n` +
    list.map(p => `| \`${esc(p.name)}\` | ${esc(p.type)} | ${p.required ? 'yes' : 'no'} | ${esc(p.desc)} |`).join('\n') + '\n';
}

function render(d) {
  const n = d.categories.reduce((a, c) => a + c.endpoints.length, 0);
  const short = d.source.commit.slice(0, 12);
  let md = `# Autheo DevHub API and CLI reference

**Generated from code — do not edit by hand.** Produced by \`scripts/gen-devhub-reference.mjs\` from [${d.source.repository.replace('https://github.com/', '')}](${d.source.repository}) commit [\`${short}\`](${d.source.repository}/tree/${d.source.commit}) (committed ${d.source.committed.slice(0, 10)}), files ${d.source.files.map(f => '\`' + f + '\`').join(' and ')}.

The catalog lists **${n} endpoints** in ${d.categories.length} groups and the DevHub CLI (\`shadw\`) has **${d.cli.length} top-level commands**. Autheo DevHub is the developer cloud at [dev.autheo.com](https://dev.autheo.com); see [DevHub (Layer 0)](./index.md) for authentication and what is live.

::: warning Base URL
The catalog documents \`${d.apiBase}\` as the API host, a legacy hostname from before the product was unified as Autheo DevHub at dev.autheo.com (create API keys there); paths are identical wherever the API is served. A self-hosted node serves the same admin API on \`http://127.0.0.1:8786\` by default (the CLI's default).
:::

## Endpoints

| Group | Method | Path | Summary |
| --- | --- | --- | --- |
`;
  for (const c of d.categories) for (const e of c.endpoints)
    md += `| ${esc(c.name)} | ${e.method} | \`${esc(e.path)}\` | ${esc(e.summary)} |\n`;
  for (const c of d.categories) {
    md += `\n## ${c.name}\n`;
    for (const e of c.endpoints) {
      md += `\n### ${e.name}\n\n\`${e.method} ${e.path}\`\n\n${e.summary}\n`;
      md += params('Path parameters', e.pathParams) + params('Query parameters', e.queryParams) + params('Body', e.bodyParams);
    }
  }
  md += `\n## DevHub CLI commands\n\nThe DevHub CLI binary, its config file and environment variables still carry the legacy name \`shadw\` in code. Every request sends \`Authorization: Bearer <key>\`. Configure with \`shadw auth\` (saves \`~/.shadw/config.json\`) or the environment: \`SHADW_API_URL\`, \`SHADW_TOKEN\`, \`SHADW_TEAM\`.\n\n| Command | Purpose |\n| --- | --- |\n`;
  for (const c of d.cli) md += `| \`shadw ${c.command}\` | ${esc(c.summary)} |\n`;
  return md;
}

const args = process.argv.slice(2);
if (args.includes('--check')) {
  const d = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  if (fs.readFileSync(OUT, 'utf8') !== render(d)) { console.error(OUT + ' is out of date; regenerate it'); process.exit(1); }
  console.log(OUT + ' matches ' + DATA);
} else {
  const i = args.indexOf('--source');
  if (i < 0) { console.error('usage: --source <L0_devhub_deploy checkout> | --check'); process.exit(2); }
  const d = extract(args[i + 1]);
  fs.mkdirSync('data', {recursive: true}); fs.mkdirSync(path.dirname(OUT), {recursive: true});
  fs.writeFileSync(DATA, JSON.stringify(d, null, 2) + '\n');
  fs.writeFileSync(OUT, render(d));
  console.log(JSON.stringify({endpoints: d.categories.reduce((a, c) => a + c.endpoints.length, 0), cli: d.cli.length, commit: d.source.commit}));
}
