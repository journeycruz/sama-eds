---
name: tailwind-to-eds-block
description: Convert a Tailwind CSS-based HTML block into an AEM Edge Delivery Services (EDS) compatible format. This involves mapping Tailwind classes to EDS styles, building HTML using JS, and ensuring the block is optimized for performance and maintainability in AEM.
---

# Tailwind to EDS Block

Generate a new AEM Edge Delivery Services (EDS) block from an HTML block styled with Tailwind CSS.

## Header/Nav Preflight (Run Before Editing)

Use this checklist whenever the conversion touches a header/nav block:
- Confirm nav fragment contract before coding: identify where brand, primary links, and tool links come from.
- Confirm theme tokens used by adjacent blocks (especially hero) so dark surfaces and CTA variants match exactly.
- Plan CTA mode behavior up front: light mode uses link-blue token, dark mode uses sunrise accent token.
- Reserve a CSS section order for mode overrides after base rules to avoid cascade regressions.
- Include nav interaction coverage in scope: mobile toggle, overlay click close, Escape close, focus return, and desktop resize reset.

## When to Use This Skill

Use this skill when:
- You have an HTML block styled with Tailwind CSS that you want to convert into an EDS block for use in AEM
- You need to map Tailwind utility classes to EDS styles and ensure the block is optimized for performance
- You want to maintain a consistent design system while transitioning from Tailwind to EDS

## Prerequisites
- ✅ An HTML block styled with Tailwind CSS
- A CSS file with the generated CSS from the tailwind block
- ✅ Basic understanding of AEM Edge Delivery Services and how to create blocks
- ✅ Familiarity with JavaScript for building the block's HTML structure using the dom-helpers JS helper. File: @scripts/dom-helpers.js
- ✅ Access to the EDS documentation for reference on available styles and best practices

## Preview Workflow

### Step 1: Analyze the Tailwind Block
- Review the HTML structure of the Tailwind block and identify all the utility classes used.
- Review the Generated CSS file to understand the styles being applied by the Tailwind classes.

### Step 2: Map Tailwind Classes to EDS Styles
- Create a mapping of Tailwind utility classes to their corresponding EDS styles. This may involve identifying equivalent styles in EDS or creating custom styles if necessary. Store global styles in a separate CSS file for maintainability. Organize styles and layers similar to how Tailwind organizes utilities (e.g., layout, typography, spacing).
- Ensure that the mapped styles are optimized for performance and do not include unnecessary styles that may bloat the block.

### Step 3: Build the EDS Block
- Use JavaScript and the dom-helpers JS helper to construct the HTML structure of the EDS block. This involves creating elements, applying the mapped styles, and ensuring that the block is structured in a way that is compatible with AEM's component model.
- Ensure that the block is modular and reusable, following best practices for AEM block development. 

### Step 4: Test and Optimize
- Test the generated EDS block in a local AEM environment to ensure it renders correctly and that the styles are applied as expected.
- Optimize the block for performance by minimizing the CSS and ensuring that it does not include any unnecessary styles or elements. Consider using EDS features such as lazy loading for images or conditional loading of styles to further enhance performance. 

## Header Lessons Learned (Harvested)

- Parse nav fragments defensively. Authoring order can vary, so add fallbacks when locating brand and link lists.
- Verify theme parity across blocks using the exact same tokens. Similar tokens can drift visually in dark mode.
- Treat CTA mode styling as a cascade risk; place dark-mode CTA overrides after base button rules.
- Keep nav accessibility and interaction state explicit (ARIA expanded state, Escape handling, focus target on close, body scroll lock, desktop reset).
- Validate desktop/mobile and light/dark combinations before finalizing.

## Troubleshooting  
- If the block does not render correctly, review the mapping of Tailwind classes to EDS styles to ensure that all necessary styles are included and correctly applied.
- Check the JavaScript code used to build the block for any errors or issues that may be affecting the rendering of the block.
- Refer to the EDS documentation for any specific requirements or best practices that may be relevant to the block you are creating.
- If light/dark CTA colors do not switch as expected, inspect rule order first; a later base `.button` rule can override earlier mode-specific styles.
- If dark header does not match hero, compare token usage directly and align both to the same surface variable.
