# Dependency Decisions

Snapshot date: 2026-08-24. Versions are exact development pins; runtime uses a
compatible minor range only for the strongly owned Mozilla package.

| Class | Package | Upstream/current | Latest observed | Maintenance and advisory evidence | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- |
| runtime | `source-map` | `~0.5.3` npm / `~0.6.1` master | `0.8.0` | Mozilla repository; 0.8 published 2026-07-20; no GitHub Advisory match | Use `^0.8.0`; test JSON, private mapping normalization, browser bundle, and Node floor |
| dev reference | `inline-source-map` | `0.6.3` | `0.6.3` npm | Canonical compatibility oracle; no advisory match | Pin `0.6.3`; differential tests only |
| dev quality | `@arethetypeswrong/cli` | none | `0.18.5` | Active package-quality tool; Node >=20 | Pin for packed declaration checks |
| dev coverage | `c8` | old NYC through Tap | `12.0.0` | Active V8 coverage; Node >=20.19 | Replace obsolete transitive coverage stack |
| dev bundle | `esbuild` | none | `0.28.2` | Active bundler; Node >=18 | Pin for real browser bundle execution |
| dev lint | `eslint` | none | `10.9.1` | Active foundation project; Node >=20.19 | Pin for static checks |
| dev package | `publint` | none | `0.3.24` | Active package manifest validator; Node >=18 | Pin for tarball metadata validation |
| dev types | `typescript` | none | `7.0.2` | Active compiler; Node >=16.20 | Pin latest locally; CI checks older compiler compatibility separately |
| removed dev | `tap` | `~0.7` npm / `~5.4.5` master | `21.7.5` | Upstream versions pull deprecated and vulnerable tooling | Remove; use a dependency-free runtime test harness |
| removed dev | `nave` | `~0.5` npm / `^3.5.2` master | `3.5.6` installed | Last npm line is old; CI can use setup-node | Remove |

## Ownership risk

The sole runtime dependency belongs to Mozilla's long-running source-map project and
has a broad maintainer set. It is not owned by the original `inline-source-map`
maintainers. The package is pinned by the lockfile for development and constrained to
the 0.8 line for consumers. Replacing the proven generator with local VLQ code would
increase correctness and maintenance risk, so zero runtime dependencies is rejected.

## Final audit

The locked candidate resolves `source-map@0.8.0`. `npm audit` reported zero
findings across 218 resolved production, development, and optional packages.
`npm audit signatures` verified 174 registry signatures and 26 attestations.
