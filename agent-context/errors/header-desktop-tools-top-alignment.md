# Error: Header Desktop Tools Top-Aligned

Core concept: On desktop, nav tool items appeared pinned to the top because a more specific expanded-state selector overrode intended centering rules.

## Key Points
- Symptom: `Submit a Resource` had a negative center delta against nav center.
- Cause: `header nav[aria-expanded='true'] .nav-tools` overrode desktop base rule.
- Fix: add desktop scoped expanded-state override and reorder selectors.
- Validation: center delta reached `0`, with equal top/bottom gaps.

## Minimal Example
```css
@media (width >= 900px) {
  header nav .nav-tools { display: flex; align-self: center; }
  header nav[aria-expanded='true'] .nav-tools { padding-bottom: 0; }
}
```

Reference: `blocks/header/header.css`
