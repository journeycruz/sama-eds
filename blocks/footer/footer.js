import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const content = footer.querySelector('.default-content-wrapper');
  const links = content?.querySelector('ul');

  const paragraphs = content ? [...content.querySelectorAll(':scope > p')] : [];
  if (paragraphs[0]) paragraphs[0].classList.add('footer-title');
  if (paragraphs[1]) paragraphs[1].classList.add('footer-disclaimer');
  if (paragraphs[2]) paragraphs[2].classList.add('footer-credit');
  if (paragraphs[3]) paragraphs[3].classList.add('footer-updated');

  if (links) links.classList.add('footer-links');

  block.append(footer);
}
