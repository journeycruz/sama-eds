<!-- Context: tailwind-to-eds-block/examples | Priority: high | Version: 1.0 | Updated: 2026-03-01 -->
# Example: Resilient Decorate with LCP-Aware Images

**Purpose**: Show tolerant row parsing plus `createOptimizedPicture` loading intent.
**Last Updated**: 2026-03-01

## Core Idea
`decorate(block)` should tolerate missing or imperfect authored rows, then apply explicit eager/lazy image decisions so hero content supports LCP goals.

## Key Points
- Normalize keys and ignore unknown rows instead of failing render.
- Prefer split CTA rows to avoid token parsing ambiguity.
- Set first hero image to eager, remaining gallery images lazy.

## Quick Example
```js
const rows = [...block.querySelectorAll(':scope > div')];
const map = Object.fromEntries(rows.map((r) => [r.children[0]?.textContent.trim().toLowerCase(), r.children[1]]));
const heading = map.heading?.textContent.trim() || 'Fallback heading';
const heroPic = createOptimizedPicture(map['image 1']?.textContent.trim(), heading, true);
const otherPic = createOptimizedPicture(map['image 2']?.textContent.trim(), heading, false);
block.replaceChildren(heroPic, otherPic);
```

## 📂 Codebase References

**Implementation**:
- `blocks/hero/hero.js` - `getConfigRows`, tolerant parsing, and image card creation.

**Utilities**:
- `scripts/aem.js` - `createOptimizedPicture` helper used by blocks.

## Deep Dive
**Reference**: https://www.aem.live/developer/keeping-it-100

## Related
- `concepts/authoring-contract-first.md`
- `errors/eds-hero-conversion-errors.md`
