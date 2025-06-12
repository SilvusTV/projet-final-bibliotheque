import { createElement as el } from '../core/createElement.js';
import { useState } from '../core/hook/useState.js';
import { useStore } from '../core/store.js';

export function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('À lire');
  const { getState, setState } = useStore();

  function handleSubmit(e) {
    e.preventDefault();
    const newBook = {
      id: Date.now(),
      title,
      author,
      status,
    };
    const books = [...getState().books, newBook];
    setState({ books });
    setTitle('');
    setAuthor('');
    setStatus('À lire');
  }

  return el('form', {
    onsubmit: handleSubmit,
    className: 'add-book-form'
  },
  el('input', {
    placeholder: 'Titre',
    value: title,
    oninput: (e) => setTitle(e.target.value),
  }),
  el('input', {
    placeholder: 'Auteur',
    value: author,
    oninput: (e) => setAuthor(e.target.value),
  }),
  el('select', {
    onchange: (e) => setStatus(e.target.value),
    value: status,
  },
    ...getState().columns.map((col) => el('option', { value: col }, col))
  ),
  el('button', { type: 'submit' }, 'Ajouter')
);

}