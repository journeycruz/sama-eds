<!-- Context: tailwind-to-eds-block/errors | Priority: high | Version: 1.0 | Updated: 2026-03-01 -->
# Errors: EDS Hero Conversion

**Purpose**: Prevent common mistakes seen during Tailwind-to-EDS hero conversion.
**Last Updated**: 2026-03-01

## Core Idea
Most failures come from schema drift, brittle parsing, and visual assumptions that are not runtime-verified. Treat authored content as imperfect input and verify layout with DevTools before changing CSS.

## Key Points
- **Schema drift**: Mixed CTA formats (`primary cta` vs split label/link rows) cause unstable rendering.
- **Brittle parser**: Static DOM assumptions break when authors omit links or reorder rows.
- **False overflow alert**: Flex margins can look off-screen in design tools without true viewport overflow.
- **LCP regression**: Missing explicit eager/lazy choice for hero images can hurt performance.

## Quick Example
```js
const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;
if (!hasOverflow) {
  console.log('No real viewport overflow; check visual alignment intent instead.');
}
```

## 📂 Codebase References

**Error-Prone Areas**:
- `blocks/hero/hero.js` - Row parsing, fallback behavior, CTA normalization.
- `blocks/hero/hero.css` - Gallery offsets and responsive alignment logic.

**Performance Primitive**:
- `scripts/aem.js` - `createOptimizedPicture` controls image loading behavior.

## Deep Dive
**Reference**: https://web.dev/lcp/

## Related
- `examples/resilient-decorate-and-lcp-images.md`
- `lookup/tailwind-to-eds-mapping.md`
