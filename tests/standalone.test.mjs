import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const read=file=>fs.readFileSync(file);const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const provenance=JSON.parse(read('provenance.json'));const manifest=JSON.parse(read('publication.json'));const pages=manifest.groups.flatMap(g=>g.pages);
test('every published page is hash-bound; original pages are unchanged or carry a recorded adaptation',()=>{
 assert.deepEqual(provenance.pages.map(p=>p.file).sort(),pages.map(p=>p.file).sort());
 for(const page of provenance.pages){
  assert.equal(hash(read('site/'+page.file)),page.publishedSha256,page.file+' publishedSha256 is stale: run node scripts/provenance.mjs --update');
  if(page.sourceSha256===null){assert.match(page.added||'',/^\d{4}-\d{2}-\d{2}$/,page.file+' added pages record a date');assert.ok(Array.isArray(page.sources)&&page.sources.length>0,page.file+' added pages list their evidence sources');}
  else if(page.adaptation===null)assert.equal(page.sourceSha256,page.publishedSha256,page.file+' unchanged original');
  else assert.ok(typeof page.adaptation==='string'&&page.adaptation.length>20,page.file+' adaptation must be described');
 }
 assert.equal(provenance.pages.filter(p=>p.sourceSha256!==null).length,23);
});
test('no runtime or framework dependencies; preview needs only Node builtins',()=>{const pkg=JSON.parse(read('package.json'));assert.equal(pkg.dependencies,undefined);assert.equal(pkg.scripts.check,'npm test && npm run docs:build');assert.equal(manifest.visibility,'public');assert.equal(manifest.releaseApproved,true);const lock=JSON.parse(read('package-lock.json'));for(const name of Object.keys(lock.packages))assert.doesNotMatch(name,/vitepress|node_modules\/(?:vue|vite|@vue)(?:\/|$)/);assert.doesNotMatch(read('scripts/serve.mjs').toString(),/from ['"](?!node:|\.)/);});
test('public source contains no credential or private-location patterns',()=>{const files=['README.md','publication.json','provenance.json','package.json','package-lock.json',...pages.map(p=>'site/'+p.file)];const denied=[/gh[pousr]_[A-Za-z0-9]{20,}/,/github_pat_[A-Za-z0-9_]{20,}/,/AKIA[A-Z0-9]{16}/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\/home\/[^\s]+/,/https?:\/\/[^/\s]+:[^/\s]+@/,/AUTHEO-PLANNING|FINAL DOCS|FOOD-FOR-THE-AI-GODS|fincen_MRA_draft/];for(const file of files)for(const pattern of denied)assert.doesNotMatch(read(file).toString(),pattern,file);});
