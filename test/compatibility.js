'use strict';

var assert = require('assert');
var upstream = require('inline-source-map');
var candidate = require('..');

var scenarios = [
  { options: {}, source: 'one', sourceFile: 'one.js' },
  { options: { file: 'bundle.js' }, source: 'one\ntwo', sourceFile: 'two.js' },
  { options: { sourceRoot: '/src', charset: 'utf-8' }, source: '', sourceFile: 'empty.js' },
  { options: {}, source: 'first\nsecond\nthird', sourceFile: 'offset.js', offset: { line: 3, column: 2 } }
];

scenarios.forEach(function (scenario, index) {
  var upstreamOffset = scenario.offset && { line: scenario.offset.line, column: scenario.offset.column };
  var candidateOffset = scenario.offset && { line: scenario.offset.line, column: scenario.offset.column };
  var expected = upstream(scenario.options)
    .addGeneratedMappings(scenario.sourceFile, scenario.source, upstreamOffset)
    .addSourceContent(scenario.sourceFile, scenario.source);
  var actual = candidate(scenario.options)
    .addGeneratedMappings(scenario.sourceFile, scenario.source, candidateOffset)
    .addSourceContent(scenario.sourceFile, scenario.source);

  assert.deepStrictEqual(actual.toJSON(), expected.toJSON(), 'JSON scenario ' + index);
  assert.strictEqual(actual.toString(), expected.toString(), 'string scenario ' + index);
  assert.strictEqual(actual.inlineMappingUrl(), expected.inlineMappingUrl(), 'URL scenario ' + index);
});

var generatedOnly = [
  { generated: { line: 1, column: 0 }, original: { line: 1, column: 0 } },
  { generated: { line: 2, column: 4 } }
];
assert.deepStrictEqual(
  candidate().addMappings('mixed.js', generatedOnly).toJSON(),
  upstream().addMappings('mixed.js', generatedOnly).toJSON()
);

console.log('Compatibility scenarios passed: ' + (scenarios.length + 1));
