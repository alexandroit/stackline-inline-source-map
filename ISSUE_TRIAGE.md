# Issue and Pull Request Triage

Audit date: 2026-08-24

## Open upstream items

| Item | Assessment | Stackline 1.0 action |
| :--- | :--- | :--- |
| Issue #32: release 0.6.4 | Valid; merged release was never published | Base on master and create an independently versioned release candidate |
| Issue #22: Buffer warning | Code fix merged in #25/#29 but issue remains open | Use `Buffer.from`; add browser standard-API fallback |
| Issue #21: source-map 0.7 speed | Valid dependency maintenance request | Validate and adopt current stable `source-map@0.8` |
| PR #31: source-map 0.7.4 | Direction valid, now behind stable 0.8 | Superseded by tested 0.8 integration |
| PR #28: Node >=10 | Valid modernization, stalled after review | Support Node >=12, the dependency's current floor |
| PR #19: finish Tap tests | Behavior already merged through #26 | Replace obsolete Tap suite with portable behavior tests |

## Relevant closed items

| Item | Preserved behavior |
| :--- | :--- |
| Issue #2 / PR #3 | Generated-only mappings omit source and original positions |
| Issue #1 | `sourcesContent` remains supported |
| Issue #6 / PR #13 | Charset parameter uses `charset=` and Unicode is encoded correctly |
| PR #15 | Empty source content remains an empty string |
| PR #16 | Source-map generator behavior is covered by differential tests |
| Issue #18 / PR #26 | Test completion no longer depends on obsolete Tap semantics |
| PR #20 | Proposed mapping names were not merged; deferred to avoid output changes |
| PR #23 | Current `//# sourceMappingURL` syntax is preserved |
| PR #24 | Broad Node 12 rewrite was closed; useful changes were split upstream |
| PR #33 / #34 | Version alignment and 0.6.4 release commit are included in baseline |

## Security review

GitHub Advisory queries for exact npm packages `inline-source-map` and `source-map`
returned no entries. Development-only findings in the upstream test stack are not
reported as runtime vulnerabilities. Stackline security notes distinguish these facts.
