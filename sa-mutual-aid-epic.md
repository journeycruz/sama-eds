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

## Story 6: Resource Detail Block

**Goal:** Build a detail view block for individual resource pages showing all available information about a single organization.

### Tasks

1. Create `blocks/resource-detail/resource-detail.js`:
   - Renders full resource information from authored page content
   - Structured sections: Overview, Contact, Hours, Eligibility, Location
   - "Back to [Category]" breadcrumb link
   - "Report outdated info" link (mailto or form link)

2. Create `blocks/resource-detail/resource-detail.css`:
   - Clean, scannable layout
   - Contact info prominently displayed
   - Map embed placeholder (static map image linking to Google Maps — no JS SDK needed)
   - Print-friendly styles (media query `@media print`)

3. Create test detail pages:
   - `drafts/food/sa-food-bank.html`
   - `drafts/crisis/sa-hope-hotline.html`

### Files Changed

- `blocks/resource-detail/resource-detail.js` (new)
- `blocks/resource-detail/resource-detail.css` (new)
- `drafts/food/sa-food-bank.html` (new)
- `drafts/crisis/sa-hope-hotline.html` (new)

### Manual Verification

- [ ] Open `http://localhost:3000/food/sa-food-bank` — detail page renders
- [ ] All fields display: name, description, address, phone, website, hours, eligibility, languages
- [ ] Phone is a clickable `tel:` link
- [ ] Website opens in a new tab
- [ ] "Back to Food & Groceries" breadcrumb links to `/food`
- [ ] Address links to Google Maps
- [ ] Print the page (Ctrl+P): layout is clean, no nav/footer clutter
- [ ] Missing optional fields (e.g., no hours listed) don't leave empty sections
- [ ] Mobile: all sections stack, contact info is tap-friendly
- [ ] `npm run lint` passes

---

## Story 7: Search & Filter Block

**Goal:** Add a site-wide search block that lets users find resources by keyword, category, or tag — without any backend. Pure client-side search using AEM's query index.

### Tasks

1. Set up the AEM query index:
   - Create a spreadsheet-based index (or configure via `helix-query.yaml`) that indexes all resource pages with fields: path, title, description, category, tags, address, phone

2. Create `blocks/search/search.js`:
   - Fetch the query index JSON at page load
   - Text input with real-time filtering (debounced, 300ms)
   - Category dropdown filter
   - Results rendered as compact resource cards (reuse styles from resource-listing)
   - "No results found" state with suggestions
   - URL parameter support: `?q=food&category=food` for shareable searches

3. Create `blocks/search/search.css`:
   - Search input: large, prominent, with search icon
   - Filter controls: horizontal on desktop, stacked on mobile
   - Results count indicator
   - Loading state

4. Add search to the homepage and header:
   - Homepage: search block below the hero
   - Header: search icon that opens search (or links to search page)

5. Create `drafts/search.html` — dedicated search page

### Files Changed

- `blocks/search/search.js` (new)
- `blocks/search/search.css` (new)
- `helix-query.yaml` (new — or a query index spreadsheet)
- `drafts/search.html` (new)
- `drafts/index.html` (modify — add search block)
- `blocks/header/header.js` (modify — search icon behavior)

### Manual Verification

- [ ] Open `http://localhost:3000/search` — search page loads with input field
- [ ] Type "food" — results filter to food-related resources
- [ ] Select "Healthcare" from category dropdown — only healthcare resources show
- [ ] Combine text search + category filter — both apply
- [ ] Clear search — all resources return
- [ ] No results: "No resources found" message appears with suggestions
- [ ] URL updates with search params: `?q=food`
- [ ] Refresh page with params — search restores from URL
- [ ] Homepage search input works and links to `/search?q={query}`
- [ ] Mobile: search input is full-width, usable with thumb
- [ ] Performance: search responds within 100ms after index loads
- [ ] `npm run lint` passes

---

## Story 8: Test Content — Full Directory Data

**Goal:** Populate the directory with real San Antonio mutual aid resources. Research and add at least 5-8 verified resources per category (40-64 total) to make the site genuinely useful.

