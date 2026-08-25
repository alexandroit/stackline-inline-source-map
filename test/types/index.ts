import inlineSourceMap = require('../..');

const options: inlineSourceMap.Options = {
  file: 'bundle.js',
  sourceRoot: '/src',
  charset: 'utf-8'
};

const generator: inlineSourceMap.Generator = inlineSourceMap(options);
const chained = generator
  .addMappings('input.ts', [
    {
      generated: { line: 1, column: 0 },
      original: { line: 1, column: 0 }
    },
    { generated: { line: 2, column: 0 } }
  ], { line: 1 })
  .addGeneratedMappings('other.ts', 'const value = 1;')
  .addSourceContent('input.ts', 'const value: number = 1;');

const map: inlineSourceMap.SourceMap = chained.toJSON();
const encoded: string = chained.base64Encode();
const url: string = chained.inlineMappingUrl();
const mappings: inlineSourceMap.InternalMapping[] = chained._mappings();
const direct = new inlineSourceMap.Generator();

void map;
void encoded;
void url;
void mappings;
void direct;
