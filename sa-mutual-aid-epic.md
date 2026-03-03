# Epic: San Antonio Mutual Aid Directory

**Product Vision:** Build a fast, accessible, community-driven mutual aid directory for San Antonio, Texas — connecting residents with food, housing, healthcare, legal, and emergency resources across the city.

**Repository:** `journeycruz/sama-eds`
**Stack:** AEM Edge Delivery Services (vanilla JS, CSS, HTML — no build step)
**Environments:**

| Environment | URL |
|-------------|-----|
| Local Dev | `http://localhost:3000` |
| Feature Preview | `https://{branch}--sama-eds--journeycruz.aem.page/` |
| Production Preview | `https://main--sama-eds--journeycruz.aem.page/` |
| Production Live | `https://main--sama-eds--journeycruz.aem.live/` |
| Custom Domain (goal) | `https://samutualaid.org` (or similar) |

---

## Story Map

Stories are sequenced so each one delivers a testable increment. The first stories establish foundation, the middle stories build core directory functionality, and the final stories handle polish, SEO, and go-live.

| # | Story | Branch | Depends On |
|---|-------|--------|------------|
| 1 | Project Identity & Design Tokens | `story/1-design-tokens` | — |
| 2 | Site Navigation & Footer | `story/2-nav-footer` | 1 |
| 3 | Homepage Hero & Mission | `story/3-homepage` | 2 |
| 4 | Resource Category Cards | `story/4-category-cards` | 2 |
| 5 | Resource Listing Block | `story/5-resource-listing` | 2 |
| 6 | Resource Detail Block | `story/6-resource-detail` | 5 |
| 7 | Search & Filter Block | `story/7-search-filter` | 5 |
| 8 | Test Content — Full Directory Data | `story/8-test-content` | 4, 5, 6, 7 |
| 9 | Accessibility & Performance Audit | `story/9-a11y-perf` | 8 |
| 10 | SEO, Sitemap & Open Graph | `story/10-seo` | 8 |
| 11 | CDN Configuration & Custom Domain | `story/11-cdn-domain` | 9, 10 |
| 12 | Go-Live Checklist & Launch | `story/12-go-live` | 11 |

---

## Content Architecture

### Resource Categories (initial MVP)

1. **Food & Groceries** — food banks, community fridges, SNAP enrollment, hot meals
2. **Housing & Shelter** — emergency shelters, rent assistance, transitional housing
3. **Healthcare** — free clinics, mental health, substance use, dental, vision
4. **Legal Aid** — immigration, tenant rights, family law, expungement
5. **Financial Assistance** — utility help, emergency cash, tax prep
6. **Family & Children** — childcare, WIC, school supplies, parenting support
7. **Employment & Education** — job training, GED, ESL, resume help
8. **Crisis & Safety** — domestic violence, hotlines, disaster relief

### Content Model — Single Resource

Each resource is authored as a page in the CMS (or as a static HTML file during development). The following fields map to the authored content structure:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | H1 heading | Yes | Organization or program name |
| Category | Metadata | Yes | One of the 8 categories above |
| Description | Paragraph(s) | Yes | What the resource provides |
| Address | Paragraph | No | Street address in San Antonio |
| Phone | Link (`tel:`) | No | Primary contact number |
| Website | Link (`https:`) | No | External website |
| Hours | Paragraph | No | Operating hours |
| Languages | Metadata | No | e.g. "English, Spanish" |
| Eligibility | Paragraph | No | Who qualifies |
| Tags | Metadata | No | Comma-separated for filtering |
| Last Verified | Metadata | Yes | Date resource was last confirmed accurate |

### Page Hierarchy

```
/                           → Homepage (hero + mission + featured categories)
/food                       → Food & Groceries category listing
/housing                    → Housing & Shelter category listing
/healthcare                 → Healthcare category listing
/legal                      → Legal Aid category listing
/financial                  → Financial Assistance category listing
/family                     → Family & Children category listing
/employment                 → Employment & Education category listing
/crisis                     → Crisis & Safety category listing
/food/sa-food-bank          → Individual resource detail
/crisis/sa-hope-hotline     → Individual resource detail
/about                      → About the project, how to contribute
/submit                     → How to submit or update a resource
```

---

## Story 1: Project Identity & Design Tokens

**Goal:** Replace boilerplate branding with San Antonio Mutual Aid identity. Establish the color palette, typography, and CSS custom properties that every subsequent story builds on.

### Tasks

