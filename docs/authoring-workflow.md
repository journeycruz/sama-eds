# Authoring Workflow

This workflow keeps resource publishing fast and consistent by updating one shared dataset and validating it before publish.

## Dataset location

- Canonical spreadsheet name: `resources.xlsx`
- Store it in the EDS content source root (SharePoint or Google Drive)
- Published dataset endpoint is expected at `/resources.json`

## Add or update one resource

1. Open `resources.xlsx` and add or edit one row.
2. Confirm required fields are populated: `id`, `slug`, `name`, `category`, `description`, `lastVerified`.
3. Confirm `slug` is lowercase kebab-case and unique across all rows.
4. Confirm `category` is one of: `food`, `housing`, `healthcare`, `legal`, `financial`, `family`, `employment`, `crisis`.
5. Save and publish the sheet update.

After publish, the resource automatically appears in category pages, detail pages, and search without manual page assembly.

## Content QA command

Run QA against your published dataset:

```sh
npm run qa:content
```

Run QA against a specific source:

```sh
npm run qa:content -- --source https://main--sama-eds--journeycruz.aem.live/resources.json
```

Supported source types:

- HTTP(S) URL returning JSON (`[{...}]` or `{ data: [...] }`)
- Local JSON file path

## What QA checks

- Missing required fields
- Invalid category values
- Invalid slug format
- Duplicate slugs
- Invalid `website` URL format (`http`/`https`)
- Invalid `phone` format (basic 10-digit or 11-digit US pattern)
- Invalid `lastVerified` values
- Stale records by `lastVerified`

## Stale-content policy

- Warn at `120+` days since `lastVerified`
- Fail at `180+` days since `lastVerified` (can be disabled with `--allow-stale`)

When stale resources are reported, update those rows with a fresh verification date after confirmation with the provider.
