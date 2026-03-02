import {
  a,
  div,
  h1,
  p,
  span,
} from '../../scripts/dom-helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const getText = (element) => (element ? element.textContent.trim() : '');

const normalizeLinks = (elements = []) => Array.from(elements)
  .filter((link) => link && getText(link))
  .map((link) => ({
    href: link.getAttribute('href') || '#',
    label: getText(link),
  }));

const parseLinkToken = (token = '') => {
  const value = token.trim();
  if (!value) return null;
  if (value.includes('#')) {
    const [label, href = '#'] = value.split('#');
    return { label: label.trim(), href: `#${href.trim()}` };
  }
  return { label: value, href: '#' };
};

const getCellLink = (cell) => {
  const link = cell?.querySelector('a');
  if (!link) return null;
  return {
    href: link.getAttribute('href') || '#',
    label: getText(link),
  };
};

const getCellUrl = (cell) => {
  const cellLink = getCellLink(cell);
  if (cellLink?.href) return cellLink.href;
  return getText(cell);
};

const getConfigRows = (block) => [...block.querySelectorAll(':scope > div')]
  .map((row) => [...row.children])
  .filter((cells) => cells.length >= 2)
  .map((cells) => ({
    key: getText(cells[0]).toLowerCase(),
    valueCell: cells[1],
  }));

const createActionFromLabelAndLink = (label, href) => {
  const actionLabel = label.trim();
  if (!actionLabel) return null;
  const actionHref = href.trim() || '#';
  return { label: actionLabel, href: actionHref };
};

const getHeroDataFromConfigRows = (block) => {
  const rows = getConfigRows(block);
  const hasConfig = rows.some((row) => row.key && row.key !== 'hero');
  if (!hasConfig) return null;

  const data = {
    brandText: 'Company',
    logoSrc: '',
    navLinks: [],
    loginLink: null,
    heading: '',
    description: '',
    primaryAction: null,
    secondaryAction: null,
    galleryImages: [],
  };

  let primaryActionLabel = '';
  let primaryActionHref = '';
  let secondaryActionLabel = '';
  let secondaryActionHref = '';

  rows.forEach(({ key, valueCell }) => {
    if (key === 'brand name') data.brandText = getText(valueCell) || data.brandText;
    if (key === 'brand logo') data.logoSrc = getCellUrl(valueCell);
    if (key === 'nav links') {
      const links = normalizeLinks(valueCell.querySelectorAll('a'));
      data.navLinks = links.length
        ? links
        : getText(valueCell).split('/').map((token) => parseLinkToken(token)).filter(Boolean);
    }
    if (key === 'login link') data.loginLink = getCellLink(valueCell) || parseLinkToken(getText(valueCell));
    if (key === 'heading') data.heading = getText(valueCell);
    if (key === 'body') data.description = getText(valueCell);
    if (key === 'primary cta') {
      data.primaryAction = getCellLink(valueCell) || parseLinkToken(getText(valueCell));
    }
    if (key === 'secondary cta') {
      data.secondaryAction = getCellLink(valueCell)
        || parseLinkToken(getText(valueCell));
    }
    if (key === 'primary cta label') primaryActionLabel = getText(valueCell);
    if (key === 'primary cta link') primaryActionHref = getCellUrl(valueCell);
    if (key === 'secondary cta label') secondaryActionLabel = getText(valueCell);
    if (key === 'secondary cta link') secondaryActionHref = getCellUrl(valueCell);
    if (/^image\s+\d+$/u.test(key)) {
      const src = getCellUrl(valueCell);
      if (src) {
        data.galleryImages.push({
          src,
          alt: `${data.brandText} gallery image ${data.galleryImages.length + 1}`,
        });
      }
    }
  });

  const primaryActionFromRows = createActionFromLabelAndLink(primaryActionLabel, primaryActionHref);
  const secondaryActionFromRows = createActionFromLabelAndLink(
    secondaryActionLabel,
    secondaryActionHref,
  );
  if (primaryActionFromRows) data.primaryAction = primaryActionFromRows;
  if (secondaryActionFromRows) data.secondaryAction = secondaryActionFromRows;

  return data;
};

