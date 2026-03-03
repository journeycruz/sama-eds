import { normalizeResource, validateResourceCollection } from './resource-schema.js';

const DEFAULT_INDEX_URL = '/resources.json';
const FALLBACK_INDEX_URL = '/query-index.json';

const createInitialState = () => ({
  status: 'idle',
  indexUrl: DEFAULT_INDEX_URL,
  resources: [],
  issues: [],
  error: null,
  sourceUrl: null,
  promise: null,
});

const storeState = createInitialState();

const normalizeString = (value) => String(value || '').trim();

const normalizeCategory = (value) => normalizeString(value).toLowerCase();

const normalizeSlug = (value) => normalizeString(value).toLowerCase();

const normalizeTag = (value) => normalizeString(value).toLowerCase();

const formatPhone = (number = '') => {
  const digits = String(number).replace(/\D/g, '');
  const normalized = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (normalized.length !== 10) {
    return normalizeString(number);
  }

  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
};

const normalizeTags = (tags = []) => (Array.isArray(tags) ? tags : [])
  .map((tag) => normalizeTag(tag))
  .filter(Boolean);

const normalizePhone = (phone) => {
  const normalizedPhone = normalizeString(phone);
  if (!normalizedPhone) {
    return undefined;
  }

  return formatPhone(normalizedPhone);
};

const normalizeStoreResource = (resource) => {
  const normalized = normalizeResource(resource);
  return {
    ...normalized,
    slug: normalizeSlug(normalized.slug),
    category: normalizeCategory(normalized.category),
    tags: normalizeTags(normalized.tags),
    ...(normalized.phone ? { phone: normalizePhone(normalized.phone) } : {}),
  };
};

const toError = (code, message, details = {}) => ({
  code,
  message,
  details,
});

const extractDataRows = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const getCandidateUrls = (primaryUrl) => {
  const normalizedPrimary = normalizeString(primaryUrl) || DEFAULT_INDEX_URL;
  if (normalizedPrimary === FALLBACK_INDEX_URL) {
    return [normalizedPrimary];
  }

  return [normalizedPrimary, FALLBACK_INDEX_URL];
};

const fetchJson = async (url) => {
  if (typeof fetch !== 'function') {
    return {
      ok: false,
      error: toError(
        'fetch-unavailable',
        'Global fetch API is not available in this runtime.',
        { url },
      ),
    };
  }

  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    if (!response.ok) {
      return {
        ok: false,
        error: toError('resource-fetch-failed', `Failed to fetch resource index (${response.status})`, {
          url,
          status: response.status,
        }),
      };
    }

    const payload = await response.json();
    return {
      ok: true,
      data: extractDataRows(payload),
      sourceUrl: url,
    };
  } catch (error) {
    return {
      ok: false,
      error: toError('resource-fetch-failed', 'Failed to fetch resource index.', {
        url,
        cause: error?.message || String(error),
      }),
    };
  }
};

const fetchFirstAvailable = async (urls, index = 0, errors = []) => {
  if (index >= urls.length) {
    return { ok: false, errors };
  }

  const attempt = await fetchJson(urls[index]);
  if (attempt.ok) {
    return attempt;
  }

  return fetchFirstAvailable(urls, index + 1, [...errors, attempt.error]);
};

const getInvalidIndexes = (errors = []) => new Set(
  errors
    .map((error) => error.index)
    .filter((value) => Number.isInteger(value) && value >= 0),
);

const normalizeValidResources = (rows) => {
  const validation = validateResourceCollection(rows);
  const invalidIndexes = getInvalidIndexes(validation.errors);
  const resources = validation.resources
    .map((resource, index) => ({ resource, index }))
    .filter(({ index }) => !invalidIndexes.has(index))
    .map(({ resource }) => normalizeStoreResource(resource));

  return {
    resources,
    issues: validation.errors,
  };
};

const sortByName = (resources = []) => [...resources].sort(
  (left, right) => left.name.localeCompare(right.name, 'en', { sensitivity: 'base' }),
);

