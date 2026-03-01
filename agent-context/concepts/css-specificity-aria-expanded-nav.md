# Concept: Specificity With `aria-expanded` Nav Rules

Core concept: Stateful selectors like `nav[aria-expanded='true']` often outrank base desktop selectors and can accidentally carry mobile alignment into desktop. Resolve this by ordering and scoping rules so desktop overrides remain authoritative.

## Key Points
- Treat `aria-expanded` rules as state modifiers, not layout defaults.
- In desktop media queries, include explicit state overrides when state persists.
- Keep base selector before more specific selector to satisfy stylelint specificity rules.
- Verify with computed styles and geometry, not screenshots alone.

## Minimal Example
```css
@media (width >= 900px) {
  header nav .nav-tools { display: flex; align-self: center; }
  header nav[aria-expanded='true'] .nav-tools { padding-bottom: 0; }
}
```

Reference: `blocks/header/header.css`
