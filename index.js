'use strict';

var SourceMapGenerator = require('source-map').SourceMapGenerator;
var hasOwn = Object.prototype.hasOwnProperty;

function offsetMapping(mapping, offset) {
  return {
    line: offset.line + mapping.line,
    column: offset.column + mapping.column
  };
}

function newlinesIn(source) {
  if (!source) return 0;

  var count = 0;
  for (var index = 0; index < source.length; index++) {
    if (source.charCodeAt(index) === 10) count++;
  }
  return count;
}

function encodeBase64(value) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value).toString('base64');
  }

  if (typeof TextEncoder !== 'undefined' && typeof btoa === 'function') {
    var bytes = new TextEncoder().encode(value);
    var binary = '';
    for (var index = 0; index < bytes.length; index++) {
      binary += String.fromCharCode(bytes[index]);
    }
    return btoa(binary);
  }

  throw new Error('No UTF-8 base64 encoder is available in this environment');
}

function Generator(options) {
  options = options || {};
  this.generator = new SourceMapGenerator({
    file: options.file || '',
    sourceRoot: options.sourceRoot || ''
  });
  this.sourcesContent = undefined;
  this.opts = options;
}

Generator.prototype.addMappings = function (sourceFile, mappings, offset) {
  var generator = this.generator;

  offset = offset || {};
  offset.line = hasOwn.call(offset, 'line') ? offset.line : 0;
  offset.column = hasOwn.call(offset, 'column') ? offset.column : 0;

  mappings.forEach(function (mapping) {
    generator.addMapping({
      source: mapping.original ? sourceFile : undefined,
      original: mapping.original,
      generated: offsetMapping(mapping.generated, offset)
    });
  });
  return this;
};

Generator.prototype.addGeneratedMappings = function (sourceFile, source, offset) {
  var mappings = [];
  var linesToGenerate = newlinesIn(source) + 1;

  for (var line = 1; line <= linesToGenerate; line++) {
    var location = { line: line, column: 0 };
    mappings.push({ original: location, generated: location });
  }

  return this.addMappings(sourceFile, mappings, offset);
};

Generator.prototype.addSourceContent = function (sourceFile, sourceContent) {
  this.sourcesContent = this.sourcesContent || Object.create(null);
  this.sourcesContent[sourceFile] = sourceContent;
  return this;
};

Generator.prototype.base64Encode = function () {
  return encodeBase64(this.toString());
};

Generator.prototype.inlineMappingUrl = function () {
  var charset = this.opts.charset || 'utf-8';
  return '//# sourceMappingURL=data:application/json;charset=' + charset + ';base64,' + this.base64Encode();
};

Generator.prototype.toJSON = function () {
  var map = this.generator.toJSON();
  if (!this.sourcesContent) return map;

  var sourcesContent = this.sourcesContent;
  map.sourcesContent = map.sources.map(function (source) {
    return typeof sourcesContent[source] === 'string' ? sourcesContent[source] : null;
  });
  return map;
};

Generator.prototype.toString = function () {
  return JSON.stringify(this);
};

Generator.prototype._mappings = function () {
  return this.generator._mappings._array.map(function (mapping) {
    return {
      generatedLine: mapping.generatedLine,
      generatedColumn: mapping.generatedColumn,
      originalLine: mapping.originalLine === null || typeof mapping.originalLine === 'undefined' ? false : mapping.originalLine,
      originalColumn: mapping.originalColumn === null || typeof mapping.originalColumn === 'undefined' ? false : mapping.originalColumn,
      source: mapping.source === null || typeof mapping.source === 'undefined' ? null : mapping.source,
      name: mapping.name === null || typeof mapping.name === 'undefined' ? null : mapping.name
    };
  });
};

Generator.prototype.gen = function () {
  return this.generator;
};

module.exports = function createGenerator(options) {
  return new Generator(options);
};
module.exports.Generator = Generator;
