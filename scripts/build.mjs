import { mkdir, readFile, rm, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { build } from 'esbuild';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const requiredFiles = [
  'index.js',
  'index.d.ts',
  'LICENSE',
  'NOTICE',
  'README.md',
  'SECURITY.md',
  'MIGRATION.md'
];
const root = new URL('..', import.meta.url);

if (packageJson.name !== '@stackline/inline-source-map') {
  throw new Error('Unexpected package name');
}
if (packageJson.main !== './index.js' || packageJson.types !== './index.d.ts') {
  throw new Error('Package entry points do not match the compatibility contract');
}

for (const file of requiredFiles) {
  await stat(new URL('../' + file, import.meta.url));
}

const syntax = spawnSync(process.execPath, ['--check', 'index.js'], {
  cwd: root,
  encoding: 'utf8'
});
if (syntax.status !== 0) {
  throw new Error(syntax.stderr || syntax.stdout || 'Syntax validation failed');
}

const dist = new URL('../dist', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist);
await build({
  entryPoints: [new URL('../index.js', import.meta.url).pathname],
  outfile: new URL('../dist/browser.cjs', import.meta.url).pathname,
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  legalComments: 'eof',
  plugins: [{
    name: 'browser-url-global',
    setup(context) {
      context.onResolve({ filter: /^url$/ }, function () {
        return { path: 'url-global', namespace: 'stackline-shim' };
      });
      context.onLoad({ filter: /.*/, namespace: 'stackline-shim' }, function () {
        return {
          contents: 'module.exports = URL; module.exports.URL = URL;',
          loader: 'js'
        };
      });
    }
  }]
});

console.log('Source-first package build verified');
