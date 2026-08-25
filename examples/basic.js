'use strict';

var inlineSourceMap = require('..');
var source = "const message = 'hello';\nconsole.log(message);";
var generator = inlineSourceMap({ file: 'bundle.js' })
  .addGeneratedMappings('example.js', source)
  .addSourceContent('example.js', source);
var output = source + '\n' + generator.inlineMappingUrl();

if (generator.toJSON().sourcesContent[0] !== source) {
  throw new Error('Example source content was not embedded');
}

console.log(output);
