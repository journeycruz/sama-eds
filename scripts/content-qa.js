/* eslint-env node */
/* eslint-disable no-console */

const fs = require('node:fs/promises');
const path = require('node:path');

const REQUIRED_FIELDS = [
  'id',
  'slug',
  'name',
  'category',
  'description',
  'lastVerified',
];

const VALID_CATEGORIES = new Set([
  'food',
  'housing',
  'healthcare',
  'legal',
  'financial',
  'family',
  'employment',
  'crisis',
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const WARNING_STALE_DAYS = 120;
const FAIL_STALE_DAYS = 180;

const DEFAULT_SOURCE = 'http://localhost:3000/resources.json';

const normalizeString = (value) => String(value || '').trim();

const normalizeValue = (value) => normalizeString(value).toLowerCase();

const isHttpUrl = (value) => /^https?:\/\//i.test(normalizeString(value));

const extractDataRows = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const parseArgs = (argv) => argv.reduce((acc, value, index, all) => {
  if (value === '--source' && all[index + 1]) {
    return { ...acc, source: all[index + 1] };
  }

  if (value === '--allow-stale') {
    return { ...acc, allowStale: true };
  }

  return acc;
}, {
  source: DEFAULT_SOURCE,
  allowStale: false,
});

const loadJson = async (source) => {
  if (isHttpUrl(source)) {
    if (typeof fetch !== 'function') {
      throw new Error('Global fetch is not available in this Node runtime.');
    }

    const response = await fetch(source, { headers: { accept: 'application/json' } });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${source}: HTTP ${response.status}`);
    }

    return response.json();
  }

  const absolutePath = path.isAbsolute(source) ? source : path.resolve(process.cwd(), source);
  const fileContents = await fs.readFile(absolutePath, 'utf-8');
  return JSON.parse(fileContents);
};

const isValidWebsite = (value) => {
  const website = normalizeString(value);
  if (!website) {
    return true;
  }

  try {
    const parsed = new URL(website);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_error) {
    return false;
  }
};

const isValidPhone = (value) => {
  const phone = normalizeString(value);
  if (!phone) {
    return true;
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return true;
  }

  return digits.length === 11 && digits.startsWith('1');
};

const parseDate = (value) => {
  const dateValue = new Date(normalizeString(value));
  if (Number.isNaN(dateValue.getTime())) {
    return null;
  }
  return dateValue;
};

const toDaysSince = (date) => Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

const createIssue = (severity, code, row, message) => ({
  severity,
  code,
  row,
  message,
});

const validateRows = (rows, options = {}) => {
  const firstSeenBySlug = new Map();
  const issues = [];

  rows.forEach((resource, index) => {
    const row = index + 1;
    const normalizedSlug = normalizeValue(resource.slug);
    const normalizedCategory = normalizeValue(resource.category);

    REQUIRED_FIELDS.forEach((field) => {
      if (!normalizeString(resource[field])) {
        issues.push(createIssue('error', 'missing-required-field', row, `Missing ${field}`));
      }
    });

    if (normalizedSlug && !SLUG_PATTERN.test(normalizedSlug)) {
      issues.push(createIssue('error', 'invalid-slug-format', row, `Invalid slug: ${resource.slug}`));
    }

    if (normalizedSlug) {
      if (firstSeenBySlug.has(normalizedSlug)) {
        const firstRow = firstSeenBySlug.get(normalizedSlug);
        issues.push(createIssue('error', 'duplicate-slug', row, `Duplicate slug "${normalizedSlug}" (first seen at row ${firstRow})`));
      } else {
        firstSeenBySlug.set(normalizedSlug, row);
      }
    }

    if (normalizeString(resource.category) && !VALID_CATEGORIES.has(normalizedCategory)) {
      issues.push(createIssue('error', 'invalid-category', row, `Invalid category: ${resource.category}`));
    }

    if (!isValidWebsite(resource.website)) {
      issues.push(createIssue('error', 'invalid-website', row, `Invalid website URL: ${resource.website}`));
    }

    if (!isValidPhone(resource.phone)) {
      issues.push(createIssue('error', 'invalid-phone', row, `Invalid phone: ${resource.phone}`));
    }

    if (normalizeString(resource.lastVerified)) {
      const parsedDate = parseDate(resource.lastVerified);
      if (!parsedDate) {
        issues.push(createIssue('error', 'invalid-last-verified', row, `Invalid date: ${resource.lastVerified}`));
      } else {
        const ageInDays = toDaysSince(parsedDate);
        if (ageInDays >= FAIL_STALE_DAYS) {
          const severity = options.allowStale ? 'warning' : 'error';
          issues.push(createIssue(severity, 'stale-resource-critical', row, `Last verified ${ageInDays} days ago`));
        } else if (ageInDays >= WARNING_STALE_DAYS) {
          issues.push(createIssue('warning', 'stale-resource-warning', row, `Last verified ${ageInDays} days ago`));
        }
      }
    }
  });

  return issues;
};

const printIssueGroup = (label, issues) => {
  if (!issues.length) {
    return;
  }

  console.log(`\n${label} (${issues.length})`);
  issues.forEach((issue) => {
    console.log(`- [row ${issue.row}] ${issue.code}: ${issue.message}`);
  });
};

const run = async () => {
  const args = parseArgs(process.argv.slice(2));

  try {
    const payload = await loadJson(args.source);
    const rows = extractDataRows(payload);

    if (!rows.length) {
      console.error(`No resource rows found in source: ${args.source}`);
      process.exitCode = 1;
      return;
    }

    const issues = validateRows(rows, { allowStale: args.allowStale });
    const errors = issues.filter((issue) => issue.severity === 'error');
    const warnings = issues.filter((issue) => issue.severity === 'warning');

    console.log(`Source: ${args.source}`);
    console.log(`Rows checked: ${rows.length}`);

    printIssueGroup('Errors', errors);
    printIssueGroup('Warnings', warnings);

    if (!errors.length && !warnings.length) {
      console.log('\nQA passed with no issues.');
      return;
    }

    if (!errors.length) {
      console.log('\nQA completed with warnings only.');
      return;
    }

    console.error('\nQA failed due to errors.');
    process.exitCode = 1;
  } catch (error) {
    console.error(`QA failed to run: ${error.message}`);
    process.exitCode = 1;
  }
};

run();
