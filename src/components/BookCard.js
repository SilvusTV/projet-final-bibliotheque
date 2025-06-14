import {createElement as el} from '../core/createElement.js';

export function BookCard({book}) {
  return el('div', {
      className: 'bookCard draggable',
      draggable: true,
      ondragstart: (e) => {
        e.dataTransfer.setData('text/plain', String(book.id));
      },
    },
    el('strong', {}, book.title),
    el('p', {}, book.author),
    el('button', {
      onclick: () => window.setSelectedBook(book),
      style: 'margin-top: 0.5rem; font-size: 0.8rem;'
    }, 'Voir plus')
  );
}