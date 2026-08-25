import { readFile, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site-dist/', import.meta.url);
const packageJson = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const metadata = JSON.parse(await readFile(new URL('package-meta.json', site), 'utf8'));
const html = await readFile(new URL('index.html', site), 'utf8');
const app = await readFile(new URL('app.js', site), 'utf8');
const bundle = await readFile(new URL('package.js', site), 'utf8');
const robots = await readFile(new URL('robots.txt', site), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', site), 'utf8');
const llms = await readFile(new URL('llms.txt', site), 'utf8');
const llmsFull = await readFile(new URL('llms-full.txt', site), 'utf8');
const migration = await readFile(new URL('guides/migration.md', site), 'utf8');
const compatibility = await readFile(new URL('guides/compatibility.md', site), 'utf8');
const example = await readFile(new URL('examples/basic.js', site), 'utf8');
const image = await stat(new URL('assets/inline-source-map-flow.png', site));

assert(metadata.name === packageJson.name, 'documentation package name is stale');
assert(metadata.version === packageJson.version, 'documentation version is stale');
assert(metadata.runtimeDependencies === 1, 'documentation dependency count is stale');
assert(!html.includes('{{PACKAGE_VERSION}}'), 'HTML version placeholder was not replaced');
assert(!llms.includes('{{PACKAGE_VERSION}}'), 'LLM version placeholder was not replaced');
assert(
  html.includes('<link rel="canonical" href="https://alexandro.net/docs/vanilla/inline-source-map/">'),
  'canonical documentation URL is missing'
);
assert(html.includes('SoftwareSourceCode'), 'structured software metadata is missing');
assert(html.includes('index,follow'), 'indexable robots metadata is missing');
assert(html.includes('./package.js'), 'production package bundle is not loaded');
assert(app.includes('globalThis.StacklineInlineSourceMap'), 'playground does not use the package bundle');
assert(bundle.includes('StacklineInlineSourceMap'), 'browser global is missing');
assert(robots.includes('User-agent: *\nAllow: /'), 'documentation robots policy is not open');
assert(sitemap.includes('/inline-source-map/llms-full.txt'), 'documentation sitemap is incomplete');
assert(llms.includes('npm install @stackline/inline-source-map'), 'LLM install reference is missing');
assert(llmsFull.includes('TypeScript 3.9'), 'LLM compatibility reference is missing');
assert(migration.includes('inline-source-map@npm:@stackline/inline-source-map'), 'alias guide is missing');
assert(
  compatibility.includes('Preserved public surface') && compatibility.includes('addGeneratedMappings'),
  'compatibility guide is missing the public contract'
);
assert(example.includes("require('@stackline/inline-source-map')"), 'executable example is missing');
assert(html.includes('./analytics.js'), 'documentation analytics is missing');
assert(!app.includes("gtag('event'"), 'playground must not record user input');
assert(image.size > 10000, `documentation image is unexpectedly small: ${image.size} bytes`);
assert(image.size < 500000, `documentation image is too large: ${image.size} bytes`);

for (const [name, value] of Object.entries({ html, llms, llmsFull, migration, compatibility })) {
  assert(!/(127\.0\.0\.1|localhost|verdaccio)/i.test(value), `${name} exposes a private environment`);
}

console.log(JSON.stringify({
  imageBytes: image.size,
  name: metadata.name,
  version: metadata.version
}));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