### Tasks

1. Research real San Antonio mutual aid organizations:
   - San Antonio Food Bank
   - Haven for Hope (shelter)
   - CentroMed (healthcare)
   - RAICES (legal/immigration)
   - SAMMinistries (housing)
   - Family Service Association
   - Goodwill San Antonio (employment)
   - The P.E.A.C.E. Initiative (crisis)
   - Catholic Charities Archdiocese of San Antonio
   - University Health (Bexar County healthcare)
   - And many more...

2. Create static HTML content files for each resource in `drafts/`:
   - Follow the content model defined above
   - Include real addresses, phone numbers, websites, hours
   - Mark each with a "Last Verified" date

3. Create all 8 category listing pages with their resources

4. Update the homepage with accurate featured resources

5. Create `drafts/about.html` and `drafts/submit.html` pages

### Files Changed

- `drafts/food/*.html` (5-8 new files)
- `drafts/housing/*.html` (5-8 new files)
- `drafts/healthcare/*.html` (5-8 new files)
- `drafts/legal/*.html` (5-8 new files)
- `drafts/financial/*.html` (5-8 new files)
- `drafts/family/*.html` (5-8 new files)
- `drafts/employment/*.html` (5-8 new files)
- `drafts/crisis/*.html` (5-8 new files)
- `drafts/about.html` (new)
- `drafts/submit.html` (new)
- All 8 category listing pages updated

### Manual Verification

- [ ] Every category page has at least 5 resources listed
- [ ] Click through to 5+ individual resource detail pages — all fields populated
- [ ] Phone numbers are correct format and clickable
- [ ] Website links open the correct external sites
- [ ] Google Maps links point to correct San Antonio addresses
- [ ] No placeholder or "Lorem ipsum" text remains anywhere
- [ ] About page explains the project mission
- [ ] Submit page explains how to contribute or report issues
- [ ] Search finds resources across all categories
- [ ] Spanish-language resource names display correctly (accents, ñ)

---

## Story 9: Accessibility & Performance Audit

**Goal:** Ensure the site meets WCAG 2.1 AA and achieves a Lighthouse score of 95+ across all categories.

### Tasks

1. Accessibility audit:
   - Run axe DevTools on every page template (home, listing, detail, search, about)
   - Fix all critical and serious violations
   - Verify heading hierarchy (single H1, sequential headings)
   - Ensure all images have alt text
   - Verify color contrast ratios (≥ 4.5:1 for text, ≥ 3:1 for large text)
   - Test keyboard navigation: every interactive element reachable via Tab
   - Add skip navigation link
   - Ensure `aria-label` on search input, filter controls, nav landmarks
   - Add `lang="en"` to HTML (and `lang="es"` spans where appropriate)

2. Performance optimization:
   - Run Lighthouse on all page templates
   - Ensure no render-blocking resources beyond critical CSS
   - Verify lazy loading on below-fold images
   - Check total page weight < 200KB (excluding images)
   - Minimize CSS specificity and unused rules
   - Verify fonts load with `font-display: swap` (already set)

3. Add `styles/lazy-styles.css` content:
   - Move non-LCP styles here (search block, footer details, print styles)

4. Add to `scripts/delayed.js`:
   - Any analytics or tracking (if applicable)

### Files Changed

- Multiple block CSS/JS files (fixes)
- `styles/styles.css` (contrast fixes, skip nav)
- `styles/lazy-styles.css` (non-critical styles)
- `scripts/delayed.js` (analytics stub)
- `head.html` (lang attribute, any meta fixes)

### Manual Verification

- [ ] Lighthouse scores: Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95
- [ ] axe DevTools: 0 critical or serious violations on homepage, listing, detail, search
- [ ] Keyboard-only navigation: complete a full user journey (home → category → resource → back)
- [ ] Screen reader (VoiceOver/NVDA): page structure is announced correctly
- [ ] Skip nav link appears on focus and jumps to main content
- [ ] Tab order is logical (no focus traps)
- [ ] High contrast mode: content remains readable
- [ ] Zoom to 200%: no content is cut off or overlapping
- [ ] `npm run lint` passes