const buildQueryText = (resource) => [
  resource.name,
  resource.description,
  resource.category,
  resource.eligibility,
  resource.languages,
  resource.tags.join(' '),
]
  .filter(Boolean)
  .join(' ')
  .toLowerCase();

const matchesQuery = (resource, query) => {
  const normalizedQuery = normalizeString(query).toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return buildQueryText(resource).includes(normalizedQuery);
};

const parseFilterTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((tag) => normalizeTag(tag)).filter(Boolean);
  }

  const normalizedValue = normalizeString(value);
  if (!normalizedValue) {
    return [];
  }

  return normalizedValue
    .split(',')
    .map((tag) => normalizeTag(tag))
    .filter(Boolean);
};

const matchesFilters = (resource, filters = {}) => {
  const categoryFilter = normalizeCategory(filters.category);
  if (categoryFilter && resource.category !== categoryFilter) {
    return false;
  }

  const tagFilters = parseFilterTags(filters.tags);
  if (tagFilters.length === 0) {
    return true;
  }

  const resourceTags = new Set(resource.tags);
  return tagFilters.every((tag) => resourceTags.has(tag));
};

const getStateSnapshot = () => ({
  resources: [...storeState.resources],
  issues: [...storeState.issues],
  error: storeState.error,
  sourceUrl: storeState.sourceUrl,
  fromCache: storeState.status === 'ready',
});

const loadStore = async () => {
  if (storeState.status === 'ready') {
    return getStateSnapshot();
  }

  if (storeState.status === 'loading' && storeState.promise) {
    return storeState.promise;
  }

  const request = (async () => {
    const urls = getCandidateUrls(storeState.indexUrl);
    const fetched = await fetchFirstAvailable(urls);

    if (!fetched.ok) {
      storeState.status = 'error';
      storeState.resources = [];
      storeState.issues = [];
      storeState.error = toError(
        'resource-index-unavailable',
        'Unable to load resource index from configured endpoints.',
        { attempts: fetched.errors || [] },
      );
      storeState.sourceUrl = null;
      return getStateSnapshot();
    }

    const { resources, issues } = normalizeValidResources(fetched.data);
    storeState.status = 'ready';
    storeState.resources = sortByName(resources);
    storeState.issues = issues;
    storeState.error = null;
    storeState.sourceUrl = fetched.sourceUrl;
    return getStateSnapshot();
  })();

  storeState.status = 'loading';
  storeState.promise = request;
  const result = await request;
  storeState.promise = null;
  return result;
};

export const setResourceStoreConfig = (config = {}) => {
  const indexUrl = normalizeString(config.indexUrl);
  if (indexUrl && indexUrl !== storeState.indexUrl) {
    storeState.indexUrl = indexUrl;
    storeState.status = 'idle';
    storeState.resources = [];
    storeState.issues = [];
    storeState.error = null;
    storeState.sourceUrl = null;
    storeState.promise = null;
  }
};

export const clearResourceStoreCache = () => {
  const { indexUrl } = storeState;
  Object.assign(storeState, createInitialState(), { indexUrl });
};

export const getAllResources = async () => loadStore();

export const getResourcesByCategory = async (category) => {
  const state = await loadStore();
  const normalizedCategory = normalizeCategory(category);
  const resources = normalizedCategory
    ? state.resources.filter((resource) => resource.category === normalizedCategory)
    : [...state.resources];

  return {
    ...state,
    resources,
  };
};

export const getResourceBySlug = async (slug) => {
  const state = await loadStore();
  const normalizedSlug = normalizeSlug(slug);
  const resource = state.resources.find((entry) => entry.slug === normalizedSlug) || null;

  return {
    ...state,
    resource,
  };
};

export const searchResources = async (query = '', filters = {}) => {
  const state = await loadStore();
  const resources = state.resources
    .filter((resource) => matchesFilters(resource, filters))
    .filter((resource) => matchesQuery(resource, query));

  return {
    ...state,
    resources,
  };
};
