import {
  a,
  li,
  span,
  ul,
} from '../../scripts/dom-helpers.js';

const CATEGORY_TOKEN_MAP = {
  food: '--color-food',
  housing: '--color-housing',
  healthcare: '--color-healthcare',
  legal: '--color-legal',
  financial: '--color-financial',
  family: '--color-family',
  employment: '--color-employment',
  crisis: '--color-crisis',
};

const REQUIRED_KEYS = ['title', 'link'];
const FIELD_KEYS = ['icon', 'title', 'description', 'link'];

const getSlug = (value = '') => value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getCardDataFromColumns = (row) => {
  const [iconCell, titleCell, descriptionCell, linkCell] = [...row.children];
  const link = linkCell?.querySelector('a');
  if (!titleCell || !descriptionCell || !link) {
    return null;
  }

  const iconName = iconCell?.textContent?.trim() || titleCell.textContent.trim();
  const title = titleCell.textContent.trim() || link.textContent.trim();
  const description = descriptionCell.textContent.trim();
  const href = link.getAttribute('href');
  const slug = getSlug(iconName || title);
  const token = CATEGORY_TOKEN_MAP[slug] || '--link-color';

  if (!href || !title) {
    return null;
  }

  return {
    href,
    title,
    description,
    slug,
    token,
  };
};

const normalizeKey = (key = '') => key.toLowerCase().trim().replace(/[^a-z]/g, '');

const parseMarkdownLink = (value = '') => {
  const match = value.trim().match(/^\[[^\]]+\]\(([^)]+)\)$/);
  return match?.[1] || null;
};

const getLinkValue = (cell) => {
  const anchor = cell.querySelector('a');
  if (anchor?.getAttribute('href')) {
    return anchor.getAttribute('href');
  }

  const text = cell.textContent.trim();
  const markdownHref = parseMarkdownLink(text);
  if (markdownHref) {
    return markdownHref;
  }

  return text || null;
};

const getKeyValuePair = (row) => {
  const [keyCell, valueCell] = [...row.children];
  if (!keyCell || !valueCell) {
    return null;
  }

  const key = normalizeKey(keyCell.textContent);
  if (!FIELD_KEYS.includes(key)) {
    return null;
  }

  if (key === 'link') {
    const href = getLinkValue(valueCell);
    return href ? { key, value: href } : null;
  }

  const value = valueCell.textContent.trim();
  return value ? { key, value } : null;
};

const hasRequiredKeys = (card) => REQUIRED_KEYS.every((key) => !!card[key]);

const toCardData = (card) => {
  const iconName = card.icon || card.title;
  const slug = getSlug(iconName);
  return {
    href: card.link,
    title: card.title,
    description: card.description || '',
    slug,
    token: CATEGORY_TOKEN_MAP[slug] || '--link-color',
  };
};

const getCardDataFromKeyValueRows = (block) => {
  const pairs = [...block.children].map(getKeyValuePair).filter(Boolean);
  const cards = [];
  let currentCard = {};

  pairs.forEach(({ key, value }) => {
    if (key === 'icon' && Object.keys(currentCard).length > 0) {
      if (hasRequiredKeys(currentCard)) {
        cards.push(toCardData(currentCard));
      }
      currentCard = {};
    }

    currentCard = {
      ...currentCard,
      [key]: value,
    };
  });

  if (hasRequiredKeys(currentCard)) {
    cards.push(toCardData(currentCard));
  }

  return cards;
};

const createCard = ({
  href,
  title,
  description,
  slug,
  token,
}) => {
  const item = li();
  item.style.setProperty('--category-accent', `var(${token})`);
  item.style.setProperty('--category-icon', `url("/icons/${slug}.svg")`);

  const card = a(
    {
      class: 'category-cards-card',
      href,
      'aria-label': `${title} resources`,
    },
    span(
      { class: 'category-cards-card-icon' },
      span({ class: 'category-cards-card-icon-glyph', 'aria-hidden': 'true' }),
    ),
    span(
      { class: 'category-cards-card-body' },
      span({ class: 'category-cards-card-title' }, title),
      span({ class: 'category-cards-card-description' }, description),
    ),
  );

  item.append(card);
  return item;
};

export default function decorate(block) {
  const isKeyValueFormat = [...block.children].every((row) => row.children.length === 2);
  const data = isKeyValueFormat
    ? getCardDataFromKeyValueRows(block)
    : [...block.children].map(getCardDataFromColumns).filter(Boolean);
  const cards = data.map(createCard);

  const list = ul();
  list.append(...cards);
  block.replaceChildren(list);
}
