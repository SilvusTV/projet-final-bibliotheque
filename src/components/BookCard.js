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
      onclick: () => {
        window.setSelectedBookId(book.id);
        window.setState({ isBookDetailOpen: true });
      },
      className: 'btn primary sm',
    }, 'Voir plus')
  );
}