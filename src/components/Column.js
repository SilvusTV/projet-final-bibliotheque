import { createElement as el } from '../core/createElement.js';
import { BookCard } from './BookCard.js';
import { useStore } from '../core/store.js';

export function Column({ column }) {
  const { getState, setState } = useStore();
  const { books } = getState();
  const filteredBooks = books.filter((b) => b.status === column.id);

  function handleDrop(e) {
    e.preventDefault();
    const bookId = e.dataTransfer.getData('text/plain');
    if (!bookId) return;
    const updatedBooks = books.map((b) =>
      b.id === bookId ? { ...b, status: column.id } : b
    );
    setState({ books: updatedBooks });
  }

  return el('div', {
      className:'column',
      style: column.color ? `border-top: 4px solid ${column.color};` : '',
      ondragover: (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('column-hover');
      },
      ondragleave: (e) => {
        e.currentTarget.classList.remove('column-hover');
      },
      ondrop: (e) => {
        handleDrop(e);
        e.currentTarget.classList.remove('column-hover');
      }
    },
    el('h2', { style: column.color ? `color: ${column.color};` : '' }, column.title),
    ...filteredBooks.map((book) => el(BookCard, { book }))
  );
}
