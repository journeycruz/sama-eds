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
import { formatPhone, getMapsUrl } from '../../scripts/scripts.js';

const RESOURCE_KEYS = ['name', 'description', 'address', 'phone', 'tags', 'lastverified'];

const normalizeKey = (value = '') => value.toLowerCase().trim().replace(/[^a-z]/g, '');

const getText = (cell) => cell?.textContent?.trim() || '';

const parseTags = (value = '') => value
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean);

const parsePhone = (value = '') => {
  const normalized = String(value).trim();
  const digits = normalized.replace(/\D/g, '');
  const localDigits = digits.length === 11 && digits.startsWith('1')
    ? digits.slice(1)
    : digits;

  let tel = null;
  if (localDigits.length === 10) {
    tel = `+1${localDigits}`;
  } else if (digits) {
    tel = `+${digits}`;
  }

  return {
    display: formatPhone(normalized),
    href: tel ? `tel:${tel}` : null,
  };
};

const parseRowAsColumns = (row) => {
  const [
    nameCell,
    descriptionCell,
    addressCell,
    phoneCell,
    tagsCell,
    lastVerifiedCell,
  ] = [...row.children];
  const name = getText(nameCell);
  if (!name) {
    return null;
  }

  const address = getText(addressCell);
  return {
    name,
    description: getText(descriptionCell),
    address,
    phone: getText(phoneCell),
    tags: parseTags(getText(tagsCell)),
    lastVerified: getText(lastVerifiedCell),
    mapsUrl: getMapsUrl(address),
  };
};

const getPairs = (row) => {
  const [keyCell, valueCell] = [...row.children];
  if (!keyCell || !valueCell) {
    return null;
  }

  const key = normalizeKey(getText(keyCell));
  if (!RESOURCE_KEYS.includes(key)) {
    return null;
  }

  return { key, value: getText(valueCell) };
};

const parseRowsAsKeyValue = (block) => {
  const resources = [];
  let current = {};

  [...block.children].map(getPairs).filter(Boolean).forEach(({ key, value }) => {
    if (key === 'name' && current.name) {
      resources.push(current);
      current = {};
    }

    current = {
      ...current,
      [key]: key === 'tags' ? parseTags(value) : value,
    };
  });

  if (current.name) {
    resources.push(current);
  }

  return resources.map((resource) => ({
    ...resource,
    mapsUrl: getMapsUrl(resource.address),
    tags: Array.isArray(resource.tags) ? resource.tags : [],
  }));
};

const parseResources = (block) => {
  const rows = [...block.children];
  if (rows.length === 0) {
    return [];
  }

  const isKeyValue = rows.every((row) => row.children.length === 2);
  if (isKeyValue) {
    return parseRowsAsKeyValue(block);
  }

  return rows.map(parseRowAsColumns).filter(Boolean);
};

const getAllTags = (resources) => [...new Set(resources.flatMap((resource) => resource.tags))]
  .sort((left, right) => left.localeCompare(right));

const getVisibleResources = (resources, activeTag, ascending) => resources
  .filter((resource) => activeTag === 'all' || resource.tags.includes(activeTag))
  .toSorted((left, right) => {
    const comparison = left.name.localeCompare(right.name);
    return ascending ? comparison : -comparison;
  });

const createMetaRow = (resource) => {
  const row = div({ class: 'resource-listing-meta' });

  if (resource.address) {
    const addressText = span({ class: 'resource-listing-address-text' }, resource.address);
    const address = p({ class: 'resource-listing-address' }, span({ class: 'resource-listing-label' }, 'Address: '), addressText);
    if (resource.mapsUrl) {
      address.append(' ', a({ href: resource.mapsUrl, target: '_blank', rel: 'noopener noreferrer' }, 'Get Directions'));
    }
    row.append(address);
  }

  if (resource.phone) {
    const phoneLink = a(
      { href: parsePhone(resource.phone).href || '#', class: 'resource-listing-phone-link' },
      parsePhone(resource.phone).display,
    );
    if (!parsePhone(resource.phone).href) {
      phoneLink.removeAttribute('href');
    }
    row.append(p({ class: 'resource-listing-phone' }, span({ class: 'resource-listing-label' }, 'Phone: '), phoneLink));
  }

  return row;
};