1. Update CSS custom properties in `styles/styles.css`:
   - Use the following colors as the initial design colors, derive additional colors from these:

      color: #025E73;
      color: #011F26;
      color: #A5A692;
      color: #BFB78F;
      color: #F2A71B;

   - Semantic tokens: `--color-food`, `--color-housing`, `--color-healthcare`, `--color-legal`, `--color-financial`, `--color-family`, `--color-employment`, `--color-crisis` (one accent per category)
   - Typography: keep Roboto (already loaded) — clean, readable, supports Spanish characters
   - Spacing scale: `--space-xs` through `--space-xxl`
   - Border radius: `--radius-sm`, `--radius-md`, `--radius-lg`

2. Add an SVG site logo to `icons/` (text-based placeholder to start)

3. Update `head.html`:
   - Page title: "San Antonio Mutual Aid Directory"
   - Meta description
   - Favicon (can be simple SVG favicon)

4. Add a `_brand` section to `styles/styles.css` documenting the design tokens

### Files Changed

- `styles/styles.css`
- `head.html`
- `icons/logo.svg` (new)
- `icons/favicon.svg` (new)

### Manual Verification

- [ ] Run `npm run lint` — no errors
- [ ] Start dev server: `npx @adobe/aem-cli up`
- [ ] Open `http://localhost:3000` — page loads without console errors
- [ ] Inspect computed styles in DevTools: all new custom properties are defined on `:root`
- [ ] Favicon appears in browser tab
- [ ] Page title reads "San Antonio Mutual Aid Directory"

---

## Story 2: Site Navigation & Footer

**Goal:** Build the persistent header navigation and footer with links relevant to a mutual aid directory. Mobile hamburger menu works correctly.

### Tasks

1. Create `drafts/nav.html` with the navigation structure:
   - Logo + site name (links to `/`)
   - Category links: Food, Housing, Healthcare, Legal, Financial, Family, Employment, Crisis
   - Utility links: About, Submit a Resource
   - Mobile hamburger menu (already supported by existing header block)

2. Create `drafts/footer.html`:
   - Disclaimer: "Information is provided as-is. Always call ahead to confirm."
   - Links: About, Submit a Resource, Privacy
   - "Built for San Antonio by San Antonio"
   - Last updated date

3. Adjust `blocks/header/header.css` if needed for category count (8 nav items need horizontal scroll or dropdown on tablet)

4. Style the footer in `blocks/footer/footer.css` with the new brand colors

### Files Changed

- `drafts/nav.html` (new)
- `drafts/footer.html` (new)
- `blocks/header/header.css` (modify)
- `blocks/footer/footer.css` (modify)

### Manual Verification

- [ ] Start dev server with `--html-folder drafts`
- [ ] Open `http://localhost:3000` — header and footer render
- [ ] Desktop: all 8 category links visible and clickable
- [ ] Mobile (resize to 375px): hamburger menu appears, opens/closes, all links accessible
- [ ] Footer disclaimer text is visible
- [ ] Keyboard navigation: Tab through all nav links, Enter activates them
- [ ] Screen reader: nav landmark is announced, links are labeled

---

## Story 3: Homepage Hero & Mission

**Goal:** Create a welcoming homepage that immediately communicates what the site does and who it serves.

### Tasks

1. Create `drafts/index.html` with:
   - Hero section: H1 "San Antonio Mutual Aid Directory", subtitle "Find free and low-cost resources in your community", CTA button "Browse Resources"
   - Mission section: 2-3 paragraphs about mutual aid and the SA community
   - "How It Works" section: 3 columns (Search → Find → Connect)
   - Emergency banner: "In immediate danger? Call 911. Crisis hotline: 210-223-SAFE"

2. Update `blocks/hero/hero.css`:
   - Style for the mutual aid context — overlay gradient, readable text
   - CTA button prominent and accessible

3. Create a hero background image placeholder (solid color gradient or simple SVG pattern — no external image dependency for MVP)

### Files Changed

- `drafts/index.html` (new)
- `blocks/hero/hero.css` (modify)
- `blocks/hero/hero.js` (modify if needed for CTA)

### Manual Verification

- [ ] Open `http://localhost:3000/` — homepage loads with hero, mission, how-it-works
- [ ] Hero text is readable against background (contrast ratio ≥ 4.5:1)
- [ ] "Browse Resources" button is visible and links to `#categories` or `/food`
- [ ] Emergency banner is visually distinct (high contrast, not dismissable)
- [ ] Mobile: all sections stack vertically, text remains readable
- [ ] Desktop: "How It Works" renders as 3 columns
- [ ] Page loads in under 2 seconds on localhost

