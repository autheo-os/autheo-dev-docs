import fs from 'node:fs';
import path from 'node:path';
import {pages,publicFiles} from './static-files.mjs';
import {assertRegular} from './publication.mjs';
const files=[...publicFiles,'README.md','.gitignore','package.json','package-lock.json','publication.json','provenance.json','ci/verify.yml.example','.github/workflows/verify.yml','docs/implementation/checklist.md','docs/implementation/gap-audit.md',...pages.map(p=>'site/'+p.file),...['publication','static-files','render','build','check-dist','serve','export','browser-qa','provenance','check-links'].map(n=>'scripts/'+n+'.mjs'),...['publication','content','standalone','static'].map(n=>'tests/'+n+'.test.mjs')];
for(const file of files)assertRegular('.',file);
const root='artifacts/standalone-docs';if(fs.existsSync('artifacts')&&fs.lstatSync('artifacts').isSymbolicLink())throw Error('Export ancestor cannot be a symlink');if(fs.existsSync(root)&&fs.lstatSync(root).isSymbolicLink())throw Error('Export root cannot be a symlink');fs.rmSync(root,{recursive:true,force:true});
for(const file of files){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
console.log('Exported '+files.length+' explicitly allowlisted source/static files; ready to serve without build.');
