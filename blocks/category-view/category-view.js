import {
  a,
  article,
  button,
  div,
  li,
  p,
  span,
  ul,
} from '../../scripts/dom-helpers.js';
import { getMapsUrl } from '../../scripts/scripts.js';
import { getResourcesByCategory } from '../../scripts/resource-store.js';

const CATEGORY_PATH_KEYS = [
  'food',
  'housing',
  'healthcare',
  'legal',
  'financial',
  'family',
  'employment',
  'crisis',
];

const normalizeString = (value) => String(value || '').trim();

const normalizeValue = (value) => normalizeString(value).toLowerCase();

const parseTagFilter = (value) => normalizeString(value)
  .split(',')
  .map((tag) => normalizeValue(tag))
  .filter(Boolean);

const getBlockConfig = (block) => {
  const pairs = [...block.children]
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

  return pairs.reduce((config, { key, value }) => ({
    ...config,
    [key]: value,
  }), {});
};

const getCategoryFromPath = (pathname) => {
  const segments = pathname
    .split('/')
    .map((segment) => normalizeValue(segment))
    .filter(Boolean);

  return segments.find((segment) => CATEGORY_PATH_KEYS.includes(segment)) || '';
};

const getResolvedCategory = (blockConfig) => {
  const queryCategory = normalizeValue(new URLSearchParams(window.location.search).get('c'));
  const pathCategory = getCategoryFromPath(window.location.pathname);
  const authoredCategory = normalizeValue(blockConfig.category);
  return queryCategory || authoredCategory || pathCategory;
};

const getAvailableTags = (resources) => [
  ...new Set(resources.flatMap((resource) => resource.tags || [])),
]
  .map((tag) => normalizeValue(tag))
  .filter(Boolean)
  .sort((left, right) => left.localeCompare(right));

const sortByName = (resources, ascending = true) => [...resources]
  .sort((left, right) => {
    const comparison = left.name.localeCompare(right.name, 'en', { sensitivity: 'base' });
    return ascending ? comparison : -comparison;
  });

const filterByTags = (resources, activeTags) => {
  if (!activeTags.length) {
    return resources;
  }

  return resources.filter((resource) => {
    const resourceTags = (resource.tags || []).map((tag) => normalizeValue(tag));
    return activeTags.every((tag) => resourceTags.includes(tag));
  });
};

const createMeta = (resource) => {
  const meta = div({ class: 'category-view-card-meta' });

  if (resource.address) {
    const mapsUrl = getMapsUrl(resource.address);
    const address = p(
      { class: 'category-view-address' },
      span({ class: 'category-view-label' }, 'Address: '),
      span(resource.address),
    );
    if (mapsUrl) {
      address.append(' ', a({ href: mapsUrl, target: '_blank', rel: 'noopener noreferrer' }, 'Get Directions'));
    }
    meta.append(address);
  }

  if (resource.phone) {
    const digits = String(resource.phone).replace(/\D/g, '');
    const telValue = digits ? `tel:+${digits.length === 10 ? `1${digits}` : digits}` : null;
    const phoneContent = telValue
      ? a({ href: telValue }, resource.phone)
      : span(resource.phone);
    meta.append(
      p(
        { class: 'category-view-phone' },
        span({ class: 'category-view-label' }, 'Phone: '),
        phoneContent,
      ),
    );
  }

  return meta;
};

const createTags = (tags = []) => {
  if (!tags.length) {
    return null;
  }

  const list = ul({ class: 'category-view-tags', 'aria-label': 'Resource tags' });
  tags.forEach((tag) => {
    list.append(li(span({ class: 'category-view-tag' }, tag)));
  });

  return list;
};

const createCard = (resource) => {
  const item = li({ class: 'category-view-item' });
  const detailsUrl = `/resource-detail?r=${encodeURIComponent(resource.slug)}`;
  const card = article({ class: 'category-view-card' });
  const header = div(
    { class: 'category-view-card-header' },
    p({ class: 'category-view-name' }, resource.name),
  );

  if (resource.lastVerified) {
    header.append(span({ class: 'category-view-verified' }, `Last Verified: ${resource.lastVerified}`));
  }

  card.append(header);

  if (resource.description) {
    card.append(p({ class: 'category-view-description' }, resource.description));
  }

  const meta = createMeta(resource);
  if (meta.childElementCount > 0) {
    card.append(meta);
  }

  const tags = createTags(resource.tags);
  if (tags) {
    card.append(tags);
  }

  card.append(
    p(
      { class: 'category-view-actions' },
      a({ class: 'button secondary', href: detailsUrl }, 'View Details'),
    ),
  );

  item.append(card);
  return item;
};

