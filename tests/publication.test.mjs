import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateManifest,assertRegular} from '../scripts/publication.mjs';
const make=files=>({schemaVersion:1,groups:[{pages:files.map(file=>({file,title:'Page'}))}]});
test('actual allowlist keeps the 23 originally reviewed pages and matches provenance',()=>{const pages=validateManifest(JSON.parse(fs.readFileSync('publication.json')));const prov=JSON.parse(fs.readFileSync('provenance.json'));assert.ok(pages.length>=23);assert.equal(pages.length,prov.pages.length);assert.equal(prov.pages.filter(p=>p.sourceSha256!==null).length,23,'23 originally reviewed pages retain source hashes');});
test('private paths and traversal are rejected',()=>{for(const f of ['../README.md','/index.md','docs/../../README.md','secret.mdx','a\\b.md'])assert.throws(()=>validateManifest(make(['index.md',f])));});
test('duplicate and absent home fail',()=>{assert.throws(()=>validateManifest(make(['index.md','index.md'])));assert.throws(()=>validateManifest(make(['guide.md'])));});
test('symlinks cannot enter publication stage',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'docs-test-'));try{fs.writeFileSync(path.join(dir,'a.md'),'safe');fs.symlinkSync(path.join(dir,'a.md'),path.join(dir,'b.md'));assert.throws(()=>assertRegular(dir,'b.md'));assert.equal(assertRegular(dir,'a.md'),path.join(dir,'a.md'));}finally{fs.rmSync(dir,{recursive:true,force:true});}});

test('public candidate has no orphan Markdown or private links',()=>{
 const manifest=validateManifest(JSON.parse(fs.readFileSync('publication.json')));
 const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
 const actual=walk('site').filter(f=>f.endsWith('.md')).map(f=>f.slice(5)).sort();
 assert.deepEqual(actual,manifest.map(p=>p.file).sort());
 for(const p of manifest){const s=fs.readFileSync(path.join('site',p.file),'utf8');assert.doesNotMatch(s,/FINAL DOCS|FOOD-FOR-THE-AI-GODS|fincen_MRA_draft|github_pat_|-----BEGIN .*PRIVATE KEY-----/);}
});
