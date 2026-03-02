<!-- Context: tailwind-to-eds-block/concepts | Priority: critical | Version: 1.0 | Updated: 2026-03-01 -->
# Concept: Authoring Contract First

**Purpose**: Define the authored row schema before visual implementation.
**Last Updated**: 2026-03-01

## Core Idea
In EDS block work, the content contract is the source of truth and visuals are an output. Lock canonical row keys and CTA semantics early so `decorate(block)` can stay stable while CSS evolves.

## Key Points
- Canonical keys reduce parser branching (`primary cta label` + `primary cta link` over overloaded text).
- Mark required vs optional fields before coding to avoid silent fallback bugs.
- Set deprecation policy for old keys so authored content can migrate safely.
- Keep header/nav ownership explicit (global `header` block vs in-block rows).

## Quick Example
```js
const schema = {
  required: ['heading', 'body', 'primary cta label', 'primary cta link'],
  optional: ['secondary cta label', 'secondary cta link', 'image 1'],
};
const isKnownKey = (k) => [...schema.required, ...schema.optional].includes(k);
```

## 📂 Codebase References

**Implementation**:
- `blocks/hero/hero.js` - Row-key parsing and CTA normalization.

**Related Authoring Surface**:
- `drafts/hero/hero.html` - Source structure that informed contract.

## Deep Dive
**Reference**: https://www.aem.live/developer/markup-sections-blocks

## Related
- `guides/harvest-implementation-checklist.md`
- `lookup/tailwind-to-eds-mapping.md`