---

## Story 4: Resource Category Cards Block

**Goal:** Build a custom block that displays the 8 resource categories as visually distinct, clickable cards with icons and descriptions.

### Tasks

1. Create `blocks/category-cards/category-cards.js`:
   - Transform authored content (rows of: icon name, category title, description, link) into styled cards
   - Each card gets a category-specific accent color from the design tokens
   - Cards link to the category listing page

2. Create `blocks/category-cards/category-cards.css`:
   - CSS Grid: `repeat(auto-fill, minmax(280px, 1fr))`
   - Card hover state with subtle elevation
   - Category color accent (left border or top bar)
   - Icon display area

3. Add SVG icons for each category to `icons/`:
   - `food.svg`, `housing.svg`, `healthcare.svg`, `legal.svg`, `financial.svg`, `family.svg`, `employment.svg`, `crisis.svg`

4. Add the category cards block to `drafts/index.html` below the mission section

### Files Changed

- `blocks/category-cards/category-cards.js` (new)
- `blocks/category-cards/category-cards.css` (new)
- `icons/food.svg` ... `icons/crisis.svg` (8 new SVGs)
- `drafts/index.html` (modify — add block)

### Manual Verification

- [ ] Open `http://localhost:3000/` — 8 category cards appear in a grid
- [ ] Each card shows: icon, title, short description
- [ ] Cards are clickable — link targets are correct (e.g., `/food`, `/housing`)
- [ ] Hover: cards show visual feedback (shadow, scale, or color shift)
- [ ] Each card has a distinct category accent color
- [ ] Mobile: cards stack to 1 column
- [ ] Tablet (768px): cards show 2 per row
- [ ] Desktop: cards show 3-4 per row
- [ ] `npm run lint` passes

---

## Story 5: Resource Listing Block

**Goal:** Build the core directory block — a filterable, sortable list of resources displayed on each category page.

### Tasks

1. Create `blocks/resource-listing/resource-listing.js`:
   - Reads authored content: each row is a resource with name, description, address, phone, tags
   - Renders as a list of resource cards with key info visible at a glance
   - Supports a "compact" variant (list view) and default card view
   - Client-side tag filtering (filter buttons generated from available tags)
   - Alphabetical sort toggle

2. Create `blocks/resource-listing/resource-listing.css`:
   - Resource cards with clear information hierarchy
   - Phone numbers styled as clickable `tel:` links
   - Address with a "Get Directions" link (Google Maps intent URL)
   - Tag pills/badges
   - "Last Verified" date badge

3. Create test category pages:
   - `drafts/food.html` — Food & Groceries listing with 5-8 sample resources
   - `drafts/crisis.html` — Crisis & Safety listing with 3-5 sample resources

4. Helper utility in `scripts/scripts.js`:
   - `formatPhone(number)` — formats 10-digit numbers
   - `getMapsUrl(address)` — returns Google Maps directions URL

### Files Changed

- `blocks/resource-listing/resource-listing.js` (new)
- `blocks/resource-listing/resource-listing.css` (new)
- `scripts/scripts.js` (modify — add utility functions)
- `drafts/food.html` (new)
- `drafts/crisis.html` (new)

### Manual Verification

- [ ] Open `http://localhost:3000/food` — list of food resources renders
- [ ] Each resource shows: name, description snippet, address, phone
- [ ] Phone numbers are clickable `tel:` links
- [ ] "Get Directions" links open Google Maps with the correct address
- [ ] Tag filter buttons appear; clicking one filters the list
- [ ] Clicking "All" shows all resources again
- [ ] Alphabetical sort toggle reorders the list
- [ ] "Last Verified" date shows on each resource
- [ ] Mobile: single column, full-width cards
- [ ] Desktop: cards or list layout fills content area
- [ ] `npm run lint` passes

---

## Scalability Revision (Replaces Stories 6-12)

This revision keeps AEM Edge Delivery Services as the delivery platform and removes manual page assembly by making listings/details data-driven from a single indexed dataset.

### Revised Story Map

