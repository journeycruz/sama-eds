import {
  a,
  div,
  h2,
  li,
  nav,
  p,
  span,
  ul,
} from '../../scripts/dom-helpers.js';
import { getAllResources, getResourceBySlug } from '../../scripts/resource-store.js';
import { getMapsUrl } from '../../scripts/scripts.js';

const CATEGORY_META = {
  food: { label: 'Food & Groceries', path: '/food' },
  housing: { label: 'Housing & Shelter', path: '/housing' },
  healthcare: { label: 'Healthcare', path: '/healthcare' },
  legal: { label: 'Legal Aid', path: '/legal' },
  financial: { label: 'Financial Assistance', path: '/financial' },
  family: { label: 'Family & Children', path: '/family' },
  employment: { label: 'Employment & Education', path: '/employment' },
  crisis: { label: 'Crisis & Safety', path: '/crisis' },
};

const CATEGORY_KEYS = Object.keys(CATEGORY_META);

const normalizeString = (value) => String(value || '').trim();

const normalizeValue = (value) => normalizeString(value).toLowerCase();

const buildTelHref = (phone) => {
  const digits = normalizeString(phone).replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  if (digits.length === 10) {
    return `tel:+1${digits}`;
  }

  return `tel:+${digits}`;
};

const getBlockConfig = (block) => {
  const rows = [...block.children]
    .map((row) => {
      const [keyCell, valueCell] = [...row.children];
      if (!keyCell || !valueCell) {
        return null;
      }

      return {
        key: normalizeValue(keyCell.textContent).replace(/[^a-z]/g, ''),
        value: normalizeString(valueCell.textContent),
      };
    })
    .filter(Boolean);

  return rows.reduce((config, row) => ({ ...config, [row.key]: row.value }), {});
};

const getSlugFromPath = (pathname) => {
  const segments = pathname
    .split('/')
    .map((segment) => normalizeValue(segment))
    .filter(Boolean);

  if (!segments.length) {
    return '';
  }

  const detailIndex = segments.indexOf('resource-detail');
  if (detailIndex >= 0 && segments[detailIndex + 1]) {
    return segments[detailIndex + 1];
  }

  const categoryIndex = segments.findIndex((segment) => CATEGORY_KEYS.includes(segment));
  if (categoryIndex >= 0 && segments[categoryIndex + 1]) {
    return segments[categoryIndex + 1];
  }

  const lastSegment = segments[segments.length - 1];
  if (CATEGORY_KEYS.includes(lastSegment) || lastSegment === 'resource-detail') {
    return '';
  }

  return lastSegment;
};

const resolveResourceKey = (config) => {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = normalizeValue(params.get('r')) || normalizeValue(params.get('id'));
  const fromAuthored = normalizeValue(config.resource)
    || normalizeValue(config.slug)
    || normalizeValue(config.id)
    || normalizeValue(config.resourceid);
  const fromPath = getSlugFromPath(window.location.pathname);

  return fromQuery || fromAuthored || fromPath;
};

const createStatus = (text, variant = 'neutral') => div(
  {
    class: `resource-detail-status resource-detail-status-${variant}`,
    role: 'status',
    'aria-live': 'polite',
  },
  text,
);

const renderErrorState = (block, error) => {
  const fallback = 'We could not load this resource right now. Please try again in a moment.';
  block.replaceChildren(createStatus(error?.message || fallback, 'error'));
};

const renderNotFoundState = (block, key) => {
  const message = key
    ? `No resource was found for "${key}".`
    : 'Choose a resource to view full details.';
  block.replaceChildren(createStatus(message, 'empty'));
};

const getCategoryMeta = (category) => CATEGORY_META[normalizeValue(category)] || null;

const createBreadcrumb = (resource) => {
  const list = ul({ class: 'resource-detail-breadcrumb-list' });
  const categoryMeta = getCategoryMeta(resource.category);
  list.append(li(a({ href: '/' }, 'Home')));

  if (categoryMeta) {
    list.append(li(a({ href: categoryMeta.path }, categoryMeta.label)));
  }

  list.append(li({ 'aria-current': 'page' }, resource.name));

  return nav(
    { class: 'resource-detail-breadcrumb', 'aria-label': 'Breadcrumb' },
    list,
  );
};

