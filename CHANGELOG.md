# Changelog

## [1.0.2] - 2026-09-28

- Organize package documentation, preserve API and migration examples, and add Stackline community links.
- Improve package discovery keywords with precise domain terms and `stackline`.
- Pin GitHub Actions release tooling and require an explicit missing-version response before publication.


All notable changes are documented here. This project follows Semantic
Versioning.

## [1.0.1] - 2026-08-25

### Added

- Public interactive documentation and AI-oriented `llms.txt` references.
- Gold-standard repository metadata, issue templates, CI, CodeQL, and release
  automation.
- Explicit release evidence and public adoption guidance in the README.

### Changed

- Pointed package metadata to the canonical Alexandro.Net documentation.

The JavaScript implementation and public API are unchanged from `1.0.0`.

## [1.0.0] - 2026-08-24

### Added

- First Stackline release based on `inline-source-map` `0.6.4` upstream code.
- TypeScript declarations for the callable factory and generator methods.
- Modern Node.js, ESM-import, browser-bundle, package, and alias migration tests.
- Public security, compatibility, migration, contribution, and release docs.
- UTF-8 browser base64 fallback using standard web APIs.

### Changed

- Updated the maintained source-map generator from `0.6.1` to `0.8.0`.
- Replaced regular-expression newline counting with a linear constant-space scan.
- Replaced the legacy vulnerable test stack with current development tooling.

### Security

- Source content now uses a null-prototype dictionary, preserving dangerous-looking
  file names without invoking `Object.prototype` setters.
- Offset ownership checks no longer call an input-controlled `hasOwnProperty`.

No runtime vulnerability is attributed to upstream by this release.
