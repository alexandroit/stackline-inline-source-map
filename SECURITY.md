# Security Policy

## Supported versions

| Version | Security updates |
| :--- | :---: |
| `1.x` | Yes |
| `< 1.0.0` | No public releases |

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use the repository's
[private security advisory form](https://github.com/alexandroit/stackline-inline-source-map/security/advisories/new).

Include the affected version, a minimal source or mapping input, impact, Node
or browser runtime, bundler when relevant, and any proposed mitigation. We aim
to acknowledge complete reports within three business days.

## Security contract

- Source file names are stored in null-prototype dictionaries.
- `__proto__`, `prototype`, and `constructor` are treated as valid file names,
  not object traversal instructions.
- Offset property ownership uses an intrinsic method, not input-controlled code.
- Newline counting is linear in source length and does not allocate a match array.
- The package does not fetch mappings, source files, or WebAssembly at generation time.

A source with many lines intentionally creates many mappings. Applications
accepting untrusted source text must impose input-size limits appropriate to
their own memory budget.
