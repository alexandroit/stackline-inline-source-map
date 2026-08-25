# @stackline/inline-source-map

> A maintained, typed, `inline-source-map`-compatible generator for modern
> Node.js and browser build pipelines.

[![npm version](https://img.shields.io/npm/v/@stackline/inline-source-map.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/inline-source-map)
[![npm downloads](https://img.shields.io/npm/dm/@stackline/inline-source-map.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/inline-source-map)
[![CI](https://img.shields.io/github/actions/workflow/status/alexandroit/stackline-inline-source-map/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/alexandroit/stackline-inline-source-map/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@stackline/inline-source-map.svg?style=flat-square)](LICENSE)

**[Docs and playground](https://alexandro.net/docs/vanilla/inline-source-map/)** |
**[npm](https://www.npmjs.com/package/@stackline/inline-source-map)** |
**[GitHub](https://github.com/alexandroit/stackline-inline-source-map)** |
**[Migration](MIGRATION.md)** |
**[Security](SECURITY.md)** |
**[Changelog](CHANGELOG.md)**

**Current package version:** `1.0.1`

## Why this package?

`inline-source-map` remains embedded in build tools and transpilers, but its
published package still targets an old source-map generator and its upstream
test workflow does not exercise modern Node.js releases.

This fork preserves the compact CommonJS API while adding:

- current `source-map` generation through `source-map@0.8`;
- CommonJS, Node ESM, TypeScript, and browser-bundle verification;
- TypeScript declarations without changing the JavaScript call shape;
- null-prototype storage for source file names such as `__proto__`;
- UTF-8 base64 encoding in browsers with no global `Buffer`;
- reproducible package, compatibility, coverage, and install tests;
- preserved MIT attribution to the original project.

No runtime security advisory is claimed for the upstream package. This fork is
about maintained compatibility, modern verification, and defensive defaults.

## Compatibility at a glance

| Item | Value |
| :--- | :--- |
| Package | `@stackline/inline-source-map@1.0.1` |
| API baseline | `inline-source-map@0.6.3` |
| Runtime | Node.js 12+, browser bundles |
| Modules | Callable CommonJS with Node ESM default import |
| Types | First-party TypeScript declarations |
| Runtime dependencies | One maintained source-map generator |

## Installation

Install under the public Stackline name:

```bash
npm install @stackline/inline-source-map
```

Or replace the original package without changing imports:

```bash
npm install inline-source-map@npm:@stackline/inline-source-map
```

Existing CommonJS remains unchanged:

```js
const inlineSourceMap = require('inline-source-map');
```

## Quick start

```js
const inlineSourceMap = require('@stackline/inline-source-map');

const source = [
  'const answer = 42;',
  'console.log(answer);'
].join('\n');

const map = inlineSourceMap({ file: 'bundle.js' })
  .addGeneratedMappings('answer.js', source)
  .addSourceContent('answer.js', source);

const output = source + '\n' + map.inlineMappingUrl();
```

## ESM

Node.js exposes the callable CommonJS export as the default import:

```js
import inlineSourceMap from '@stackline/inline-source-map';

const map = inlineSourceMap().addGeneratedMappings('input.js', 'let x = 1;');
```

The package intentionally retains one CommonJS implementation instead of
shipping divergent ESM and CommonJS code paths.

## API

### `inlineSourceMap(options?)`

Creates a `Generator`. Supported options are `file`, `sourceRoot`, and
`charset`. The default charset label is `utf-8`.

### `generator.addGeneratedMappings(sourceFile, source, offset?)`

Adds an identity mapping for every source line. As in the original package,
line and column offsets are applied to every generated mapping.

### `generator.addMappings(sourceFile, mappings, offset?)`

Adds supplied generated/original positions. A mapping without `original`
produces a generated-only source-map segment.

### `generator.addSourceContent(sourceFile, sourceContent)`

Embeds source text. File names are stored in a null-prototype dictionary, so
special JavaScript object names are handled as ordinary source names.

### Output methods

- `toJSON()` returns the version 3 source-map object;
- `toString()` returns its compact JSON representation;
- `base64Encode()` returns the UTF-8 JSON as base64;
- `inlineMappingUrl()` returns the complete `//# sourceMappingURL=...` comment;
- `gen()` returns the underlying `SourceMapGenerator`.

`_mappings()` is retained for compatibility and returns a diagnostic snapshot.
Code should prefer `toJSON()` because underscore-prefixed internals are not a
stable extension point in the underlying `source-map` project.

## TypeScript

The package includes declarations for the callable export and `Generator`:

```ts
import inlineSourceMap = require('@stackline/inline-source-map');

const generator: inlineSourceMap.Generator = inlineSourceMap({
  file: 'bundle.js'
});
```

## Browser bundles

Bundle the package with Browserify, esbuild, Rollup, Vite, or webpack. The
package's `browser` field selects a prebuilt CommonJS entry that contains only
the generator path and uses the browser's global `URL`. The base64 path uses
`Buffer` when available and standard `TextEncoder` plus `btoa` in browsers. No
browser global is installed by the package.

## Compatibility

The JavaScript runtime supports Node.js 12 and newer. Development tooling uses
Node.js 20.19 or newer. See [COMPATIBILITY_CONTRACT.md](COMPATIBILITY_CONTRACT.md)
for the exact preserved behaviors and [MIGRATION.md](MIGRATION.md) for alias
installation.

## Release evidence

The release gate verifies:

- 14 focused regression tests;
- five differential compatibility scenarios against `inline-source-map@0.6.3`;
- 100% line, statement, and function coverage;
- Node.js 12, 14, 16, 18, 20, 22, and 24;
- TypeScript 3.9, 4.7, 4.9, 5.9, 6.0, and 7.0;
- CommonJS, ESM, browser, packed install, `publint`, and type export checks.

The interactive [documentation playground](https://alexandro.net/docs/vanilla/inline-source-map/)
runs the production browser bundle and exposes the generated Source Map v3 JSON.

## Trust and maintenance

- Every release is built from the public repository.
- CI validates runtime compatibility, types, package exports, and clean installs.
- Security reports use the private process in [SECURITY.md](SECURITY.md).
- License and upstream attribution remain in [LICENSE](LICENSE), [NOTICE](NOTICE),
  and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## Provenance

This is an independent maintained fork of Thorsten Lorenz's MIT-licensed
[`inline-source-map`](https://github.com/thlorenz/inline-source-map). The
original copyright and license text are preserved in [LICENSE](LICENSE), with
additional attribution in [NOTICE](NOTICE).
