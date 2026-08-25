# Contributing

Focused issues and pull requests are welcome.

## Requirements

- Node.js 20.19 or newer for development;
- npm with lockfile support;
- no new runtime dependency without a documented compatibility reason.

## Setup

```bash
npm ci
npm test
npm run audit:dependencies
```

## Change expectations

- Preserve the callable CommonJS export and all generator methods.
- Add a regression test for every behavior change.
- Compare normal inputs with upstream `inline-source-map@0.6.3`.
- Test generated-only mappings, source content, offsets, Unicode, and browser base64.
- Update declarations and migration docs with public API changes.
- Preserve the original MIT notice and fork attribution.

Performance claims require repeatable measurements and correctness assertions.