const renderResults = (target, resources) => {
  const list = ul({ class: 'category-view-results' });
  resources.forEach((resource) => list.append(createCard(resource)));
  target.replaceChildren(list);
};

const setFilterButtonStates = (container, activeTag) => {
  container.querySelectorAll('.category-view-filter').forEach((filterButton) => {
    const isAll = filterButton.dataset.tag === 'all';
    const isActive = (isAll && activeTag === 'all') || filterButton.dataset.tag === activeTag;
    filterButton.classList.toggle('is-active', isActive);
    filterButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const setSortButtonState = (buttonElement, ascending) => {
  buttonElement.textContent = ascending ? 'Sort: A-Z' : 'Sort: Z-A';
  buttonElement.setAttribute('aria-pressed', ascending ? 'false' : 'true');
};

const createControls = ({ tags, onFilterChange, onSortChange }) => {
  const controls = div({ class: 'category-view-controls' });
  const filters = div(
    { class: 'category-view-filters', role: 'toolbar', 'aria-label': 'Filter resources by tag' },
  );

  const allButton = button({
    type: 'button',
    class: 'category-view-filter is-active',
    'aria-pressed': 'true',
    'data-tag': 'all',
  }, 'All');
  allButton.addEventListener('click', () => onFilterChange('all'));
  filters.append(allButton);

  tags.forEach((tag) => {
    const filterButton = button({
      type: 'button',
      class: 'category-view-filter',
      'aria-pressed': 'false',
      'data-tag': tag,
    }, tag);
    filterButton.addEventListener('click', () => onFilterChange(tag));
    filters.append(filterButton);
  });

  const sortButton = button({
    type: 'button',
    class: 'category-view-sort',
    'aria-pressed': 'false',
    'aria-label': 'Toggle alphabetical sort order',
  }, 'Sort: A-Z');
  sortButton.addEventListener('click', () => onSortChange());
  controls.append(filters, sortButton);

  return { controls, filters, sortButton };
};

const createStatus = (text, status = 'neutral') => div(
  {
    class: `category-view-status category-view-status-${status}`,
    role: 'status',
    'aria-live': 'polite',
  },
  text,
);

const renderErrorState = (block, state) => {
  const fallbackMessage = 'We could not load resources right now. Please try again in a moment.';
  const message = state.error?.message || fallbackMessage;
  block.replaceChildren(createStatus(message, 'error'));
};

const renderEmptyState = (block, category) => {
  const message = category
    ? `No resources found for ${category}.`
    : 'No resources found.';
  block.replaceChildren(createStatus(message, 'empty'));
};

const renderReadyState = (block, resources) => {
  let activeTag = 'all';
  let ascending = true;

  const tags = getAvailableTags(resources);
  const resultsContainer = div({ class: 'category-view-results-container' });
  const count = p({ class: 'category-view-count', role: 'status', 'aria-live': 'polite' });
  let rerender = () => {};

  const { controls, filters, sortButton } = createControls({
    tags,
    onFilterChange: (nextTag) => {
      activeTag = nextTag;
      rerender();
    },
    onSortChange: () => {
      ascending = !ascending;
      rerender();
    },
  });

  rerender = () => {
    const filtered = activeTag === 'all'
      ? resources
      : filterByTags(resources, parseTagFilter(activeTag));
    const sorted = sortByName(filtered, ascending);
    count.textContent = `${sorted.length} resource${sorted.length === 1 ? '' : 's'} shown`;
    renderResults(resultsContainer, sorted);
    setFilterButtonStates(filters, activeTag);
    setSortButtonState(sortButton, ascending);
  };

  block.replaceChildren(controls, count, resultsContainer);
  rerender();
};

export default async function decorate(block) {
  const loadingState = createStatus('Loading resources...', 'loading');
  block.replaceChildren(loadingState);

  const config = getBlockConfig(block);
  const category = getResolvedCategory(config);
  const state = await getResourcesByCategory(category);

  if (state.error) {
    renderErrorState(block, state);
    return;
  }

  if (!state.resources.length) {
    renderEmptyState(block, category);
    return;
  }

  renderReadyState(block, state.resources);
}
