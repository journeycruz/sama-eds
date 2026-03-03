const REQUIRED_FIELDS = [
  'id',
  'slug',
  'name',
  'category',
  'description',
  'lastVerified',
];

const OPTIONAL_FIELDS = [
  'address',
  'phone',
  'website',
  'hours',
  'languages',
  'eligibility',
  'tags',
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isRecord = (value) => value && typeof value === 'object' && !Array.isArray(value);

const normalizeString = (value) => String(value || '').trim();

const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((tag) => normalizeString(tag)).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((tag) => normalizeString(tag))
    .filter(Boolean);
};

const normalizeDate = (value) => normalizeString(value).slice(0, 10);

const normalizeResource = (resource = {}) => {
  const normalized = {
    id: normalizeString(resource.id),
    slug: normalizeString(resource.slug).toLowerCase(),
    name: normalizeString(resource.name),
    category: normalizeString(resource.category),
    description: normalizeString(resource.description),
    lastVerified: normalizeDate(resource.lastVerified),
    tags: normalizeTags(resource.tags),
  };

  OPTIONAL_FIELDS.forEach((field) => {
    if (field === 'tags') {
      return;
    }

    const normalizedValue = normalizeString(resource[field]);
    if (normalizedValue) {
      normalized[field] = normalizedValue;
    }
  });

  return normalized;
};

const createError = ({
  code,
  field,
  message,
  resource,
}) => ({
  code,
  field,
  message,
  id: resource.id || null,
  slug: resource.slug || null,
});

const hasRequiredFields = (resource) => REQUIRED_FIELDS.reduce((errors, field) => {
  if (!resource[field]) {
    return [...errors, createError({
      code: 'missing-required-field',
      field,
      message: `Missing required field: ${field}`,
      resource,
    })];
  }

  return errors;
}, []);

const hasValidSlug = (resource) => {
  if (!resource.slug) {
    return [];
  }

  if (SLUG_PATTERN.test(resource.slug)) {
    return [];
  }

  return [createError({
    code: 'invalid-slug-format',
    field: 'slug',
    message: 'Slug must be lowercase kebab-case and unique across all resources',
    resource,
  })];
};

const hasValidLastVerified = (resource) => {
  if (!resource.lastVerified) {
    return [];
  }

  const dateValue = new Date(resource.lastVerified);
  if (!Number.isNaN(dateValue.getTime())) {
    return [];
  }

  return [createError({
    code: 'invalid-last-verified',
    field: 'lastVerified',
    message: 'lastVerified must be a valid date string (recommended format: YYYY-MM-DD)',
    resource,
  })];
};

const toSlug = (value = '') => normalizeString(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const validateResource = (resource, options = {}) => {
  if (!isRecord(resource)) {
    return {
      isValid: false,
      errors: [{
        code: 'invalid-resource-shape',
        field: null,
        message: 'Resource must be an object',
        id: null,
        slug: null,
      }],
      resource: null,
    };
  }

  const normalizedResource = normalizeResource(resource);
  const knownSlugs = options.knownSlugs || new Set();
  const errors = [
    ...hasRequiredFields(normalizedResource),
    ...hasValidSlug(normalizedResource),
    ...hasValidLastVerified(normalizedResource),
  ];

  if (normalizedResource.slug && knownSlugs.has(normalizedResource.slug)) {
    errors.push(createError({
      code: 'duplicate-slug',
      field: 'slug',
      message: `Duplicate slug found: ${normalizedResource.slug}`,
      resource: normalizedResource,
    }));
  }

  return {
    isValid: errors.length === 0,
    errors,
    resource: normalizedResource,
  };
};

const validateResourceCollection = (resources = []) => {
  if (!Array.isArray(resources)) {
    return {
      isValid: false,
      errors: [{
        code: 'invalid-collection-shape',
        field: null,
        message: 'Resource collection must be an array',
        id: null,
        slug: null,
      }],
      resources: [],
    };
  }

  const knownSlugs = new Set();
  const results = resources.map((resource) => {
    const result = validateResource(resource, { knownSlugs });
    if (result.resource?.slug) {
      knownSlugs.add(result.resource.slug);
    }
    return result;
  });

  const errors = results.flatMap((result, index) => result.errors.map((error) => ({
    ...error,
    index,
  })));

  return {
    isValid: errors.length === 0,
    errors,
    resources: results.map((result) => result.resource).filter(Boolean),
  };
};

export {
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS,
  SLUG_PATTERN,
  toSlug,
  normalizeResource,
  validateResource,
  validateResourceCollection,
};
