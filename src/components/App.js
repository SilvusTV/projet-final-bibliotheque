import { createElement as el } from '../core/createElement.js';
import { Column } from './Column.js';
import { useStore } from '../core/store.js';
import { AddBookForm } from './AddBookForm.js';

export function App() {
  window.App = App; // for re-render in useState
  const { getState } = useStore();
  const { columns } = getState();

  return el('div', {},
    el('h1', {}, '📚 Ma Bibliothèque en ligne'),
    el(AddBookForm),
    el('div', { style: 'display: flex; gap: 1rem;' },
      ...columns.map((title) => el(Column, { title }))
    )
  );
}
