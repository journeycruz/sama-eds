---
name: tailwind-to-eds-block
description: Convert a Tailwind CSS-based HTML block into an AEM Edge Delivery Services (EDS) compatible format. This involves mapping Tailwind classes to EDS styles, building HTML using JS, and ensuring the block is optimized for performance and maintainability in AEM.
---

# Tailwind to EDS Block

Generate a new AEM Edge Delivery Services (EDS) block from an HTML block styled with Tailwind CSS.

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

## Troubleshooting  
- If the block does not render correctly, review the mapping of Tailwind classes to EDS styles to ensure that all necessary styles are included and correctly applied.
- Check the JavaScript code used to build the block for any errors or issues that may be affecting the rendering of the block.
- Refer to the EDS documentation for any specific requirements or best practices that may be relevant to the block you are creating.