| # | Story | Branch | Depends On |
|---|-------|--------|------------|
| 6 | Resource Data Model & Slug Strategy | `story/6-data-model` | 5 |
| 7 | Shared Resource Store (Index Access Layer) | `story/7-resource-store` | 6 |
| 8 | Universal Category View Block | `story/8-category-view` | 7 |
| 9 | Universal Resource Detail Block | `story/9-resource-detail-universal` | 7 |
| 10 | Search, Filter & URL State Integration | `story/10-search-integration` | 8, 9 |
| 11 | Authoring Scalability Workflow & Content QA | `story/11-authoring-qa` | 10 |
| 12 | A11y, Performance, SEO & Launch Readiness | `story/12-quality-seo-launch` | 11 |

---

## Story 6: Resource Data Model & Slug Strategy

**Goal:** Define a single, stable resource schema so category pages and detail pages can be generated from one source of truth.

### Tasks

1. Define required fields and optional fields:
   - Required: `id`, `slug`, `name`, `category`, `description`, `lastVerified`
   - Optional: `address`, `phone`, `website`, `hours`, `languages`, `eligibility`, `tags`
2. Define slug rules:
   - Lowercase, kebab-case, unique across all resources
3. Add a schema validation helper in JS for required fields and basic formatting
4. Update content guidance so adding a new resource means updating dataset only (not assembling full pages)

### Files Changed

- `docs/content-model.md` (new)
- `scripts/resource-schema.js` (new)
- `README.md` (modify - authoring notes)

### Manual Verification

- [ ] Schema doc includes required/optional fields and examples
- [ ] Validation helper flags missing required fields
- [ ] Slug uniqueness check works for duplicate slugs
- [ ] Authoring instructions explain the new workflow clearly

---

## Story 7: Shared Resource Store (Index Access Layer)

**Goal:** Create a reusable data access layer used by listing, detail, and search blocks.

### Tasks

1. Create `scripts/resource-store.js`:
   - Fetch resource index (`/query-index.json` or configured equivalent)
   - Cache response in-memory
2. Expose utility methods:
   - `getAllResources()`
   - `getResourcesByCategory(category)`
   - `getResourceBySlug(slug)`
   - `searchResources(query, filters)`
3. Normalize fields (tags array, trimmed strings, phone formatting fallback)
4. Add robust error handling and empty dataset behavior

### Files Changed

- `scripts/resource-store.js` (new)
- `scripts/scripts.js` (modify - import/reuse helper if needed)

### Manual Verification

- [ ] Initial fetch happens once and is cached
- [ ] Category lookup returns expected records
- [ ] Slug lookup returns exact resource
- [ ] Search/filter returns consistent results across repeated calls
- [ ] Error state is returned cleanly on failed fetch

---

## Story 8: Universal Category View Block

**Goal:** Replace manual per-category listing assembly with one reusable category renderer.

### Tasks

1. Create `blocks/category-view/category-view.js`:
   - Read category from URL (`?c=food`) and/or path mapping
   - Request data from `resource-store`
   - Render cards/list with sort + tag filters
2. Create `blocks/category-view/category-view.css`:
   - Responsive layout for cards/list
   - Accessible filter controls and focus states
3. Add loading, empty, and error states
4. Convert category pages to thin shell pages containing this block only

### Files Changed

- `blocks/category-view/category-view.js` (new)
- `blocks/category-view/category-view.css` (new)
- `drafts/food.html` (modify - shell + block)
- `drafts/housing.html` (new/modify)
- `drafts/healthcare.html` (new/modify)
- `drafts/legal.html` (new/modify)
- `drafts/financial.html` (new/modify)
- `drafts/family.html` (new/modify)
- `drafts/employment.html` (new/modify)
- `drafts/crisis.html` (modify - shell + block)

### Manual Verification

- [ ] Each category page renders resources without manual row assembly
- [ ] Changing category input updates results correctly
- [ ] Loading, empty, and error states display correctly
- [ ] Mobile/tablet/desktop layouts are readable and usable
- [ ] Keyboard users can operate filters and sort controls

---

## Story 9: Universal Resource Detail Block

**Goal:** Use one detail block to render any resource by slug/id from shared data.

### Tasks

1. Refactor `blocks/resource-detail/resource-detail.js`:
   - Read `?r=slug` and/or path-based slug
   - Retrieve record from `resource-store`
   - Render full detail sections conditionally
2. Add fallback UI for missing/unknown slugs
3. Generate breadcrumb from category metadata
4. Keep contact actions accessible (`tel:` and external links)

### Files Changed

