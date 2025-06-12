import { createElement as el } from '../core/createElement.js';
import { useStore } from '../core/store.js';

export function AddBookForm() {
  const { getState, setState } = useStore();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const bookTitle = form.elements[0].value;
    const bookAuthor = form.elements[1].value;
    const bookStatus = form.elements[2].value;
    const newBook = {
      id: Date.now(),
      title: bookTitle,
      author: bookAuthor,
      status: bookStatus,
    };
    const books = [...getState().books, newBook];
    setState({ books });
  }

  return el('form', { onsubmit: handleSubmit, style: 'margin-bottom: 1rem;' },
    el('input', {
      placeholder: 'Titre',
    }),
    el('input', {
      placeholder: 'Auteur',
    }),
    el('select', {
      },
      ...getState().columns.map((col) => el('option', { value: col }, col))
    ),
    el('button', { type: 'submit' }, 'Ajouter')
  );
}