const getHeroData = (block) => {
  const configData = getHeroDataFromConfigRows(block);
  if (configData) return configData;

  const root = block.querySelector(':scope > div') || block;
  const brandText = getText(root.querySelector('.sr-only')) || 'Company';
  const logo = root.querySelector('header img');
  const navLinks = normalizeLinks(root.querySelectorAll('header nav > div:nth-child(3) a'));
  const loginLink = root.querySelector('header nav > div:nth-child(4) a');
  const heading = root.querySelector('main h1');
  const description = root.querySelector('main p');
  const actionLinks = normalizeLinks(root.querySelectorAll('main h1 + p + div a'));
  const galleryImages = [...root.querySelectorAll('main img')]
    .map((imageNode, index) => ({
      src: imageNode.getAttribute('src'),
      alt: imageNode.getAttribute('alt') || `${brandText} gallery image ${index + 1}`,
    }))
    .filter((imageData) => imageData.src);

  return {
    brandText,
    logoSrc: logo ? logo.getAttribute('src') : '',
    navLinks,
    loginLink: loginLink ? normalizeLinks([loginLink])[0] : null,
    heading: getText(heading),
    description: getText(description),
    primaryAction: actionLinks[0] || null,
    secondaryAction: actionLinks[1] || null,
    galleryImages,
  };
};

const createImageCard = (imageData, index) => {
  const picture = createOptimizedPicture(imageData.src, imageData.alt, index === 0);
  const image = picture.querySelector('img');
  if (image) {
    image.decoding = 'async';
  }

  return div(
    { class: `hero-gallery-item hero-gallery-item-${index + 1}` },
    picture,
    div({ class: 'hero-gallery-ring', 'aria-hidden': 'true' }),
  );
};

const createGallery = (images) => {
  const imageSet = images.slice(0, 5);
  const colA = imageSet[0] ? [createImageCard(imageSet[0], 0)] : [];
  const colB = [imageSet[1], imageSet[2]]
    .filter(Boolean)
    .map((imageData, idx) => createImageCard(imageData, idx + 1));
  const colC = [imageSet[3], imageSet[4]]
    .filter(Boolean)
    .map((imageData, idx) => createImageCard(imageData, idx + 3));

  return div(
    { class: 'hero-gallery' },
    div({ class: 'hero-gallery-col hero-gallery-col-a' }, ...colA),
    div({ class: 'hero-gallery-col hero-gallery-col-b' }, ...colB),
    div({ class: 'hero-gallery-col hero-gallery-col-c' }, ...colC),
  );
};

const createDecorativeLayer = () => div(
  { class: 'hero-decorative-layer', 'aria-hidden': 'true' },
  div({ class: 'hero-grid-pattern' }),
);

const buildHero = (data) => div(
  { class: 'hero-shell' },
  div(
    { class: 'hero-stage' },
    createDecorativeLayer(),
    div(
      { class: 'hero-copy' },
      h1(data.heading || 'We are changing the way people connect'),
      p(data.description || 'Update this text in your authored content to describe the mission and value proposition.'),
      div(
        { class: 'hero-actions' },
        data.primaryAction
          ? a({ class: 'button primary', href: data.primaryAction.href }, data.primaryAction.label)
          : '',
        data.secondaryAction
          ? a(
            { class: 'hero-secondary-link', href: data.secondaryAction.href },
            data.secondaryAction.label,
            span({ 'aria-hidden': 'true' }, ' →'),
          )
          : '',
      ),
    ),
    createGallery(data.galleryImages),
  ),
);

export default function decorate(block) {
  const data = getHeroData(block);
  const hero = buildHero(data);
  block.replaceChildren(hero);
}
