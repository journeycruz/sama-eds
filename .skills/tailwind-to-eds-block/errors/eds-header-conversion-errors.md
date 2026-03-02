<!-- Context: tailwind-to-eds-block/errors | Priority: high | Version: 1.0 | Updated: 2026-03-01 -->
# Errors: EDS Header Conversion

**Purpose**: Prevent common nav/header conversion failures when porting Tailwind patterns into EDS blocks.
**Last Updated**: 2026-03-01

## Core Idea
Most regressions come from fragment parsing assumptions, theme token mismatch across blocks, and CSS cascade order in mode-specific CTA styling.

## Key Points
- **Fragment contract drift**: Brand, primary links, and tools links can move in authored nav fragments.
- **Token mismatch**: Header dark surface using a different token than hero creates visible seams.
- **Cascade conflict**: Base `.button` styles declared after dark-mode styles override intended dark CTA colors.
- **State handling gaps**: Missing Escape close, focus return, or desktop reset causes broken mobile nav behavior.

## Quick Example
```css
/* Keep mode-specific CTA rules after base CTA styles */
.header .button.primary { background: var(--link-color); }

@media (prefers-color-scheme: dark) {
  .header .button.primary { background: var(--color-sunrise); }
}
```

## Verification Checklist
- Light mode: header and hero primary CTA use blue/link token.
- Dark mode: header and hero primary CTA use sunrise accent token.
- Header dark background equals hero dark background token.
- Mobile menu: toggle open/close, overlay close, Escape close, focus return, desktop resize reset.

## Related
- `guides/harvest-implementation-checklist.md`
- `errors/eds-hero-conversion-errors.md`
- `lookup/tailwind-to-eds-mapping.md`
