// Generate the Autheo MCP tool reference from the autheo-MCP repository.
//
//   node scripts/gen-mcp-reference.mjs --source <autheo-MCP checkout>
//       Reads <source>/docs/tools.json when the MCP repository publishes one;
//       otherwise introspects the registered FastMCP surface by importing
//       autheo_mcp.server with the checkout's Python (.venv/bin/python, else python3)
//       and calling tools/list + resources/list. Writes data/mcp-tools.json and
//       site/mcp/tools.md.
//   node scripts/gen-mcp-reference.mjs --check
//       Re-renders site/mcp/tools.md from the committed data/mcp-tools.json and exits 1
//       if the committed Markdown differs (CI drift check; needs no Python).
//
// Never hand-edit data/mcp-tools.json or site/mcp/tools.md.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const DATA = 'data/mcp-tools.json';
const OUT = 'site/mcp/tools.md';
const REPO_URL = 'https://github.com/autheo-os/autheo-MCP';

// Ordered: first matching rule wins. Purely presentational grouping by tool name.
const GROUPS = [
  ['Server and setup', /^autheo_(get_server_info|get_integration_guide)$/],
  ['Chain reads (CometBFT / Cosmos REST)', /^autheo_(get_network_status|get_latest_block|get_block|get_transaction|get_account|get_balance)$/],
  ['THEO display price', /^autheo_(get_theo_price|convert_)/],
  ['Marketplace', /^autheo_(marketplace_|get_order$)/],
  ['DevHub (Hive admin API)', /^autheo_devhub_/],
  ['Legacy DevHub node inspection', /^autheo_(compute_|storage_|get_provider)/],
  ['Agent trust inspection', /^autheo_agent_/],
];

const PY = [
  'import asyncio, json, sys',
  "sys.path.insert(0, 'src')",
  'from autheo_mcp.server import mcp',
  'async def main():',
  '    tools = await mcp.list_tools()',
  '    res = await mcp.list_resources()',
  '    print(json.dumps({"tools": [t.model_dump(mode="json", exclude_none=True) for t in tools], "resources": [r.model_dump(mode="json", exclude_none=True) for r in res]}))',
  'asyncio.run(main())',
].join('\n');

const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], {encoding: 'utf8'}).trim();

function collect(source) {
  const commit = git(source, 'rev-parse', 'HEAD');
  const committed = git(source, 'show', '-s', '--format=%cI', 'HEAD');
  if (git(source, 'status', '--porcelain', '--untracked-files=no') !== '') throw Error('Source checkout has uncommitted changes; generate only from a commit.');
  const pyproject = fs.readFileSync(path.join(source, 'pyproject.toml'), 'utf8');
  const version = (pyproject.match(/^version\s*=\s*"([^"]+)"/m) || [])[1] || null;
  const published = path.join(source, 'docs', 'tools.json');
  let raw, method;
  if (fs.existsSync(published)) {
    raw = JSON.parse(fs.readFileSync(published, 'utf8'));
    if (Array.isArray(raw)) raw = {tools: raw, resources: []};
    method = 'docs/tools.json published by the MCP repository';
  } else {
    const venv = path.join(source, '.venv', 'bin', 'python');
    const python = fs.existsSync(venv) ? venv : 'python3';
    raw = JSON.parse(execFileSync(python, ['-c', PY], {cwd: source, encoding: 'utf8', timeout: 120000, env: {PATH: process.env.PATH, HOME: process.env.HOME}}));
    method = 'FastMCP tools/list and resources/list introspection of autheo_mcp.server';
  }
  const tools = (raw.tools || []).map(t => ({
    name: t.name,
    description: dedent(t.description || ''),
    inputSchema: t.inputSchema || t.input_schema || {type: 'object', properties: {}},
    annotations: t.annotations || null,
  })).sort((a, b) => a.name.localeCompare(b.name));
  const resources = (raw.resources || []).map(r => ({uri: r.uri, name: r.name || null, description: dedent(r.description || ''), mimeType: r.mimeType || null}))
    .sort((a, b) => a.uri.localeCompare(b.uri));
  return {schemaVersion: 1, source: {repository: REPO_URL, commit, committed, version, method}, counts: {tools: tools.length, resources: resources.length}, tools, resources};
}

function dedent(s) {
  const lines = s.replace(/\r/g, '').split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const widths = lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length);
  const indent = widths.length ? Math.min(...widths) : 0;
  return lines.map(l => l.slice(Math.min(indent, l.match(/^ */)[0].length)).trimEnd()).join('\n');
}

const cell = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
function typeOf(schema) {
  if (!schema) return 'any';
  if (schema.anyOf) return schema.anyOf.map(typeOf).join(' or ');
  if (schema.type === 'array') return 'array of ' + typeOf(schema.items);
  if (schema.enum) return schema.enum.map(v => JSON.stringify(v)).join(' / ');
  return schema.type || 'any';
}
const firstParagraph = text => text.split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, ' ').trim();
const slug = text => text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-').replace(/^(?=\d)/, '_');
const code = s => '`' + s + '`';

