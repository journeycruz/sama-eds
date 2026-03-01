# Guide: Sticky Footer Pattern (AEM EDS)

Core concept: Use a flex column page shell so footer stays at viewport bottom on short pages, while naturally flowing below content on long pages. This is the standard low-risk pattern for static and content-driven pages.

## Key Points
- Make `body.appear` a column flex container with `min-height: 100dvh`.
- Allow `main` to grow with `flex: 1 0 auto`.
- Push footer down with `margin-top: auto`.
- Keep footer block styling independent from layout mechanics.

## Minimal Example
```css
body.appear { display: flex; flex-direction: column; min-height: 100dvh; }
main { flex: 1 0 auto; }
footer { margin-top: auto; }
```

Reference: `styles/styles.css`
