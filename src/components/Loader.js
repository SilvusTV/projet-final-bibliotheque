import { createElement as el } from '../core/createElement.js';

export function Loader() {
  return el('div', {
    style: `
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      fontSize: 1.2rem;
      fontWeight: bold;
      color: #555;
    `
  }, '📦 Chargement de  l\'application en cours...');
}