function render(data) {
  const s = data.source;
  const grouped = new Map(GROUPS.map(([g]) => [g, []]));
  grouped.set('Other', []);
  for (const t of data.tools) grouped.get((GROUPS.find(([, re]) => re.test(t.name)) || ['Other'])[0]).push(t);
  const readOnly = data.tools.filter(t => t.annotations && t.annotations.readOnlyHint === true).length;
  const out = [];
  out.push('# MCP tool reference', '');
  out.push('**Generated from code — do not edit by hand.** This page is produced by ' + code('scripts/gen-mcp-reference.mjs') + ' from [autheo-os/autheo-MCP](' + s.repository + ') commit [' + code(s.commit.slice(0, 12)) + '](' + s.repository + '/tree/' + s.commit + ') (package version ' + code(s.version) + ', committed ' + s.committed.slice(0, 10) + ') using ' + s.method + '.', '');
  out.push('The registered surface at that commit is **' + data.counts.tools + ' tools** and **' + data.counts.resources + ' resources**. ' + readOnly + ' of ' + data.counts.tools + ' tools declare the MCP ' + code('readOnlyHint') + ' annotation. A tool being registered does not mean a live Autheo service is reachable: every tool calls only the endpoints you configure (see [MCP server](./index.md)).', '');
  out.push('::: warning Source-backed, not live-tested');
  out.push('The MCP README states the implementation was verified with local contract fixtures and MCP stdio sessions, "not proof of access to a live Autheo installation". Descriptions below are the docstrings registered in code.');
  out.push(':::', '');
  out.push('## Summary', '');
  out.push('| Group | Tools |', '| --- | --- |');
  for (const [g, list] of grouped) if (list.length) out.push('| [' + g + '](#' + slug(g) + ') | ' + list.length + ' |');
  out.push('');
  for (const [g, list] of grouped) {
    if (!list.length) continue;
    out.push('## ' + g, '');
    out.push('| Tool | Summary |', '| --- | --- |');
    for (const t of list) out.push('| [' + code(t.name) + '](#' + slug(t.name) + ') | ' + (cell(firstParagraph(t.description)) || '—') + ' |');
    out.push('');
    for (const t of list) {
      out.push('### ' + t.name, '');
      if (t.description) out.push(t.description.replace(/\n{3,}/g, '\n\n'), '');
      const props = Object.entries(t.inputSchema.properties || {});
      const required = new Set(t.inputSchema.required || []);
      if (!props.length) out.push('Arguments: none.', '');
      else {
        out.push('| Argument | Type | Required | Default |', '| --- | --- | --- | --- |');
        for (const [name, p] of props) out.push('| ' + code(name) + ' | ' + cell(typeOf(p)) + ' | ' + (required.has(name) ? 'yes' : 'no') + ' | ' + ('default' in p ? code(cell(JSON.stringify(p.default))) : '—') + ' |');
        out.push('');
      }
      const a = t.annotations || {};
      const hints = ['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint'].filter(k => k in a).map(k => code(k + ': ' + a[k]));
      out.push('Annotations: ' + (hints.length ? hints.join(', ') : 'none declared') + '.', '');
    }
  }
  out.push('## Resources', '');
  out.push('| URI | Description |', '| --- | --- |');
  for (const r of data.resources) out.push('| ' + code(r.uri) + ' | ' + (cell(firstParagraph(r.description)) || '—') + ' |');
  out.push('');
  out.push('## Regenerate', '');
  out.push('~~~sh', 'node scripts/gen-mcp-reference.mjs --source ../autheo-MCP   # clean checkout at the commit to document', 'node scripts/gen-mcp-reference.mjs --check                   # CI: Markdown matches data/mcp-tools.json', 'npm run docs:build', '~~~', '');
  return out.join('\n');
}

const args = process.argv.slice(2);
if (args.includes('--check')) {
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== render(data)) { console.error(OUT + ' is stale or hand-edited; regenerate with node scripts/gen-mcp-reference.mjs --source <autheo-MCP>'); process.exit(1); }
  console.log('MCP reference matches ' + DATA + ' (' + data.counts.tools + ' tools, ' + data.counts.resources + ' resources).');
} else {
  const i = args.indexOf('--source');
  if (i < 0 || !args[i + 1]) { console.error('Usage: node scripts/gen-mcp-reference.mjs --source <autheo-MCP checkout> | --check'); process.exit(2); }
  const data = collect(path.resolve(args[i + 1]));
  fs.mkdirSync(path.dirname(DATA), {recursive: true});
  fs.mkdirSync(path.dirname(OUT), {recursive: true});
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + '\n');
  fs.writeFileSync(OUT, render(data));
  console.log('Wrote ' + DATA + ' and ' + OUT + ': ' + data.counts.tools + ' tools, ' + data.counts.resources + ' resources from ' + data.source.commit.slice(0, 12) + ' via ' + data.source.method + '.');
}
