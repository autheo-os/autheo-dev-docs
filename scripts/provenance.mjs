// Refresh provenance.json hashes after editing Markdown sources.
//   node scripts/provenance.mjs            -> report only (exit 1 if stale)
//   node scripts/provenance.mjs --update   -> rewrite publishedSha256 values
// Rules: the 23 originally reviewed pages keep their sourceSha256; if one changes,
// its "adaptation" must describe why (the script refuses otherwise). Pages added
// after the 9 October 2026 review have sourceSha256 null, an "added" date and a
// "sources" list naming the evidence they were written from.
import fs from 'node:fs';
import crypto from 'node:crypto';
const update=process.argv.includes('--update');
const manifest=JSON.parse(fs.readFileSync('publication.json','utf8'));
const prov=JSON.parse(fs.readFileSync('provenance.json','utf8'));
const pages=manifest.groups.flatMap(g=>g.pages);
const byFile=new Map(prov.pages.map(p=>[p.file,p]));
const problems=[];let changed=0;
for(const page of pages){
 const sha=crypto.createHash('sha256').update(fs.readFileSync('site/'+page.file)).digest('hex');
 let entry=byFile.get(page.file);
 if(!entry){problems.push(page.file+': missing provenance entry (add {file, sourceSha256:null, publishedSha256, adaptation:null, added, sources})');continue;}
 if(entry.publishedSha256!==sha){
  if(entry.sourceSha256!==null&&entry.sourceSha256!==sha&&!entry.adaptation)problems.push(page.file+': original reviewed page changed; set "adaptation" to describe the change');
  else if(update){entry.publishedSha256=sha;changed++;}
  else problems.push(page.file+': publishedSha256 stale');
 }
}
for(const entry of prov.pages)if(!pages.some(p=>p.file===entry.file))problems.push(entry.file+': provenance entry without published page');
if(update&&changed)fs.writeFileSync('provenance.json',JSON.stringify(prov,null,2)+'\n');
if(problems.length){console.error(problems.join('\n'));process.exit(1);}
console.log(update?'Updated '+changed+' hash(es).':'Provenance hashes current.');
