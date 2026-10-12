// External link checker for the committed HTML. Internal links, assets and
// fragments are already enforced by scripts/check-dist.mjs (npm run check).
//   node scripts/check-links.mjs [--json]
// Uses only Node builtins. Sends GET requests with a short timeout and low concurrency.
import fs from 'node:fs';
import {publicFiles} from './static-files.mjs';
const SKIP=[/^https:\/\/dev\.autheo\.com\/(settings|sign-in|sign-up)/];
const urls=new Map();
for(const file of publicFiles.filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');
 for(const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)){const u=m[1].replace(/&amp;/g,'&').split('#')[0];if(SKIP.some(r=>r.test(u)))continue;if(!urls.has(u))urls.set(u,new Set());urls.get(u).add(file);}
}
const list=[...urls.keys()].sort();const results=[];
async function check(url){
 for(let attempt=0;attempt<2;attempt++){
  try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),15000);const r=await fetch(url,{redirect:'follow',signal:ctl.signal,headers:{'user-agent':'autheo-dev-docs-link-check'}});clearTimeout(t);
   if(r.status===429){await new Promise(s=>setTimeout(s,5000));continue;}
   return {url,status:r.status,ok:r.status<400};}
  catch(e){if(attempt)return {url,status:0,ok:false,error:String(e.cause?.code||e.message)};}
 }
 return {url,status:429,ok:false};
}
let i=0;await Promise.all(Array.from({length:4},async()=>{while(i<list.length){const u=list[i++];results.push(await check(u));}}));
const bad=results.filter(r=>!r.ok);
if(process.argv.includes('--json'))console.log(JSON.stringify({checked:results.length,failures:bad},null,2));
else{console.log('Checked '+results.length+' external URLs.');for(const b of bad)console.log('FAIL '+b.status+' '+b.url+(b.error?' ('+b.error+')':'')+' <- '+[...urls.get(b.url)].join(', '));}
process.exit(bad.length?1:0);
