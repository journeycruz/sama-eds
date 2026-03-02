<!-- Context: tailwind-to-eds-block/lookup | Priority: high | Version: 1.0 | Updated: 2026-03-01 -->
# Lookup: Tailwind-to-EDS Mapping

**Purpose**: Quick mapping aid for intent-preserving conversion.
**Last Updated**: 2026-03-01

## Core Idea
Tailwind classes encode layout intent that must be rebuilt explicitly in block-scoped CSS and EDS tokens. Keep a compact mapping table plus breakpoint checks to avoid guesswork.

## Key Points
- Map utility intent (layout/spacing/typography/state), not one-to-one class strings.
- Validate parity at `>=600`, `>=900`, and `>=1200` breakpoints used in this repo.
- Track decorative layers in one source of truth to prevent duplicate gradients/rings.
- Record edge behavior separately (intentional viewport bleed vs real overflow).

## Quick Example
```text
lg:flex          -> @media (width >= 900px) { display:flex; }
gap-x-8          -> column gap var in scoped container
sm:-mt-44        -> tablet-only negative offset at >=600px
text-sm/6        -> size + line-height pair from project tokens
```

## 📂 Codebase References

**Implementation**:
- `blocks/hero/hero.css` - Scoped responsive translation of Tailwind intent.
- `styles/styles.css` - Shared variables/tokens used by block CSS.

**Source Pattern**:
- `drafts/hero/hero.html` - Original utility-driven structure.

## Deep Dive
**Reference**: https://www.aem.live/developer/block-collection

## Related
- `guides/harvest-implementation-checklist.md`
- `concepts/authoring-contract-first.md`
