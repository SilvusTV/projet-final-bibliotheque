import { createElement as el } from '../core/createElement.js';
import { Column } from './Column.js';
import { useStore } from '../core/store.js';
import { Loader } from './Loader.js';
import {ErrorMessage} from "./ErrorMessage.js";
import { BookDetailModal } from './Modals/BookDetailModal.js';
import { useState, setCurrentComponent } from '../core/hook/useState.js';
import {EditAddBookForm} from "./Modals/EditAddBookForm.js";

export function App() {

  window.App = App; // for re-render in useState
  setCurrentComponent(App);
  const { getState, setState } = useStore();
  const { columns, initialized } = getState();
  const [selectedBookId, setSelectedBookId] = useState(null);
  window.setSelectedBookId = setSelectedBookId;
  window.setState = setState;
  //hydrate store from the API
  if (!initialized) {
    setState({ loading: true, error: null });
    fetch('https://keligmartin.github.io/api/books.json')
      .then(response => response.json())
      .then(data => {
        const fetchedBooks = data.map(item => ({
          id: item.isbn,
          title: item.title,
          author: item.publisher,
          status: 'À lire',
        }));

        setState({ books: fetchedBooks, loading: false, initialized: true, error: null });
      })
      .catch(error => {
        console.error('Error while getting book:', error);

        const errorType = error instanceof SyntaxError
          ? 'parse'
          : error.message.includes('Failed to fetch')
            ? 'network'
            : 'unknown';

        setState({ error: errorType, loading: false });
      });
  }
  if (getState().loading) {
    return Loader();
  }

  if (getState().error) {
    return ErrorMessage({ type: getState().error });
  }
  return el('div', {},
    el('h1', {}, '📚 Ma Bibliothèque en ligne'),
    el('button', {
      onclick: () => {
        setSelectedBookId(null);
        setState({ isBookFormOpen: true });
      },
      style: 'margin-bottom: 1rem;'
    }, '➕ Ajouter un livre'),

    getState().isBookFormOpen && EditAddBookForm({
      book: selectedBookId
        ? getState().books.find(b => b.id === selectedBookId)
        : null,
      onClose: () => {
        setState({ isBookFormOpen: false });
        setSelectedBookId(null);
      }
    }),

    el('div', { className: 'app' },
      ...columns.map((title) => el(Column, { title })),
      getState().isBookDetailOpen && selectedBookId &&
      BookDetailModal({
        book: getState().books.find(b => b.id === selectedBookId),
        onClose: () => setState({ isBookDetailOpen: false })
      }),
    )

  );
}
