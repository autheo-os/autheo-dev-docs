# AUTHEO developer documentation

## [Read the documentation →](https://autheo-os.github.io/autheo-dev-docs/)

The link above opens the **rendered documentation website**. [This GitHub repository](https://github.com/autheo-os/autheo-dev-docs) contains its source and maintenance tools; opening an HTML file on GitHub shows source, not the website.

All **23 reviewed documents** are plain HTML with relative links and local CSS. Reading and navigation work without JavaScript; optional full-text search runs entirely in your browser. No frontend framework, backend, CDN or reader installation is required.

## Hosting

GitHub Pages publishes **`main` → `/(root)`**, with HTTPS enabled and the committed `.nojekyll` file. There is no project build command or custom deployment workflow. Push reviewed, regenerated static files to `main` to update the site.

- [Documentation home](https://autheo-os.github.io/autheo-dev-docs/)
- [API reference](https://autheo-os.github.io/autheo-dev-docs/reference/api.html)
- [Hosting and verification guide](https://autheo-os.github.io/autheo-dev-docs/deployment/index.html)

## Local preview

With Node.js 22 or newer, no package installation needed:

~~~sh
node scripts/serve.mjs
~~~

Open the printed loopback URL. The preview serves only allowlisted static files. The same files also work on any ordinary static host at a domain root or subpath, without SPA rewrites.

## Edit and verify

Markdown lives in `site/`; `publication.json` lists every published page (42 on 2026-10-12; the 23 originally reviewed pages keep their source hashes). After editing:

~~~sh
npm ci --ignore-scripts
npm run docs:build
npm run check
npm run test:browser
~~~

Commit the generated root HTML, local search index and source together. Set `CHROMIUM_PATH` for browser tests if needed. `npm run check` also creates an identical static-only `dist/` copy for other hosts. `npm run export` creates an allowlisted standalone package under ignored `artifacts/`; it does not deploy. Never upload an unfiltered local checkout, Git history, dependencies, ignored artifacts or credentials.

## Scope

These are source-backed docs, not certification of product launch, network availability, security, compliance or performance. Design/planned qualifications and the 22 unchanged source-page hashes remain intact. The site retains `noindex, nofollow` (not access control), confidentiality exclusions and existing rights; no new license or support contact is introduced.