const createTagList = (tags) => {
  if (!tags.length) {
    return null;
  }

  const list = ul({ class: 'resource-listing-tags', 'aria-label': 'Resource tags' });
  tags.forEach((tag) => {
    list.append(li(span({ class: 'resource-listing-tag' }, tag)));
  });
  return list;
};

const createResourceCard = (resource) => {
  const item = li({ class: 'resource-listing-item' });
  const card = article({ class: 'resource-listing-card' });
  const header = div(
    { class: 'resource-listing-card-header' },
    p({ class: 'resource-listing-name' }, resource.name),
  );

  if (resource.lastVerified) {
    header.append(span({ class: 'resource-listing-verified' }, `Last Verified: ${resource.lastVerified}`));
  }

  card.append(header);

  if (resource.description) {
    card.append(p({ class: 'resource-listing-description' }, resource.description));
  }

  const meta = createMetaRow(resource);
  if (meta.childElementCount > 0) {
    card.append(meta);
  }

  const tags = createTagList(resource.tags);
  if (tags) {
    card.append(tags);
  }

  item.append(card);
  return item;
};

const createControls = (tags, onFilterChange, onSortChange) => {
  const controls = div({ class: 'resource-listing-controls' });
  const filters = div({ class: 'resource-listing-filters', role: 'toolbar', 'aria-label': 'Filter resources by tag' });

  const allButton = button({ type: 'button', class: 'resource-listing-filter is-active', 'aria-pressed': 'true' }, 'All');
  allButton.addEventListener('click', () => onFilterChange('all'));
  filters.append(allButton);

  tags.forEach((tag) => {
    const filterButton = button({ type: 'button', class: 'resource-listing-filter', 'aria-pressed': 'false' }, tag);
    filterButton.addEventListener('click', () => onFilterChange(tag));
    filters.append(filterButton);
  });

  const sortButton = button(
    {
      type: 'button',
      class: 'resource-listing-sort',
      'aria-pressed': 'false',
      'aria-label': 'Toggle alphabetical sort order',
    },
    'Sort: A-Z',
  );
  sortButton.addEventListener('click', () => onSortChange());

  controls.append(filters, sortButton);
  return controls;
};

const updateFilterButtons = (block, activeTag) => {
  block.querySelectorAll('.resource-listing-filter').forEach((filterButton) => {
    const isActive = (activeTag === 'all' && filterButton.textContent === 'All')
      || filterButton.textContent === activeTag;
    filterButton.classList.toggle('is-active', isActive);
    filterButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const updateSortButton = (block, ascending) => {
  const sortButton = block.querySelector('.resource-listing-sort');
  sortButton.textContent = ascending ? 'Sort: A-Z' : 'Sort: Z-A';
  sortButton.setAttribute('aria-pressed', ascending ? 'false' : 'true');
};

const renderResources = (target, resources) => {
  const list = ul({ class: 'resource-listing-results' });
  resources.forEach((resource) => list.append(createResourceCard(resource)));
  target.replaceChildren(list);
};

export default function decorate(block) {
  const resources = parseResources(block);
  const tags = getAllTags(resources);

  let activeTag = 'all';
  let ascending = true;

  const resultsContainer = div({ class: 'resource-listing-results-container' });

  const rerender = () => {
    const visibleResources = getVisibleResources(resources, activeTag, ascending);
    renderResources(resultsContainer, visibleResources);
    updateFilterButtons(block, activeTag);
    updateSortButton(block, ascending);
  };

  const controls = createControls(
    tags,
    (selectedTag) => {
      activeTag = selectedTag;
      rerender();
    },
    () => {
      ascending = !ascending;
      rerender();
    },
  );

  block.replaceChildren(controls, resultsContainer);
  rerender();
}