---

## Story 10: SEO, Sitemap & Open Graph

**Goal:** Ensure the site is discoverable by search engines and shares well on social media. Critical for a community resource — people need to find this via Google.

### Tasks

1. SEO metadata on every page:
   - Unique `<title>` per page: "[Resource Name] | SA Mutual Aid" or "[Category] Resources | SA Mutual Aid"
   - Meta descriptions (unique per page, 150-160 chars)
   - Canonical URLs

2. Open Graph and Twitter Card tags in `head.html`:
   - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
   - `twitter:card`, `twitter:title`, `twitter:description`
   - Create a default social share image (`icons/og-image.png`)

3. Structured data (JSON-LD) for resources:
   - Schema.org `Organization` or `LocalBusiness` type for each resource
   - Include: name, address, telephone, openingHours, url
   - Add to resource detail pages via `scripts/delayed.js`

4. Configure sitemap:
   - Set up `helix-sitemap.yaml` or use AEM's automatic sitemap generation
   - Verify sitemap includes all category and resource pages

5. Configure `robots.txt`:
   - Allow all crawlers
   - Reference sitemap URL

### Files Changed

- `head.html` (OG tags, structured data hook)
- `scripts/delayed.js` (JSON-LD injection)
- `helix-sitemap.yaml` (new, if manual config needed)
- `icons/og-image.png` (new)
- Various `drafts/*.html` (metadata additions)

### Manual Verification

- [ ] View page source on homepage: `<title>`, meta description, OG tags present
- [ ] View page source on a resource detail: unique title and description
- [ ] Paste a resource URL into the Facebook Sharing Debugger — preview renders correctly
- [ ] Paste URL into Twitter Card Validator — card renders
- [ ] Open `/sitemap.xml` — all pages listed
- [ ] Open `/robots.txt` — allows crawling, references sitemap
- [ ] Google Rich Results Test: structured data validates for a resource detail page
- [ ] No duplicate titles or descriptions across pages
- [ ] `npm run lint` passes

---

## Story 11: CDN Configuration & Custom Domain

**Goal:** Set up production infrastructure so the site is served from a custom domain with SSL, CDN caching, and fast global delivery.

### Tasks

1. **Choose and register domain:**
   - Recommended: `samutualaid.org` or `sa-mutualaid.org`
   - Register via Namecheap, Google Domains, Cloudflare Registrar, etc.
   - Ensure WHOIS privacy is enabled

2. **Choose CDN approach** (two options):

   **Option A: Adobe Managed CDN (Simpler)**
   - Contact Adobe support (via AEM Slack channel or support portal)
   - Provide: custom domain + site name (`main--sama-eds--journeycruz`)
   - Adobe provides: IP addresses for A records + ACME challenge CNAME
   - Set DNS records:
     - `www` CNAME → `cdn.adobeaemcloud.com`
     - Apex A records → Adobe-provided IPs
     - ACME challenge CNAME for SSL certificate validation
   - Wait for Let's Encrypt certificate issuance (up to 7 days for validation)

   **Option B: Cloudflare BYO CDN (More Control)**
   - Create Cloudflare account, add domain
   - Update nameservers at registrar to Cloudflare
   - Create Worker or Page Rule to proxy to `main--sama-eds--journeycruz.aem.live`
   - Configure caching rules
   - Enable Cloudflare SSL (Full Strict)
   - Set up push invalidation integration

3. **DNS Configuration:**
   - Set TTL to 3600 (1 hour) initially
   - Before go-live: temporarily lower to 60 seconds for fast propagation
   - After go-live stabilizes: restore to 3600+

4. **SSL Verification:**
   - Verify HTTPS works on custom domain
   - Verify HTTP redirects to HTTPS
   - Verify www redirects to apex (or vice versa — pick one canonical form)

5. **Update configuration:**
   - Update `fstab.yaml` or AEM Configuration Service with production domain
   - Update sitemap references to use custom domain
   - Update OG tags to reference custom domain

