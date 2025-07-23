import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';
import { useStore } from '../../core/store.js';
import { Input } from '../Input.js';

export function EditAddBookForm({ book, onClose, key }) {
  const isEdit = Boolean(book);
  const { getState, setState, addToast } = useStore();

  const defaultState = {
    title: book?.title || '',
    author: book?.author?.toString() || '',
    status: book?.status || getState().columns[0]?.id,
    note: book?.note || '',
    comment: book?.comment || ''
  };

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const bookData = {
      id: isEdit ? book.id : Date.now().toString(),
      title: form.title.value,
      author: form.author.value,
      status: Number(form.status.value),
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
    id: 'edit-add-book-modal',
    children: [
      el('h2', {}, isEdit ? 'Modifier le livre' : 'Ajouter un livre'),
      el('form', { onsubmit: handleSubmit },
        Input({
          placeholder: 'Titre',
          value: defaultState.title,
          name: 'title',
          required: true
        }),
        Input({
          placeholder: 'Auteur',
          value: defaultState.author,
          name: 'author',
          required: true
        }),
        Input({
          type: 'select',
          value: defaultState.status,
          name: 'status',
          options: getState().columns.map(col => ({
            value: col.id,
            label: col.title
          }))
        }),
        Input({
          type: 'number',
          min: 0,
          max: 5,
          placeholder: 'Note /5',
          value: defaultState.note,
          name: 'note'
        }),
        Input({
          type: 'textarea',
          placeholder: 'Commentaire',
          name: 'comment',
          value: defaultState.comment
        }),
        el('button', { 
          type: 'submit',
          className: 'btn primary'
        }, isEdit ? 'Modifier' : 'Ajouter')
      ),
      el('button', {
        onclick: onClose,
        className: 'btn secondary cancel',
      }, 'Annuler')
    ]
  });
}
