# Example: Puppeteer Layout Verification

Core concept: Combine screenshots with DOM geometry to confirm alignment bugs objectively. This reduces false positives from viewport state or visual perception.

## Key Points
- Capture screenshots at both desktop and mobile widths.
- Read `getBoundingClientRect()` for nav/container/button elements.
- Compare center delta and top/bottom gaps to confirm true centering.
- Record computed styles to identify selector conflicts quickly.

## Minimal Example
```js
const nav = document.querySelector('header nav').getBoundingClientRect();
const submit = [...document.querySelectorAll('.nav-tools a')]
  .find((a) => a.textContent.trim() === 'Submit a Resource')
  .getBoundingClientRect();
const centerDelta = (submit.top + submit.height / 2) - (nav.top + nav.height / 2);
```

Reference: `http://localhost:3000/` (validated via Puppeteer MCP)
