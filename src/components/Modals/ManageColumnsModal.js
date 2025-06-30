import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';
import { useStore } from '../../core/store.js';
import { useState, setCurrentComponent } from '../../core/hook/useState.js';

export function ManageColumnsModal({ onClose }) {
  setCurrentComponent('ManageColumnsModal_');
  const { getState, setState } = useStore();
  const { columns, books } = getState();
  const [localCols, setLocalCols] = useState([...columns]);

  function handleRename(index, value) {
    const updated = [...localCols];
    updated[index].title = value;
    console.log("updated", updated)
    setLocalCols(updated);
  }

  function handleRemove(id) {
    const updated = localCols.filter((col) => col.id !== id);
    setLocalCols(updated);
    setState({ columns: updated });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const filtered = localCols.filter(c => c.title.trim() !== '');
    if (filtered.length === 0) return;
    setState({ columns: filtered });
    onClose();
  }
  function handleAdd() {
    const input = document.querySelector('#newColTitle');
    const title = input?.value.trim() ?? '';
    if (title === '') return;
    const newCol = {  id: localCols.length ? Math.max(...localCols.map(col => col.id)) + 1 : 1 , title};
    setLocalCols([...localCols, newCol]);
    setState({ columns: [...localCols, newCol] });
  }
  return Modal({
    children: [
      el('h2', {}, 'Gérer les colonnes'),
      el('p', {}, 'Vous ne pouvez pas supprimer une colonne si des livres sont associés à celle-ci.'),
      el('form', { onsubmit: handleSubmit },
        ...localCols.map((col, index) => {
          const hasBooks = books.some(b => b.status === col.id);
          return el('div', { style: 'display: flex; gap: 0.5rem; margin-bottom: 0.5rem;' },
            el('input', {
              value: col.title,
              oninput: (e) => handleRename(index, e.target.value),
            }),
            el('button', {
              type: 'button',
              onclick: () => handleRemove(col.id),
              ...(hasBooks ? { disabled: true } : {}),
              style: hasBooks ? 'opacity: 0.5; cursor: not-allowed;' : ''
            }, '❌')
          );
        }),
        el('div', { style: 'margin-top: 1rem;' },
          el('input', {
            id: 'newColTitle',
            placeholder: 'Nouvelle colonne',
            oninput: (e) => {
              console.log('typed', e.target.value);
            }
          }),
          el('button', {
            type: 'button',
            onclick: () =>  handleAdd()
          }, '➕ Ajouter')
        ),
        el('div', { style: 'margin-top: 1rem;' },
          el('button', { type: 'submit' }, 'Enregistrer'),
          el('button', {
            type: 'button',
            onclick: onClose,
            style: 'margin-left: 1rem;'
          }, 'Annuler')
        )
      )
    ]
  });
}
