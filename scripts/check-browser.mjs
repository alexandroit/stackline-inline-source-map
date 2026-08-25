import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const code = await readFile(new URL('../dist/browser.cjs', import.meta.url), 'utf8');
const context = {
  URL,
  TextEncoder,
  module: { exports: {} },
  btoa(value) {
    return Buffer.from(value, 'binary').toString('base64');
  }
};
vm.createContext(context);
vm.runInContext(code, context);

const source = "const greeting = 'Ola, 世界';";
const generator = context.module.exports()
  .addGeneratedMappings('browser.js', source)
  .addSourceContent('browser.js', source);
const encoded = generator.inlineMappingUrl().split(';base64,')[1];
const map = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
assert.equal(map.sourcesContent[0], source);
assert.ok(code.length > 0);

console.log('Browser bundle verified without a Buffer global');
