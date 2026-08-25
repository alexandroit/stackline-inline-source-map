import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || command + ' failed');
  }
  return result.stdout;
}

const root = new URL('..', import.meta.url).pathname;
const workspace = await mkdtemp(join(tmpdir(), 'stackline-inline-source-map-'));
const artifact = join(workspace, 'artifact');
const consumer = join(workspace, 'consumer');
await mkdir(artifact);
await mkdir(consumer);

const packOutput = run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', artifact], root);
const filename = JSON.parse(packOutput)[0].filename;
const tarball = join(artifact, filename);
await writeFile(join(consumer, 'package.json'), JSON.stringify({
  private: true,
  type: 'commonjs'
}, null, 2));
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], consumer);

await writeFile(join(consumer, 'commonjs.cjs'), [
  "const make = require('@stackline/inline-source-map');",
  "const map = make().addGeneratedMappings('x.js', 'x').toJSON();",
  "if (map.sources[0] !== 'x.js') throw new Error('CommonJS smoke failed');"
].join('\n'));
await writeFile(join(consumer, 'module.mjs'), [
  "import make from '@stackline/inline-source-map';",
  "const map = make().addGeneratedMappings('x.js', 'x').toJSON();",
  "if (map.sources[0] !== 'x.js') throw new Error('ESM smoke failed');"
].join('\n'));
run(process.execPath, ['commonjs.cjs'], consumer);
run(process.execPath, ['module.mjs'], consumer);

const installed = JSON.parse(await readFile(join(consumer, 'node_modules/@stackline/inline-source-map/package.json'), 'utf8'));
if (installed.name !== '@stackline/inline-source-map') throw new Error('Wrong installed package');
console.log('Packed CommonJS and ESM installs verified');
