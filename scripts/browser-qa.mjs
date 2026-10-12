import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import {pages} from './static-files.mjs';
import {renderBody} from './render.mjs';
import {startServer} from './serve.mjs';
const server=await startServer();const origin='http://127.0.0.1:'+server.address().port;let browser;
const results=[];const errors=[];fs.mkdirSync('artifacts/screenshots',{recursive:true});
try{
 browser=await chromium.launch({headless:true,chromiumSandbox:true,executablePath:process.env.CHROMIUM_PATH});
 for(const base of ['/','/autheo-dev-docs/'])for(const [device,viewport]of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const context=await browser.newContext({viewport});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});page.on('requestfailed',r=>errors.push(r.url()+' '+r.failure()?.errorText));
  for(const entry of pages){const route=base+entry.file.replace(/\.md$/,'.html');const response=await page.goto(origin+route);assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/text\/html/);await page.locator('article h1').waitFor();assert.equal((await page.locator('article').textContent()).replace(/\s+/g,' ').trim(),renderBody(entry.file).text);await page.reload();await page.locator('article h1').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' overflow');const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],route+' accessibility');results.push({base,device,route,status:200,reload:true,overflow:false,violations:0});}
  await page.goto(origin+base);await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to content');await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'main');
  await page.locator('#docs-search').fill('network');await page.locator('#search-results a').first().waitFor();await page.locator('#docs-search').press('ArrowDown');assert.equal(await page.locator(':focus').evaluate(e=>e.closest('#search-results')!==null),true);await page.keyboard.press('Enter');await page.waitForURL('**/*.html');assert.ok(page.url().startsWith(origin+base));await page.locator('article h1').waitFor();
  await page.locator('#docs-search').fill('zzzz-nothing-matches-zzzz');assert.equal(await page.locator('#search-status').textContent(),'0 documents found');await page.locator('#docs-search').press('Escape');assert.equal(await page.locator('#docs-search').inputValue(),'');
  await page.goto(origin+base);if(device==='mobile'){assert.equal(await page.locator('.navigation').getAttribute('open'),null);await page.locator('.navigation summary').click();}
  await page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'API reference',exact:true}).click();await page.waitForURL('**/reference/api.html');await page.reload();await page.locator('article h1').waitFor();
  const suffix=(base==='/'?'root':'subpath');await page.screenshot({path:'artifacts/screenshots/static-'+device+'-api-'+suffix+'.png',fullPage:true});await page.goto(origin+base);await page.screenshot({path:'artifacts/screenshots/static-'+device+'-home-'+suffix+'.png',fullPage:true});await context.close();
  const nojs=await browser.newContext({viewport,javaScriptEnabled:false});const plain=await nojs.newPage();for(const entry of pages){const response=await plain.goto(origin+base+entry.file.replace(/\.md$/,'.html'));assert.equal(response.status(),200);assert.equal((await plain.locator('article').textContent()).replace(/\s+/g,' ').trim(),renderBody(entry.file).text);assert.equal(await plain.locator('.search').isVisible(),false);assert.equal(await plain.locator('nav[aria-label=Documentation] a').count(),pages.length);assert.equal(await plain.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}
  await plain.goto(origin+base);await plain.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'API reference',exact:true}).click();await plain.waitForURL('**/reference/api.html');await plain.reload();await plain.locator('article h1').waitFor();await nojs.close();
 }
 assert.deepEqual(errors,[],'no browser errors');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));fs.writeFileSync('artifacts/browser-qa-static.json',JSON.stringify({results,errors,coverage:pages.length+' documents × 2 mounts × 2 viewports; direct navigation/reload, MIME, axe rules, search/keyboard/navigation, and '+(pages.length*4)+' no-JavaScript readings. Sandboxed Chromium; ordinary-file server; no rewrites.'},null,2));}
console.log(JSON.stringify({pageViewportMountChecks:results.length,noJavaScriptReadings:pages.length*4,errors},null,2));
