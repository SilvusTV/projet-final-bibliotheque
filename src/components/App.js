import { createElement as el } from '../core/createElement.js';
import { Column } from './Column.js';
import { useStore } from '../core/store.js';
import { Loader } from './Loader.js';
import {ErrorMessage} from "./ErrorMessage.js";
import { BookDetailModal } from './Modals/BookDetailModal.js';
import { useState, setCurrentComponent } from '../core/hook/useState.js';
import {EditAddBookForm} from "./Modals/EditAddBookForm.js";
import {ManageColumnsModal} from "./Modals/ManageColumnsModal.js";
import { SettingsModal } from './Modals/SettingsModal.js';


export function App() {

  window.App = App; // for re-render in useState
  setCurrentComponent(App);
  const { getState, setState } = useStore();
  const { columns, initialized, loading, error } = getState();
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showManageCols, setShowManageCols] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  window.setSelectedBookId = setSelectedBookId;
  window.setState = setState;
  if (!initialized && !loading && !error) {
    setState({ loading: true, error: null });
    fetch('https://keligmartin.github.io/api/books.json')
      .then(response => response.json())
      .then(data => {
        const fetchedBooks = data.map(item => ({
          id: item.isbn,
          title: item.title,
          author: item.publisher,
          status: 1,
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
    el('button', {
      onclick: () => setShowManageCols(true),
      style: 'margin-bottom: 1rem;'
    }, '🛠 Gérer les colonnes'),

    showManageCols && ManageColumnsModal({
      onClose: () => setShowManageCols(false)
    }),
    el('button', {
      onclick: () => setShowSettings(true)
    }, '⚙️ Paramètres'),
    showSettings && SettingsModal({ onClose: () => setShowSettings(false) }),


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
      ...columns.map((column) => el(Column, { column })),
      getState().isBookDetailOpen && selectedBookId &&
      BookDetailModal({
        book: getState().books.find(b => b.id === selectedBookId),
        onClose: () => setState({ isBookDetailOpen: false })
      }),
    )

  );
}
