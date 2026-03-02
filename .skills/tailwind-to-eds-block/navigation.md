<!-- Context: tailwind-to-eds-block/navigation | Priority: critical | Version: 1.1 | Updated: 2026-03-01 -->
# Tailwind-to-EDS-Block Navigation

**Purpose**: Fast routes for converting Tailwind examples into resilient, performant EDS blocks.

## Core Idea
Use this file as the entrypoint: load concept first, then mapping, then implementation and error handling. This sequence minimizes schema churn and breakpoint regressions.

## Key Points
- Start with contract/schema context before editing JS or CSS.
- Keep utility-intent mapping nearby during CSS translation.
- Validate runtime behavior with snapshots and DevTools checks.

## Quick Example
```text
1) concepts -> 2) lookup -> 3) guides -> 4) examples/errors
```

**Reference**: https://www.aem.live/docs/

---

## Concepts
| File | Description | Priority |
|------|-------------|----------|
| `concepts/authoring-contract-first.md` | Lock schema before visuals | critical |

## Examples
| File | Description | Priority |
|------|-------------|----------|
| `examples/resilient-decorate-and-lcp-images.md` | Tolerant parsing + image loading intent | high |

## Guides
| File | Description | Priority |
|------|-------------|----------|
| `guides/harvest-implementation-checklist.md` | Pre-build checklist to reduce rework | high |

## Lookup
| File | Description | Priority |
|------|-------------|----------|
| `lookup/tailwind-to-eds-mapping.md` | Utility-intent mapping and breakpoints | high |

## Errors
| File | Description | Priority |
|------|-------------|----------|
| `errors/eds-hero-conversion-errors.md` | Common conversion failures and fixes | high |
| `errors/eds-header-conversion-errors.md` | Header/nav conversion pitfalls and fixes | high |

---

## Loading Strategy
1. Start with `concepts/authoring-contract-first.md`.
2. Use `lookup/tailwind-to-eds-mapping.md` while porting CSS.
3. Apply `guides/harvest-implementation-checklist.md` before/after implementation.
4. Use `examples/resilient-decorate-and-lcp-images.md`, `errors/eds-hero-conversion-errors.md`, and `errors/eds-header-conversion-errors.md` during debugging.

## 📂 Codebase References
- `blocks/hero/hero.js` - Decorator, row parsing, CTA normalization.
- `blocks/hero/hero.css` - Breakpoint and layout intent implementation.
- `drafts/hero/hero.html` - Tailwind source pattern for conversion.