const createTagList = (tags = []) => {
  if (!tags.length) {
    return null;
  }

  const tagList = ul({ class: 'resource-detail-tags', 'aria-label': 'Resource tags' });
  tags.forEach((tag) => {
    tagList.append(li(span({ class: 'resource-detail-tag' }, tag)));
  });
  return tagList;
};

const createMetaRow = (label, content) => div(
  { class: 'resource-detail-meta-row' },
  span({ class: 'resource-detail-meta-label' }, `${label}:`),
  span({ class: 'resource-detail-meta-value' }, content),
);

const appendOptionalSection = (container, title, value) => {
  const text = normalizeString(value);
  if (!text) {
    return;
  }

  container.append(
    div(
      { class: 'resource-detail-section' },
      h2(title),
      p(text),
    ),
  );
};

const createActionLinks = (resource) => {
  const actions = ul({ class: 'resource-detail-actions', 'aria-label': 'Resource contact actions' });
  const telHref = buildTelHref(resource.phone);
  const mapsUrl = getMapsUrl(resource.address);

  if (telHref) {
    actions.append(li(a({ class: 'button primary', href: telHref }, 'Call')));
  }

  if (resource.website) {
    actions.append(
      li(
        a(
          {
            class: 'button secondary',
            href: resource.website,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Visit Website',
        ),
      ),
    );
  }

  if (mapsUrl) {
    actions.append(
      li(
        a(
          {
            class: 'button secondary',
            href: mapsUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Get Directions',
        ),
      ),
    );
  }

  return actions.childElementCount ? actions : null;
};

const renderResource = (block, resource) => {
  const detail = div({ class: 'resource-detail-layout' });
  const header = div(
    { class: 'resource-detail-header' },
    createBreadcrumb(resource),
    p({ class: 'resource-detail-category' }, getCategoryMeta(resource.category)?.label || resource.category),
    h2({ class: 'resource-detail-name' }, resource.name),
  );

  if (resource.description) {
    header.append(p({ class: 'resource-detail-description' }, resource.description));
  }

  const actions = createActionLinks(resource);
  if (actions) {
    header.append(actions);
  }

  const meta = div({ class: 'resource-detail-meta' });
  if (resource.lastVerified) {
    meta.append(createMetaRow('Last Verified', resource.lastVerified));
  }
  if (resource.address) {
    meta.append(createMetaRow('Address', resource.address));
  }
  if (resource.phone) {
    meta.append(createMetaRow('Phone', resource.phone));
  }
  if (resource.languages) {
    meta.append(createMetaRow('Languages', resource.languages));
  }

  if (meta.childElementCount) {
    detail.append(header, meta);
  } else {
    detail.append(header);
  }

  appendOptionalSection(detail, 'Hours', resource.hours);
  appendOptionalSection(detail, 'Eligibility', resource.eligibility);

  const tags = createTagList(resource.tags);
  if (tags) {
    detail.append(
      div(
        { class: 'resource-detail-section' },
        h2('Tags'),
        tags,
      ),
    );
  }

  block.replaceChildren(detail);
};

const getResourceByKey = async (key) => {
  const slugState = await getResourceBySlug(key);
  if (slugState.error || slugState.resource) {
    return slugState;
  }

  const allState = await getAllResources();
  if (allState.error) {
    return {
      ...allState,
      resource: null,
    };
  }

  const normalizedKey = normalizeValue(key);
  const resource = allState.resources.find(
    (entry) => normalizeValue(entry.id) === normalizedKey,
  ) || null;

  return {
    ...allState,
    resource,
  };
};

export default async function decorate(block) {
  block.replaceChildren(createStatus('Loading resource details...', 'loading'));

  const config = getBlockConfig(block);
  const resourceKey = resolveResourceKey(config);

  if (!resourceKey) {
    renderNotFoundState(block, resourceKey);
    return;
  }

  const state = await getResourceByKey(resourceKey);
  if (state.error) {
    renderErrorState(block, state.error);
    return;
  }

  if (!state.resource) {
    renderNotFoundState(block, resourceKey);
    return;
  }

  renderResource(block, state.resource);
}
