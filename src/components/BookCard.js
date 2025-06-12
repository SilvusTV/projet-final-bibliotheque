import { createElement as el } from '../core/createElement.js';

export function BookCard({ book }) {
  return el('div', {
      draggable: true,
      ondragstart: (e) => {
        e.dataTransfer.setData('text/plain', String(book.id));
      },
      class: 'draggable',
      style: 'border: 1px solid #ccc; padding: 0.5rem; margin-bottom: 0.5rem;'
    },
    el('strong', {}, book.title),
    el('p', {}, book.author)
  );
}