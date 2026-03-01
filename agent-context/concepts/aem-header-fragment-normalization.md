# Concept: AEM Header Fragment Normalization

Core concept: AEM fragments can include an extra `.default-content-wrapper`, so nav parsing must normalize from the true content node, not assume direct children. Robust normalization prevents malformed nav sections and broken mobile/desktop behavior.

## Key Points
- Check for `:scope > .default-content-wrapper` before reading nav nodes.
- Fallback to direct children when wrapper is absent to support multiple authored shapes.
- Split normalized nodes into brand, primary links, and tools consistently.
- Keep normalization logic isolated so CSS and interaction code stay stable.

## Minimal Example
```js
const defaultWrapper = wrapper.querySelector(':scope > .default-content-wrapper');
const nodes = defaultWrapper ? [...defaultWrapper.children] : [...wrapper.children];
const brand = getPreferredBrandNode(nodes);
const lists = nodes.filter((node) => node.matches('ul, ol'));
```

Reference: `blocks/header/header.js`
