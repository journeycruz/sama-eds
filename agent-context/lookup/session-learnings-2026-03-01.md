# Lookup: Session Learnings (2026-03-01)

Core concept: This lookup captures high-value implementation checkpoints from the session for fast reuse by future agents.

## Key Points
- Header nav parsing required wrapper-aware normalization in `header.js`.
- Desktop nav tool alignment required explicit override of expanded-state rules.
- Submit CTA shape stabilized by using `inline-flex`, fixed min-height, and pill radius.
- Sticky footer required page-shell flex layout in global styles.
- Footer polish benefited from semantic helper classes added in `footer.js`.

## Minimal Example
```text
Priority debug sequence:
1) Reproduce in browser
2) Capture screenshot
3) Measure geometry/computed styles
4) Patch selector ordering/scope
5) Re-verify + lint
```

Reference: `blocks/header/header.js`, `blocks/header/header.css`, `styles/styles.css`, `blocks/footer/footer.js`, `blocks/footer/footer.css`
