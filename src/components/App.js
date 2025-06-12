import { createElement as el } from '../core/createElement.js';
import { Column } from './Column.js';
import { useStore } from '../core/store.js';
import { AddBookForm } from './AddBookForm.js';
import { Loader } from './Loader.js';
import {ErrorMessage} from "./ErrorMessage.js";


export function App() {
  window.App = App; // for re-render in useState
  const { getState, setState } = useStore();
  const { columns, initialized } = getState();
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
    el(AddBookForm),
    el('div', { style: 'display: flex; gap: 1rem;' },
      ...columns.map((title) => el(Column, { title }))
    )
  );
}
