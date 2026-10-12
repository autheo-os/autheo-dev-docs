import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {load} from 'cheerio';
import {pages,publicFiles} from './static-files.mjs';
import {renderBody,renderPage} from './render.mjs';
const allowed=new Set(publicFiles);const report={pages:pages.length,mounts:['/','/autheo-dev-docs/'],localLinks:0,fragments:0,failures:[]};
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.relative('dist',path.join(dir,e.name)).split(path.sep).join('/')]);
assert.deepEqual(walk('dist').sort(),[...allowed].sort(),'dist contains only approved viewer files');
for(const file of publicFiles){assert.deepEqual(fs.readFileSync(file),fs.readFileSync('dist/'+file),'root/dist parity: '+file);const text=fs.readFileSync(file,'utf8');assert.doesNotMatch(text,/AUTHEO-PLANNING|FINAL DOCS|FOOD-FOR-THE-AI-GODS|fincen_MRA_draft|github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\/home\/|@vite|vitepress/i,file);}
const parsed=new Map(pages.map(p=>{const file=p.file.replace(/\.md$/,'.html');const html=fs.readFileSync(file,'utf8');assert.equal(html,renderPage(p),'generated page freshness');const $=load(html);assert.equal($('article').html(),load(renderBody(p.file).html)('body').html(),'complete rendered body parity');assert.equal($('article h1').length,1);assert.equal($('meta[name=robots]').attr('content'),'noindex, nofollow');assert.equal($('a[aria-current=page]').length,1);const ids=$('[id]').toArray().map(e=>$(e).attr('id'));assert.equal(ids.length,new Set(ids).size,'unique IDs');return [file,$];}));
for(const base of report.mounts)for(const [file,$]of parsed){for(const el of $('[href],[src]').toArray()){
 const value=$(el).attr('href')||$(el).attr('src');const url=new URL(value,'http://docs.invalid'+base+file);if(url.origin!=='http://docs.invalid'){assert.equal(el.tagName,'a','no remote runtime resources');assert.match(url.protocol,/^https?:$/);continue;}
 assert.ok(!value.startsWith('/'),'relative links required: '+value);assert.ok(url.pathname.startsWith(base),'link remains inside mount');const target=decodeURIComponent(url.pathname.slice(base.length));assert.ok(allowed.has(target),file+' missing local target '+value);report.localLinks++;
 if(url.hash){const dest=parsed.get(target);assert.ok(dest,'fragment target is HTML');assert.ok(dest('[id]').toArray().some(e=>dest(e).attr('id')===decodeURIComponent(url.hash.slice(1))),file+' missing fragment '+value);report.fragments++;}
}}
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('assets/search-index.js','utf8'),sandbox,{timeout:1000});assert.equal(sandbox.window.AUTHEO_DOCS_INDEX.length,pages.length);for(const page of pages){const entry=sandbox.window.AUTHEO_DOCS_INDEX.find(e=>e.path===page.file.replace(/\.md$/,'.html'));assert.ok(entry);assert.equal(entry.text,renderBody(page.file).text,'full-text index parity');}
const css=fs.readFileSync('assets/docs.css','utf8');assert.doesNotMatch(css,/@import|url\(/i,'no unverified CSS resource requests');
fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/static-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
