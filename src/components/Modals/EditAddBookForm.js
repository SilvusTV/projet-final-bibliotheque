import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';
import { useStore } from '../../core/store.js';

export function EditAddBookForm({ book, onClose, key }) {
  const isEdit = Boolean(book);
  const { getState, setState, addToast } = useStore();

  const defaultState = {
    title: book?.title || '',
    author: book?.author?.toString() || '',
    status: book?.status || 'À lire',
    note: book?.note || '',
    comment: book?.comment || ''
  };

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const bookData = {
      id: isEdit ? book.id : Date.now(),
      title: form.title.value,
      author: form.author.value,
      status: book?.status || getState().columns[0]?.id,
      note: form.note.value,
      comment: form.comment.value
    };

    const currentBooks = getState().books;
    const books = isEdit
      ? currentBooks.map(b => b.id === book.id ? bookData : b)
      : [...currentBooks, bookData];

    setState({ books });
    onClose();
    addToast(isEdit ? '✅ Livre modifié avec succès !' : '✅ Livre ajouté avec succès !', 'success');
  }

  return Modal({
    children: [
      el('h2', {}, isEdit ? 'Modifier le livre' : 'Ajouter un livre'),
      el('form', { onsubmit: handleSubmit },
        el('input', {
          placeholder: 'Titre',
          value: defaultState.title,
          name: 'title'
        }),
        el('input', {
          placeholder: 'Auteur',
          value: defaultState.author,
          name: 'author'
        }),
        el('select', {
          value: defaultState.status,
          name: 'status'
        }, ...getState().columns.map(col =>
          el('option', {
            value: col.id,
            ...(col.id === defaultState.status ? { selected: true } : {})
          }, col.title)
        )),
        el('input', {
          type: 'number',
          min: 0,
          max: 5,
          placeholder: 'Note /5',
          value: defaultState.note,
          name: 'note'
        }),
        el('textarea', {
          placeholder: 'Commentaire',
          name: 'comment'
        }, defaultState.comment),
        el('button', { type: 'submit' }, isEdit ? 'Modifier' : 'Ajouter')
      ),
      el('button', {
        onclick: onClose,
        style: 'margin-top: 1rem;'
      }, 'Annuler')
    ]
  });
}