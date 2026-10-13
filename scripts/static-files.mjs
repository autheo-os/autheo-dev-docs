import fs from 'node:fs';
import {validateManifest} from './publication.mjs';
export const pages=validateManifest(JSON.parse(fs.readFileSync(new URL('../publication.json',import.meta.url),'utf8')));
export const publicFiles=[...pages.map(p=>p.file.replace(/\.md$/,'.html')),'assets/docs.css','assets/docs.js','assets/search-index.js','assets/favicon.svg','assets/platform-map.svg','.nojekyll'];
