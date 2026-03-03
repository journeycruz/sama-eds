# Resource Content Model

This directory uses a single resource dataset as the source of truth for category views, resource detail views, and search.

## Why this model

- One schema keeps listing, detail, and search behavior consistent.
- A single slug strategy avoids URL collisions across categories.
- Authors add or update data once instead of assembling multiple pages.

## Resource Schema

### Required fields

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `id` | string | `sa-food-bank-main` | Stable internal identifier. |
| `slug` | string | `san-antonio-food-bank` | URL-safe key, unique across all resources. |
| `name` | string | `San Antonio Food Bank` | Public program or organization name. |
| `category` | string | `food` | One category key used by category pages. |
| `description` | string | `Free groceries and pantry support.` | Short summary used in listings/search. |
| `lastVerified` | string (date) | `2026-03-01` | Last date the listing was verified. |

### Optional fields

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `address` | string | `5200 Historic Old Hwy 90, San Antonio, TX 78227` | Used for maps/directions links. |
| `phone` | string | `2104318326` | Raw or formatted values accepted. |
| `website` | string (URL) | `https://safoodbank.org` | External organization website. |
| `hours` | string | `Mon-Fri 8:00 AM-5:00 PM` | Display-only text. |
| `languages` | string | `English, Spanish` | Comma-delimited display value. |
| `eligibility` | string | `Bexar County residents` | Display-only qualification text. |
| `tags` | string or array | `groceries, pantry` | Normalized to an array in code. |

## Slug Rules

- Lowercase only (`a-z`, `0-9`)
- Kebab-case segments separated by one hyphen (`-`)
- No spaces, punctuation, or underscores
- Must be unique across the entire resource dataset

Valid examples:

- `san-antonio-food-bank`
- `womens-shelter-24-7`

Invalid examples:

- `SanAntonioFoodBank` (not lowercase kebab-case)
- `food_bank` (underscore)
- `food--bank` (double hyphen)

## Example Record

```json
{
  "id": "sa-food-bank-main",
  "slug": "san-antonio-food-bank",
  "name": "San Antonio Food Bank",
  "category": "food",
  "description": "Free groceries, pantry support, and SNAP enrollment help.",
  "lastVerified": "2026-03-01",
  "address": "5200 Historic Old Hwy 90, San Antonio, TX 78227",
  "phone": "2104318326",
  "website": "https://safoodbank.org",
  "hours": "Mon-Fri 8:00 AM-5:00 PM",
  "languages": "English, Spanish",
  "eligibility": "Open to Bexar County residents",
  "tags": ["groceries", "pantry", "snap"]
}
```

## Authoring Workflow

### Dataset file location and name

- Canonical spreadsheet filename: `resources.xlsx`
- Store it in the EDS content source root (SharePoint or Google Drive), not this git code repository.
- When published, this is expected to resolve to `/<name>.json` (typically `/resources.json`) unless index configuration maps a different path.

1. Add or update resource entries in the shared dataset.
2. Run schema validation (`scripts/resource-schema.js` consumers).
3. Resolve any missing required fields or duplicate slugs.
4. Publish data update.

No manual category page assembly or detail-page hand-authoring is required for new resources.
