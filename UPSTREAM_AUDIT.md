# Upstream Audit

Audit date: 2026-08-24 (America/Toronto)

## Sources of truth

- npm registry metadata and downloads API;
- canonical GitHub repository, history, tags, releases, issues, PRs, forks, and code search;
- published tag `v0.6.3` and upstream master commit `427140e`;
- local baseline installs and tests on Node.js `20.20.2` with npm `10.8.2`.

## Package and repository

| Item | Observed state |
| :--- | :--- |
| npm latest | `inline-source-map@0.6.3`, published 2024-02-24 |
| repository head | `427140e`, manifest version `0.6.4`, 2024-09-19 |
| repository status | Public, not archived, 35 stars, 12 forks |
| latest GitHub release | Retrospective `v0.6.3`, 2024-09-19 |
| open release issue | `#32`, requesting publication of merged `0.6.4` |
| runtime dependency on npm | `source-map~0.5.3` |
| runtime dependency on master | `source-map~0.5.7 || ~0.6.1` |
| declared Node support | npm uses nonstandard `engine.node >=0.6` |
| enabled CI matrix | Node.js 0.10, 0.12, 4, 6, and 8 only |
| TypeScript declarations | None |

## Demand snapshot

The official npm downloads API reported:

- `1,317,840` downloads from 2026-08-17 through 2026-08-23;
- `5,191,680` downloads in the requested 2026-07-25 through 2026-08-24 range.

The range contained zero-valued incomplete or anomalous days, so it is retained as
a snapshot and not converted into a per-day forecast.

## Baseline verification

### Published `0.6.3`

- install: completed with 123 packages and 7 development vulnerabilities;
- test: 17/17 assertions passed in `inline-source-map.js`;
- source-content suite: failed because current Node serializes `function foo ()`
  differently from the hardcoded `function foo()` fixture;
- runtime audit evidence: no advisory was found for `inline-source-map` or `source-map`.

### Master `0.6.4`

- install: completed with 296 packages and 26 development vulnerabilities;
- `npm audit --omit=dev`: zero vulnerabilities;
- test: source-content assertions fail on Node 20 for the same fragile function fixture;
- the test stack includes obsolete Tap, NYC, Request, Coveralls, and related packages;
- `source-map@0.8.0` generated equivalent public JSON and inline URL in a focused test;
- `source-map@0.8.0` changes generated-only private mapping fields from `false` to `null`.

## Fork and alternative review

The 13 visible forks are predominantly historical patch branches. The most recent
meaningful fork is collaborator `legobeat/inline-source-map`, which supplied the
merged-but-unpublished upstream maintenance work. No maintained drop-in package with
the same callable API was identified in npm search.

General source-map generators such as `source-map`, `source-map-js`, and
`@jridgewell/gen-mapping` are active alternatives, but require consumers to rebuild
the inline URL and identity-mapping convenience API themselves.

## Conclusion

The project has real active demand and a narrow compatibility surface. The gap is
release reliability, modern runtime verification, typing, and maintenance rather than
an evidenced runtime CVE. Gate 01 is GO with compatibility-first changes.
