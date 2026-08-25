# Adoption Targets

No repository has been contacted. Targets were selected from GitHub's current code
index and verified against repository metadata on 2026-08-24.

| Target | Evidence | Candidate migration |
| :--- | :--- | :--- |
| `thlorenz/convert-source-map` | Direct dev dependency; repository pushed 2025-03-27 | Project 02 uses a development alias after Gate 01 |
| `thlorenz/combine-source-map` | Direct runtime dependency; core cluster consumer | Project 03 uses a runtime alias after Gates 01 and 02 |
| `xframes-project/xframes` | Direct `^0.6.3`; repository pushed 2026-03-21 | Alias dependency and run wasm/browser build suite |
| `GridProtectionAlliance/PQDashboard` | Direct pinned `0.6.2`; repository pushed 2026-08-10 | Alias dependency and run dashboard build |
| `concord-consortium/codap-data-interactives` | Direct `^0.6.2`; repository pushed 2026-08-05 | Alias dependency and run onboarding builds |

Search results that only mention the string as configuration, vendored files, lockfile
content, or inactive tutorials are excluded from the active target count.

## Measurable adoption proof

A future adoption candidate is successful only when its clean install, test, and build
pass with the npm alias and no source import edits. External issues or pull requests
require separate authorization.
