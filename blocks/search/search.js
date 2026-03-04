import {
  a,
  article,
  button,
  div,
  form,
  input,
  li,
  option,
  p,
  select,
  span,
  ul,
} from '../../scripts/dom-helpers.js';
import { getMapsUrl } from '../../scripts/scripts.js';
import { getAllResources, searchResources } from '../../scripts/resource-store.js';

const QUERY_PARAM = 'q';
const CATEGORY_PARAM = 'category';
const TAGS_PARAM = 'tags';

const normalizeString = (value) => String(value || '').trim();

const normalizeValue = (value) => normalizeString(value).toLowerCase();

const parseTagsParam = (value) => normalizeString(value)
  .split(',')
  .map((tag) => normalizeValue(tag))
  .filter(Boolean);

const parseStateFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    query: normalizeString(params.get(QUERY_PARAM)),
    category: normalizeValue(params.get(CATEGORY_PARAM)),
    tags: parseTagsParam(params.get(TAGS_PARAM)),
  };
};

const parseBlockConfig = (block) => {
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

const toCanonicalSearch = (state) => {
  const params = new URLSearchParams();
  if (state.query) {
    params.set(QUERY_PARAM, state.query);
  }
  if (state.category) {
    params.set(CATEGORY_PARAM, state.category);
  }
  if (state.tags.length) {
    params.set(TAGS_PARAM, [...new Set(state.tags)].join(','));
  }
  return params.toString();
};

const writeUrlState = (state, mode = 'push') => {
  const search = toCanonicalSearch(state);
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
  if (mode === 'replace') {
    window.history.replaceState({}, '', nextUrl);
    return;
  }

  window.history.pushState({}, '', nextUrl);
};

const sortNames = (values) => [...values].sort((left, right) => left.localeCompare(right));

const getCategoryOptions = (resources) => sortNames(
  [...new Set(resources.map((resource) => normalizeValue(resource.category)).filter(Boolean))],
);

const getTagOptions = (resources) => sortNames(
  [
    ...new Set(
      resources
        .flatMap((resource) => resource.tags || [])
        .map((tag) => normalizeValue(tag))
        .filter(Boolean),
    ),
  ],
);

const createStatus = (text, variant = 'neutral') => div(
  {
    class: [
      'search-status',
      `search-status-${variant}`,
    ].join(' '),
    role: 'status',
    'aria-live': 'polite',
  },
  text,
);

const createMeta = (resource) => {
  const meta = div({ class: 'search-card-meta' });

  if (resource.address) {
    const mapsUrl = getMapsUrl(resource.address);
    const address = p(
      { class: 'search-address' },
      span({ class: 'search-label' }, 'Address: '),
      span(resource.address),
    );

    if (mapsUrl) {
      address.append(' ', a({ href: mapsUrl, target: '_blank', rel: 'noopener noreferrer' }, 'Get Directions'));
    }

    meta.append(address);
  }

  if (resource.phone) {
    const digits = normalizeString(resource.phone).replace(/\D/g, '');
    const telValue = digits ? `tel:+${digits.length === 10 ? `1${digits}` : digits}` : null;
    const phoneContent = telValue ? a({ href: telValue }, resource.phone) : span(resource.phone);
    meta.append(
      p(
        { class: 'search-phone' },
        span({ class: 'search-label' }, 'Phone: '),
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

  const list = ul({ class: 'search-tags', 'aria-label': 'Resource tags' });
  tags.forEach((tag) => {
    list.append(li(span({ class: 'search-tag' }, tag)));
  });

  return list;
};

const createCard = (resource) => {
  const item = li({ class: 'search-item' });
  const card = article({ class: 'search-card' });
  const detailsUrl = `/resource-detail?r=${encodeURIComponent(resource.slug)}`;
  const header = div(
    { class: 'search-card-header' },
    p({ class: 'search-name' }, resource.name),
  );

  if (resource.lastVerified) {
    header.append(span({ class: 'search-verified' }, `Last Verified: ${resource.lastVerified}`));
  }

  card.append(header);

  if (resource.description) {
    card.append(p({ class: 'search-description' }, resource.description));
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
      { class: 'search-actions' },
      a({ class: 'button secondary', href: detailsUrl }, 'View Details'),
    ),
  );

  item.append(card);
  return item;
};

const renderResults = (target, resources) => {
  const list = ul({ class: 'search-results' });
  resources.forEach((resource) => list.append(createCard(resource)));
  target.replaceChildren(list);
};

const syncTagButtonStates = (container, activeTags) => {
  const active = new Set(activeTags);
  container.querySelectorAll('.search-tag-filter').forEach((tagButton) => {
    const tag = tagButton.dataset.tag || '';
    const isActive = active.has(tag);
    tagButton.classList.toggle('is-active', isActive);
    tagButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const getInitialState = (config) => {
  const urlState = parseStateFromUrl();
  if (urlState.query || urlState.category || urlState.tags.length) {
    return urlState;
  }

  return {
    query: normalizeString(config.query || config.q),
    category: normalizeValue(config.category),
    tags: parseTagsParam(config.tags),
  };
};

const toDisplayName = (value) => value
  .split('-')
  .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : ''))
  .join(' ');

export default async function decorate(block) {
  block.replaceChildren(createStatus('Loading search...', 'loading'));
  const config = parseBlockConfig(block);
  const initialState = getInitialState(config);
  const allState = await getAllResources();

  if (allState.error) {
    block.replaceChildren(createStatus(allState.error.message, 'error'));
    return;
  }

  const categoryOptions = getCategoryOptions(allState.resources);
  const tagOptions = getTagOptions(allState.resources);

  const controlsForm = form({ class: 'search-controls', role: 'search', 'aria-label': 'Search directory' });
  const queryInput = input({
    class: 'search-query',
    type: 'search',
    name: QUERY_PARAM,
    placeholder: 'Search resources, services, or tags',
    value: initialState.query,
  });
  const submitButton = button({ type: 'submit', class: 'search-submit' }, 'Search');

  const categorySelect = select({ class: 'search-category', name: CATEGORY_PARAM });
  categorySelect.append(option({ value: '' }, 'All categories'));
  categoryOptions.forEach((category) => {
    categorySelect.append(option({ value: category }, toDisplayName(category)));
  });
  categorySelect.value = initialState.category;

  const tagFilters = div({ class: 'search-tag-filters', role: 'toolbar', 'aria-label': 'Filter by tags' });
  tagOptions.forEach((tag) => {
    const tagButton = button(
      {
        type: 'button',
        class: 'search-tag-filter',
        'aria-pressed': 'false',
        'data-tag': tag,
      },
      tag,
    );
    tagFilters.append(tagButton);
  });

  const count = p({ class: 'search-count', role: 'status', 'aria-live': 'polite' });
  const resultsContainer = div({ class: 'search-results-container' });
  const root = div({ class: 'search-layout' }, controlsForm, tagFilters, count, resultsContainer);

  controlsForm.append(queryInput, categorySelect, submitButton);

  const state = {
    query: initialState.query,
    category: initialState.category,
    tags: [...new Set(initialState.tags.filter((tag) => tagOptions.includes(tag)))],
  };

  const rerender = async (mode = 'replace') => {
    const resultState = await searchResources(state.query, {
      category: state.category,
      tags: state.tags,
    });

    if (resultState.error) {
      resultsContainer.replaceChildren(createStatus(resultState.error.message, 'error'));
      count.textContent = '0 resources shown';
      return;
    }

    if (resultState.resources.length === 0) {
      resultsContainer.replaceChildren(createStatus('No resources matched your filters.', 'empty'));
      count.textContent = '0 resources shown';
    } else {
      renderResults(resultsContainer, resultState.resources);
      count.textContent = `${resultState.resources.length} resource${resultState.resources.length === 1 ? '' : 's'} shown`;
    }

    queryInput.value = state.query;
    categorySelect.value = state.category;
    syncTagButtonStates(tagFilters, state.tags);
    writeUrlState(state, mode);
  };

  controlsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    state.query = normalizeString(queryInput.value);
    rerender('push');
  });

  categorySelect.addEventListener('change', () => {
    state.category = normalizeValue(categorySelect.value);
    rerender('push');
  });

  tagFilters.addEventListener('click', (event) => {
    const target = event.target.closest('button.search-tag-filter');
    if (!target) {
      return;
    }

    const tag = normalizeValue(target.dataset.tag);
    const tagSet = new Set(state.tags);
    if (tagSet.has(tag)) {
      tagSet.delete(tag);
    } else {
      tagSet.add(tag);
    }

    state.tags = [...tagSet];
    rerender('push');
  });

  window.addEventListener('popstate', () => {
    const nextState = parseStateFromUrl();
    state.query = nextState.query;
    state.category = nextState.category;
    state.tags = nextState.tags.filter((tag) => tagOptions.includes(tag));
    rerender('replace');
  });

  block.replaceChildren(root);
  await rerender('replace');
}