- `blocks/resource-detail/resource-detail.js` (modify)
- `blocks/resource-detail/resource-detail.css` (modify)
- `drafts/resource-detail.html` (new - generic detail shell)

### Manual Verification

- [ ] Valid slug renders correct resource
- [ ] Unknown slug shows user-friendly not-found state
- [ ] Missing optional fields do not create empty sections
- [ ] Breadcrumb points to correct category page
- [ ] Phone and website links behave correctly on mobile

---

## Story 10: Search, Filter & URL State Integration

**Goal:** Unify search behavior with category/detail pages using the same shared dataset and URL state.

### Tasks

1. Update `blocks/search/search.js` to use `resource-store`
2. Support shareable URL params: `?q=`, `?category=`, `?tags=`
3. Sync URL state with UI controls (on load + on change)
4. Reuse card rendering patterns for consistency

### Files Changed

- `blocks/search/search.js` (modify)
- `blocks/search/search.css` (modify)
- `drafts/search.html` (modify)

### Manual Verification

- [ ] URL params restore search state on page reload
- [ ] Combined filters work together (query + category + tags)
- [ ] No-results state is clear and actionable
- [ ] Search interactions remain responsive on mobile

---

## Story 11: Authoring Scalability Workflow & Content QA

**Goal:** Make "add one resource" a low-friction workflow with quality checks.

### Tasks

1. Document authoring workflow:
   - Add/update one resource entry
   - Verify slug uniqueness
   - Confirm category and last verified date
2. Add content QA script/checks:
   - Missing required fields
   - Duplicate slugs
   - Invalid links/phone formats (basic validation)
3. Add stale-content indicator policy using `lastVerified`

### Files Changed

- `docs/authoring-workflow.md` (new)
- `scripts/content-qa.js` (new)
- `package.json` (modify - add QA script command if needed)

### Manual Verification

- [ ] New resource appears in category/detail/search without manual page build
- [ ] QA checks catch intentionally malformed records
- [ ] Duplicate slug is detected and reported
- [ ] Workflow can be followed in under 5 minutes per resource

---

## Story 12: A11y, Performance, SEO & Launch Readiness

**Goal:** Production-quality polish for the data-driven architecture.

### Tasks

1. Accessibility pass:
   - Keyboard flow, ARIA labels, heading hierarchy, contrast
   - Loading/error state announcements where appropriate
2. Performance pass:
   - Keep JS lightweight, defer non-critical behavior
   - Ensure list rendering remains fast for 100+ resources
3. SEO pass:
   - Canonical URL strategy for category/detail pages
   - Metadata consistency and sitemap coverage
4. Final QA across home/category/detail/search templates

### Files Changed

- `head.html` (modify)
- `styles/styles.css` (modify)
- `styles/lazy-styles.css` (modify)
- Block CSS/JS files from Stories 8-10 (polish)

### Manual Verification

- [ ] Lighthouse targets met on key templates
- [ ] axe reports no critical or serious violations
- [ ] Category/detail/search pages are indexable with canonical URLs
- [ ] Full user journey works on desktop + mobile
- [ ] `npm run lint` passes

---

## Updated Technical Decisions & Rationale

### Why no dedicated backend (yet)?

For this stage, a custom backend increases cost and maintenance (hosting, auth, uptime, API versioning, monitoring) without being necessary for a directory expected to run efficiently from indexed content. AEM EDS already supports high-performance static delivery plus index-driven client-side rendering.

### How scalability is achieved in this revision

Scalability comes from a single resource dataset + shared resource store + universal category/detail/search blocks. Adding a new resource updates one data source and automatically flows into listing, detail, and search views.

### When to introduce a backend later

Introduce a backend only if requirements exceed this model (complex write workflows, advanced permissions, external system integrations, heavy analytics querying, or volume that exceeds practical client-side/index patterns).

---

## Future Iterations (Post-MVP)

These are out of scope for MVP but worth noting for the roadmap:

- **Spanish language version** — full site translation, `lang="es"` pages
- **Interactive map view** — Mapbox or Leaflet showing all resources geographically
- **Community submission form** — Google Form or Typeform integration for adding resources
- **SMS/text search** — Twilio integration for users without smartphones
- **Offline support** — Service worker for caching directory data
- **Print directory** — Generate a printable PDF of all resources by category
- **211 Texas integration** — Cross-reference with the state's official resource database
- **Resource status indicators** — "Open Now" / "Closed" based on hours
- **Neighborhood filtering** — Filter by San Antonio zip code or council district
