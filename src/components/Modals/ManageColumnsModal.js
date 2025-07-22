import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';
import { useStore } from '../../core/store.js';
import { useState, setCurrentComponent } from '../../core/hook/useState.js';
import { Input } from '../Input.js';

export function ManageColumnsModal({ onClose }) {
  setCurrentComponent('ManageColumnsModal_');
  const { getState, setState, addToast } = useStore();
  const { columns, books } = getState();
  const [localCols, setLocalCols] = useState([...columns.map(col => ({ ...col, color: col.color || '#FFFFFF' }))]);

  function handleRename(index, value) {
    const updated = [...localCols];
    updated[index].title = value;
    console.log("updated", updated)
    setLocalCols(updated);
  }

  function handleColorChange(index, color) {
    const updated = [...localCols];
    updated[index].color = color;
    setLocalCols(updated);
  }

  function handleRemove(id) {
    const updated = localCols.filter((col) => col.id !== id);
    setLocalCols(updated);
    setState({ columns: updated });
    addToast("✅ Colonne supprimée", "success");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const filtered = localCols.filter(c => c.title.trim() !== '');
    if (filtered.length === 0) return;
    setState({ columns: filtered });
    addToast("✅ Colonne(s) modifiée(s)", "success");
    onClose();
  }
  function handleAdd() {
    const input = document.querySelector('#newColTitle');
    const title = input?.value.trim() ?? '';
    if (title === '') return;
    const newCol = {  
      id: localCols.length ? Math.max(...localCols.map(col => col.id)) + 1 : 1, 
      title,
      color: '#FFFFFF'
    };
    setLocalCols([...localCols, newCol]);
    setState({ columns: [...localCols, newCol] });
    addToast("✅ Colonne ajoutée", "success");
  }
  return Modal({
    id: 'manage-columns-modal',
    children: [
      el('h2', {}, 'Gérer les colonnes'),
      el('p', {}, 'Vous ne pouvez pas supprimer une colonne si des livres sont associés à celle-ci.'),
      el('form', { onsubmit: handleSubmit },
        ...localCols.map((col, index) => {
          const hasBooks = books.some(b => b.status === col.id);
          return el('div', { className: 'column-row' },
            Input({
              value: col.title,
              onChange: (e) => handleRename(index, e.target.value),
              className: 'title-input'
            }),
            Input({
              type: 'color',
              value: col.color || '#FFFFFF',
              onChange: (e) => handleColorChange(index, e.target.value),
              className: 'color-input'
            }),
            el('button', {
              type: 'button',
              onclick: () => handleRemove(col.id),
              className: `btn danger sm remove-btn ${hasBooks ? 'disabled' : ''}`,
              ...(hasBooks ? { disabled: true } : {})
            }, '🗑️')
          );
        }),
        el('div', { className: 'new-column-container' },
          Input({
            id: 'newColTitle',
            placeholder: 'Nouvelle colonne',
            onChange: (e) => {
              console.log('typed', e.target.value);
            }
          }),
          el('button', {
            type: 'button',
            onclick: () => handleAdd(),
            className: 'btn primary sm'
          }, '➕ Ajouter')
        ),
        el('div', { className: 'actions-container' },
          el('button', {
            type: 'button',
            onclick: onClose,
            className: 'btn secondary'
          }, 'Annuler'),
          el('button', { 
            type: 'submit',
            className: 'btn primary'
          }, 'Enregistrer')
        )
      )
    ]
  });
}
