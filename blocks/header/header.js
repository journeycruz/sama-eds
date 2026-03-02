import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import {
  a,
  button,
  div,
  nav,
  span,
  ul,
  li,
} from '../../scripts/dom-helpers.js';
import { loadFragment } from '../fragment/fragment.js';

const desktopMediaQuery = window.matchMedia('(min-width: 900px)');
const LOGO_BREAKPOINTS = [{ media: '(min-width: 900px)', width: '240' }, { width: '160' }];

const getNodeChildren = (element) => (element ? [...element.children] : []);

const getFragmentNodes = (fragment) => {
  const [first] = getNodeChildren(fragment);
  const wrapper = first?.querySelector(':scope > .default-content-wrapper') || first;
  const nodes = getNodeChildren(wrapper);
  return nodes.length ? nodes : getNodeChildren(fragment);
};

const getBrandNode = (nodes) => {
  const candidates = nodes.filter((node) => node.matches('p, picture, img, h1, h2, h3, a'));
  return candidates.find((node) => node.querySelector('picture, img')) || candidates[0] || null;
};

const getNavParts = (fragment) => {
  const nodes = getFragmentNodes(fragment);
  const lists = nodes.filter((node) => node.matches('ul, ol'));
  return {
    brandNode: getBrandNode(nodes),
    sectionList: lists[0] || null,
    toolsList: lists[1] || null,
  };
};

const getAnchor = (item) => item.querySelector(':scope > a') || item.querySelector('a');

const listToLinks = (listElement) => {
  if (!listElement) return [];
  return getNodeChildren(listElement)
    .map((item) => getAnchor(item))
    .filter(Boolean)
    .map((link) => ({
      href: link.getAttribute('href') || '#',
      label: link.textContent.trim(),
    }))
    .filter((link) => link.label);
};

const createHeaderLogo = (alt = 'Site logo') => {
  const logoSrc = new URL('/icons/logo.svg', window.location.origin).href;
  return createOptimizedPicture(logoSrc, alt, true, LOGO_BREAKPOINTS);
};

const cleanBrandNode = (brandNode) => {
  if (!brandNode) {
    return a({ href: '/', 'aria-label': 'Home' }, createHeaderLogo('Site logo'));
  }

  const brand = brandNode.cloneNode(true);
  const buttonLink = brand.querySelector('.button');
  if (buttonLink) {
    buttonLink.className = '';
    const container = buttonLink.closest('.button-container');
    if (container) container.className = '';
  }

  const sourceImage = brandNode.querySelector('picture img, img');
  const logoAlt = sourceImage?.getAttribute('alt') || brand.textContent.trim() || 'Site logo';
  const optimizedLogo = createHeaderLogo(logoAlt);

  const logoTarget = brand.querySelector('picture, img');
  if (logoTarget) {
    logoTarget.replaceWith(optimizedLogo);
  } else {
    const logoContainer = brand.querySelector('a') || brand;
    logoContainer.prepend(optimizedLogo);
  }

  return brand;
};

const createLinkList = (links, className) => ul(
  { class: className },
  ...links.map((link, index) => li(
    { class: `${className}-item` },
    a(
      { href: link.href, class: `${className}-link${index === links.length - 1 ? ' is-last' : ''}` },
      link.label,
    ),
  )),
);

const setMenuState = (root, isExpanded, toggleButton) => {
  root.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  toggleButton.setAttribute('aria-label', isExpanded ? 'Close navigation' : 'Open navigation');
  document.body.style.overflowY = isExpanded ? 'hidden' : '';
};

const resetMenuOnDesktop = (root, toggleButton) => {
  if (desktopMediaQuery.matches) {
    setMenuState(root, false, toggleButton);
  }
};

const bindMenuEvents = (root, toggleButton, closeButton, overlay) => {
  const toggleMenu = (forceState) => {
    const currentState = root.getAttribute('aria-expanded') === 'true';
    const nextState = typeof forceState === 'boolean' ? forceState : !currentState;
    setMenuState(root, nextState, toggleButton);
    if (nextState) {
      closeButton.focus();
    } else {
      toggleButton.focus();
    }
  };

  toggleButton.addEventListener('click', () => toggleMenu());
  closeButton.addEventListener('click', () => toggleMenu(false));
  overlay.addEventListener('click', () => toggleMenu(false));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') toggleMenu(false);
  });

  desktopMediaQuery.addEventListener('change', () => resetMenuOnDesktop(root, toggleButton));
};

const buildHeader = ({ brandNode, sectionLinks, toolLinks }) => {
  const navId = 'nav';
  const mobileMenuId = 'mobile-menu';
  const brandDesktop = cleanBrandNode(brandNode);
  const brandMobile = cleanBrandNode(brandNode);

  const toggleButton = button(
    {
      type: 'button',
      class: 'nav-toggle',
      'aria-label': 'Open navigation',
      'aria-controls': mobileMenuId,
    },
    span({ class: 'sr-only' }, 'Open main menu'),
    span({ class: 'nav-toggle-icon', 'aria-hidden': 'true' }),
  );

  const closeButton = button(
    { type: 'button', class: 'nav-close', 'aria-label': 'Close navigation' },
    span({ class: 'sr-only' }, 'Close main menu'),
    span({ class: 'nav-close-icon', 'aria-hidden': 'true' }),
  );

  const root = nav(
    {
      id: navId,
      class: 'nav-root',
      'aria-label': 'Global',
      'aria-expanded': 'false',
    },
    div(
      { class: 'nav-shell' },
      div({ class: 'nav-brand' }, brandDesktop),
      div({ class: 'nav-links', 'aria-label': 'Primary navigation' }, createLinkList(sectionLinks, 'nav-links-list')),
      div({ class: 'nav-tools' }, createLinkList(toolLinks, 'nav-tools-list')),
      toggleButton,
    ),
    button({
      type: 'button',
      class: 'nav-overlay',
      'aria-hidden': 'true',
      tabindex: '-1',
    }),
    div(
      { id: mobileMenuId, class: 'nav-panel' },
      div(
        { class: 'nav-panel-header' },
        div({ class: 'nav-panel-brand' }, brandMobile),
        closeButton,
      ),
      div(
        { class: 'nav-panel-body' },
        div({ class: 'nav-panel-links' }, createLinkList(sectionLinks, 'nav-panel-links-list')),
        div({ class: 'nav-panel-tools' }, createLinkList(toolLinks, 'nav-panel-tools-list')),
      ),
    ),
  );

  const overlay = root.querySelector('.nav-overlay');
  bindMenuEvents(root, toggleButton, closeButton, overlay);
  return root;
};

/**
 * loads and decorates the header block
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const { brandNode, sectionList, toolsList } = getNavParts(fragment);

  const header = buildHeader({
    brandNode,
    sectionLinks: listToLinks(sectionList),
    toolLinks: listToLinks(toolsList),
  });

  block.replaceChildren(div({ class: 'nav-wrapper' }, header));
}
