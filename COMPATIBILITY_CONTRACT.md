# Compatibility Contract

Reference: `inline-source-map@0.6.3` plus merged upstream master `0.6.4`.

## Preserved public surface

- `require(package)` returns a callable factory.
- `factory.Generator` exposes the constructor.
- Calling the factory without `new` returns a `Generator` instance.
- Options: `file`, `sourceRoot`, and `charset`.
- Methods: `addMappings`, `addGeneratedMappings`, `addSourceContent`,
  `base64Encode`, `inlineMappingUrl`, `toJSON`, `toString`, `_mappings`, and `gen`.
- Add methods return the same generator for chaining.
- Empty source text still generates one identity mapping.
- A supplied offset applies line and column to every generated mapping.
- Missing offset fields are written back as zero to a supplied mutable offset.
- Mappings without `original` remain generated-only segments.
- Missing or non-string source content appears as `null`.
- Empty string source content remains an empty string.
- Inline comments use `//#`, `charset=<value>`, and base64 JSON.
- `toString()` is the compact JSON serialization of `toJSON()`.

## Intentional compatible improvements

- Null-prototype and shadowed-`hasOwnProperty` offsets no longer throw solely
  because of the ownership check.
- `__proto__`, `prototype`, and `constructor` source names retain content safely.
- Browsers can encode UTF-8 without a Buffer polyfill.
- TypeScript declarations are additive.
- Node ESM default import is verified against the CommonJS implementation.

## Underlying generator update

`gen()` returns `SourceMapGenerator` from `source-map@0.8`. Its generator methods are
compatible with the methods used by this package. Consumer-only APIs in `source-map`
are outside this package's contract.

`_mappings()` is retained as a diagnostic snapshot. Generated-only original fields
are normalized to legacy `false`; mutations to the returned array are not propagated
to the underlying generator.

## Explicit non-goals for 1.x

- No new mapping-name behavior; upstream ignored `mapping.name` and this release does too.
- No change to the unusual all-lines column offset behavior.
- No automatic input-size limit; callers own trust-boundary limits.
- No browser global or CDN-specific build.

The package does include a bundler-selected CommonJS browser entry; it does not
install a global variable or promise direct script-tag loading.