### Files Changed

- DNS records (external — at registrar/Cloudflare)
- `fstab.yaml` or Configuration Service (update)
- `head.html` (canonical URL update)

### Manual Verification

- [ ] `https://samutualaid.org` loads the site (replace with actual domain)
- [ ] `http://samutualaid.org` redirects to HTTPS
- [ ] `https://www.samutualaid.org` redirects to apex (or vice versa)
- [ ] SSL certificate is valid (check in browser padlock)
- [ ] SSL Labs test (ssllabs.com): Grade A or A+
- [ ] All internal links work on the custom domain
- [ ] Images and assets load correctly (no mixed content warnings)
- [ ] Page loads in < 1.5 seconds on 4G connection (test via WebPageTest)
- [ ] CDN cache headers present: `cache-control`, `x-cache: HIT` on repeat visits

---

## Story 12: Go-Live Checklist & Launch

**Goal:** Final validation, content review, and public launch of the San Antonio Mutual Aid Directory.

### Tasks

1. **Content review:**
   - Verify every resource has accurate, current information
   - Confirm phone numbers by calling them
   - Verify website links are not broken (automated link checker)
   - Ensure no test/placeholder content remains

2. **Cross-browser testing:**
   - Chrome (latest)
   - Safari (latest)
   - Firefox (latest)
   - Samsung Internet (high SA usage)
   - iOS Safari
   - Chrome on Android

3. **PageSpeed Insights:**
   - Run against production URL
   - Target: 100 on mobile and desktop
   - Fix any flagged issues

4. **Final AEM checks:**
   - `gh pr checks` on main branch — all green
   - Verify AEM Code Sync has processed latest changes
   - Confirm `.aem.live` URL matches custom domain content

5. **Launch communications:**
   - Prepare a simple announcement for local community groups
   - Include QR code linking to the site
   - Share with San Antonio mutual aid networks, neighborhood associations, 311

6. **Post-launch monitoring:**
   - Monitor AEM RUM (Real User Monitoring) for errors
   - Watch for 404s in the first week
   - Set up a process for community submissions and resource updates

### Manual Verification

- [ ] Visit every page on production domain — no 404s
- [ ] Test on a real phone (not just DevTools emulation)
- [ ] Complete a full user journey on mobile: search → find resource → call phone number
- [ ] PageSpeed Insights: all scores ≥ 95 on production URL
- [ ] Share URL on social media: OG image and description render correctly
- [ ] All 8 category pages load and display resources
- [ ] Search works on production
- [ ] 404 page displays correctly for invalid URLs
- [ ] `robots.txt` and `sitemap.xml` accessible on production domain
- [ ] Google Search Console: submit sitemap, verify no crawl errors

---

## Technical Decisions & Rationale

### Why no database or API?

AEM Edge Delivery Services is built around static content delivery. Resources are authored as content pages and indexed via AEM's query index. This gives us sub-100ms page loads, zero infrastructure cost, and the ability for non-technical community members to update content through the AEM authoring interface (Google Docs or SharePoint). For an MVP serving a single city, this is the right tradeoff — we can always add a backend later if the directory grows beyond what static indexing supports.

### Why client-side search?

AEM provides a JSON query index (`/query-index.json`) that contains metadata for all pages. For a directory of ~50-100 resources, loading this index and filtering in the browser is faster than any server roundtrip. The index is cached by the CDN, so repeat searches are instant.

### Why no map integration in MVP?

Embedding Google Maps or Mapbox adds JavaScript weight, API key management, and cost. For MVP, each resource links to Google Maps via a `https://www.google.com/maps/dir/?api=1&destination={address}` intent URL. This is zero-cost, works on every device, and opens the user's native maps app on mobile. A map view can be added in a future iteration.

### Why these 8 categories?

These are based on the most common needs documented by existing San Antonio mutual aid networks (SA Mutual Aid, San Antonio Food Bank community surveys, and 211 Texas call data). The categories can be expanded post-launch based on community feedback.

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
