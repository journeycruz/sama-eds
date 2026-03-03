# San Antonio Mutual Aid Directory

Community-focused resource directory built with AEM Edge Delivery Services.

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Content Model and Authoring

- Canonical resource schema: `docs/content-model.md`
- Validation utilities: `scripts/resource-schema.js`

### Dataset-first workflow

1. Add or update a resource record in the shared dataset.
2. Ensure required fields are present: `id`, `slug`, `name`, `category`, `description`, `lastVerified`.
3. Keep `slug` lowercase kebab-case and unique across all resources.
4. Run validation in your integration path before publish.

With this workflow, new resources appear in listing, detail, and search experiences from one source of truth, without manually assembling individual pages.

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
