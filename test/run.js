'use strict';

var assert = require('assert');
var inlineSourceMap = require('..');
var completed = 0;

function test(name, run) {
  try {
    run();
    completed++;
    console.log('ok - ' + name);
  } catch (error) {
    console.error('not ok - ' + name);
    throw error;
  }
}

function decodeInline(url) {
  return JSON.parse(Buffer.from(url.split(';base64,')[1], 'base64').toString('utf8'));
}

test('exports a callable factory and Generator constructor', function () {
  var generator = inlineSourceMap();
  assert.strictEqual(typeof inlineSourceMap, 'function');
  assert.strictEqual(generator.constructor, inlineSourceMap.Generator);
  assert.ok(generator instanceof inlineSourceMap.Generator);
});

test('generates identity mappings for every source line', function () {
  var map = inlineSourceMap({ file: 'bundle.js', sourceRoot: '/src' })
    .addGeneratedMappings('input.js', 'alpha\nbeta\ngamma')
    .toJSON();

  assert.deepStrictEqual(map.sources, ['input.js']);
  assert.strictEqual(map.file, 'bundle.js');
  assert.strictEqual(map.sourceRoot, '/src');
  assert.strictEqual(map.mappings, 'AAAA;AACA;AACA');
});

test('generates one mapping for empty source text', function () {
  assert.strictEqual(inlineSourceMap().addGeneratedMappings('empty.js', '').toJSON().mappings, 'AAAA');
});

test('preserves offset behavior and default-field mutation', function () {
  var offset = { line: 2 };
  var map = inlineSourceMap().addGeneratedMappings('input.js', 'a\nb', offset).toJSON();
  assert.deepStrictEqual(offset, { line: 2, column: 0 });
  assert.strictEqual(map.mappings, ';;AAAA;AACA');
});

test('accepts null-prototype and shadowed ownership offsets', function () {
  var nullOffset = Object.create(null);
  nullOffset.column = 3;
  var shadowed = { line: 1, hasOwnProperty: null };
  assert.strictEqual(inlineSourceMap().addGeneratedMappings('a.js', 'x', nullOffset).toJSON().mappings, 'GAAA');
  assert.strictEqual(inlineSourceMap().addGeneratedMappings('b.js', 'x', shadowed).toJSON().mappings, ';AAAA');
});

test('retains generated-only mappings and legacy diagnostic fields', function () {
  var generator = inlineSourceMap().addMappings('input.js', [
    { generated: { line: 1, column: 0 }, original: { line: 2, column: 1 } },
    { generated: { line: 2, column: 4 } }
  ]);
  var mappings = generator._mappings();
  assert.strictEqual(mappings[1].originalLine, false);
  assert.strictEqual(mappings[1].originalColumn, false);
  assert.strictEqual(mappings[1].source, null);
  assert.strictEqual(generator.toJSON().mappings, 'AACC;I');
});

test('embeds present, missing, and empty source content', function () {
  var generator = inlineSourceMap()
    .addGeneratedMappings('present.js', 'one')
    .addGeneratedMappings('missing.js', 'two')
    .addGeneratedMappings('empty.js', 'three')
    .addSourceContent('present.js', 'one')
    .addSourceContent('empty.js', '');
  assert.deepStrictEqual(generator.toJSON().sourcesContent, ['one', null, '']);
});

test('handles object meta-property names as ordinary source names', function () {
  ['__proto__', 'prototype', 'constructor'].forEach(function (sourceName) {
    var map = inlineSourceMap()
      .addGeneratedMappings(sourceName, 'safe')
      .addSourceContent(sourceName, 'safe')
      .toJSON();
    assert.deepStrictEqual(map.sources, [sourceName]);
    assert.deepStrictEqual(map.sourcesContent, ['safe']);
  });
  assert.strictEqual(Object.prototype.safe, undefined);
});

test('encodes Unicode JSON and default inline charset', function () {
  var source = "const greeting = 'Ola, 世界';";
  var generator = inlineSourceMap()
    .addGeneratedMappings('unicode.js', source)
    .addSourceContent('unicode.js', source);
  var url = generator.inlineMappingUrl();
  assert.ok(url.indexOf('//# sourceMappingURL=data:application/json;charset=utf-8;base64,') === 0);
  assert.strictEqual(decodeInline(url).sourcesContent[0], source);
});

test('uses the configured charset label', function () {
  assert.ok(inlineSourceMap({ charset: 'gbk' }).inlineMappingUrl().indexOf('charset=gbk;base64,') !== -1);
});

test('uses standard web APIs when Buffer is unavailable', function () {
  var savedBuffer = global.Buffer;
  var savedBtoa = global.btoa;
  try {
    global.Buffer = undefined;
    global.btoa = function (value) {
      return savedBuffer.from(value, 'binary').toString('base64');
    };
    var encoded = inlineSourceMap()
      .addGeneratedMappings('browser.js', 'Ola, 世界')
      .addSourceContent('browser.js', 'Ola, 世界')
      .base64Encode();
    assert.strictEqual(JSON.parse(savedBuffer.from(encoded, 'base64').toString('utf8')).sourcesContent[0], 'Ola, 世界');
  } finally {
    global.Buffer = savedBuffer;
    global.btoa = savedBtoa;
  }
});

test('reports an unavailable base64 encoder clearly', function () {
  var savedBuffer = global.Buffer;
  var savedTextEncoder = global.TextEncoder;
  var savedBtoa = global.btoa;
  try {
    global.Buffer = undefined;
    global.TextEncoder = undefined;
    global.btoa = undefined;
    assert.throws(function () {
      inlineSourceMap().base64Encode();
    }, /No UTF-8 base64 encoder/);
  } finally {
    global.Buffer = savedBuffer;
    global.TextEncoder = savedTextEncoder;
    global.btoa = savedBtoa;
  }
});

test('toString delegates to JSON output and gen exposes the generator', function () {
  var generator = inlineSourceMap().addGeneratedMappings('input.js', 'x');
  assert.deepStrictEqual(JSON.parse(generator.toString()), generator.toJSON());
  assert.strictEqual(generator.gen().constructor.name, 'SourceMapGenerator');
});

test('counts large malformed-looking source text in linear output units', function () {
  var lines = new Array(10002).join('\n');
  var map = inlineSourceMap().addGeneratedMappings('large.js', lines).toJSON();
  assert.strictEqual(map.mappings.split(';').length, 10002);
});

console.log('1..' + completed);
