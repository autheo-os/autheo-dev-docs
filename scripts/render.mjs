import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import {load} from 'cheerio';
import {validateManifest,assertRegular} from './publication.mjs';
export const manifest=JSON.parse(fs.readFileSync('publication.json','utf8'));
export const pages=validateManifest(manifest);
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const route=file=>file.replace(/\.md$/,'.html');
export const relative=(from,to)=>path.posix.relative(path.posix.dirname(from),to)||path.posix.basename(to);
const md=new MarkdownIt({html:false,linkify:false,typographer:false});
md.use(container,'warning',{render(tokens,i){return tokens[i].nesting===1?'<aside class="notice"><p class="notice-title">'+escape(tokens[i].info.trim().slice('warning'.length).trim()||'Warning')+'</p>\n':'</aside>\n';}});
const link=md.renderer.rules.link_open||((tokens,i,options,env,self)=>self.renderToken(tokens,i,options));
md.renderer.rules.link_open=(tokens,i,options,env,self)=>{const href=tokens[i].attrGet('href');if(href&&!/^(?:[a-z]+:|\/\/)/i.test(href)){const [pathname,...rest]=href.split('#');tokens[i].attrSet('href',pathname.replace(/\.md$/,'.html')+(rest.length?'#'+rest.join('#'):''));}return link(tokens,i,options,env,self);};
export function renderBody(file){
 const tokens=md.parse(fs.readFileSync(assertRegular('site',file),'utf8'),{});const used=new Map();const headings=[];
 for(let i=0;i<tokens.length;i++)if(tokens[i].type==='heading_open'){
  const inline=tokens[i+1];const text=(inline.children||[]).map(t=>t.type==='image'?t.content:t.content||'').join('');
  const slug=text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s+/g,'-').replace(/^(?=\d)/,'_');const n=used.get(slug)||0;used.set(slug,n+1);const id=slug+(n?'-'+n:'');tokens[i].attrSet('id',id);headings.push({id,text,level:Number(tokens[i].tag.slice(1))});
 }
 const $=load(md.renderer.render(tokens,md.options,{}));$('pre,table').attr('tabindex','0');const html=$('body').html();return {html,headings,text:$.root().text().replace(/\s+/g,' ').trim()};
}
export function renderPage(page){
 const current=route(page.file);const body=renderBody(page.file);const href=to=>escape(relative(current,to));
 const sidebar=manifest.groups.map(g=>'<section class="nav-group"><h2>'+escape(g.title)+'</h2><ul>'+g.pages.map(p=>'<li><a '+(p.file===page.file?'aria-current="page" ':'')+'href="'+href(route(p.file))+'">'+escape(p.title)+'</a></li>').join('')+'</ul></section>').join('');
 const toc=body.headings.filter(h=>h.level===2||h.level===3).map(h=>'<li><a href="#'+escape(h.id)+'">'+escape(h.text)+'</a></li>').join('');
 const n=pages.findIndex(p=>p.file===page.file);const neighbors=[n>0?'<a rel="prev" href="'+href(route(pages[n-1].file))+'">← '+escape(pages[n-1].title)+'</a>':'<span></span>',n<pages.length-1?'<a rel="next" href="'+href(route(pages[n+1].file))+'">'+escape(pages[n+1].title)+' →</a>':''].join('');
 return '<!doctype html>\n<html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="description" content="Evidence-led AUTHEO documentation: chain references and clearly qualified ecosystem design guides."><title>'+escape(page.title)+' · AUTHEO Docs</title><link rel="icon" href="'+href('assets/favicon.svg')+'" type="image/svg+xml"><link rel="stylesheet" href="'+href('assets/docs.css')+'"><script src="'+href('assets/search-index.js')+'" defer></script><script src="'+href('assets/docs.js')+'" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="'+href('index.html')+'"><span class="brand-mark" aria-hidden="true">A</span> AUTHEO <span class="brand-label">/ Documentation</span></a><span class="header-note">Evidence-led guides</span></header><div class="layout"><aside class="sidebar"><details class="navigation" open><summary>Browse documentation</summary><nav aria-label="Documentation">'+sidebar+'</nav></details></aside><div class="reading"><section class="search" aria-label="Search documentation" hidden><label for="docs-search">Search all '+pages.length+' documents</label><input id="docs-search" type="search" placeholder="Search topics, APIs, networks…" autocomplete="off" aria-controls="search-results" aria-describedby="search-status"><p id="search-status" role="status"></p><ul id="search-results"></ul></section><main id="main" tabindex="-1"><p class="eyebrow">AUTHEO / DEVELOPER DOCUMENTATION</p><article>'+body.html+'</article><nav class="page-links" aria-label="Previous and next documents">'+neighbors+'</nav><footer>Reviewed '+escape(page.reviewed||'9 October 2026')+' · Source-backed is not live-tested.<br>Verify release and network before use.</footer></main></div><aside class="outline" aria-label="On this page"><h2>On this page</h2><ul>'+toc+'</ul></aside></div></body></html>\n';
}
export {publicFiles} from './static-files.mjs';
