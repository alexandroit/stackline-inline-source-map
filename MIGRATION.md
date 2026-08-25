# Migration

## Direct package name

```bash
npm install @stackline/inline-source-map
```

```js
const inlineSourceMap = require('@stackline/inline-source-map');
```

## Drop-in npm alias

Keep the original dependency key and imports:

```bash
npm install inline-source-map@npm:@stackline/inline-source-map
```

The resulting manifest entry is equivalent to:

```json
{
  "dependencies": {
    "inline-source-map": "npm:@stackline/inline-source-map@^1.0.0"
  }
}
```

No JavaScript import changes are required.

## Compatibility notes

- Minimum runtime: Node.js 12, matching `source-map@0.8`.
- The factory, `Generator` property, options, chainable methods, JSON shape,
  inline comment syntax, and offset semantics are preserved.
- `_mappings()` returns a snapshot with the legacy `false` representation for
  generated-only original positions. Mutating that snapshot is unsupported.
- Source file names such as `__proto__` now retain their source content.
- Browser bundles may use native `TextEncoder` and `btoa` when `Buffer` is absent.

Run your existing source-map snapshots before adopting. Exact JSON property
order is retained by the current generator but consumers should parse source
maps rather than rely on object key order.
