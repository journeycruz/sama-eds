<!-- Context: tailwind-to-eds-block/guides | Priority: high | Version: 1.0 | Updated: 2026-03-01 -->
# Guide: Harvest Implementation Checklist

**Purpose**: Reduce iteration time when converting Tailwind hero patterns into EDS blocks.
**Last Updated**: 2026-03-01

## Core Idea
Most rework comes from late decisions on schema, breakpoints, and ownership boundaries. Run a short pre-implementation checklist before writing block JS/CSS.

## Key Points
- Lock schema up front: canonical row keys, required/optional fields, deprecation rules.
- Run breakpoint parity checks at mobile/tablet/desktop, including off-screen edge behavior.
- Decide ownership early: global `header`/nav block vs hero-owned nav content.
- Capture visual regression snapshots for `/` and `/drafts/hero/hero.html` before refactors.
- Confirm Chrome DevTools runtime checks are available before overflow/layout debugging.

## Quick Example
```bash
# Baseline snapshots before refactor
open http://localhost:3000/
open http://localhost:3000/drafts/hero/hero.html
# Capture desktop/tablet/mobile screenshots in DevTools
```

## 📂 Codebase References

**Implementation Targets**:
- `blocks/hero/hero.js` - Main conversion logic and parser behavior.
- `blocks/hero/hero.css` - Breakpoint parity and edge spacing behavior.

**Ownership Boundary**:
- `blocks/header/header.js` - Global navigation ownership point.

## Deep Dive
**Reference**: https://developer.chrome.com/docs/devtools

## Related
- `lookup/tailwind-to-eds-mapping.md`
- `errors/eds-hero-conversion-errors.md`
