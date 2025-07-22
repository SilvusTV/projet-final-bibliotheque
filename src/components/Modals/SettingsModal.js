import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';
import {closeDB, useStore} from '../../core/store.js';
import { Input } from '../Input.js';

export function SettingsModal({ onClose }) {
  const { getState, setState, addToast } = useStore();

  function handleReset() {
    const confirmReset = confirm("⚠️ Cette action supprimera toutes les données. Continuer ?");
    if (!confirmReset) return;

    closeDB();
    addToast('✅ La base de données a été réinitialiser avec succès', 'success');
    const req = indexedDB.deleteDatabase('LibraryDB');
    req.onsuccess = () => location.reload();
    req.onerror = () => alert('Erreur lors de la suppression de la base IndexedDB.');
    req.onblocked = () => alert('Une autre page utilise la base. Fermez les onglets et réessayez.');
  }
  function handleDownload() {
    const data = {
      books: getState().books,
      columns: getState().columns
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bibliotheque-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('📘 La base de données a été télécharger', 'success');
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.books || !parsed.columns) throw new Error("Fichier invalide");
        setState({ books: parsed.books, columns: parsed.columns });
        onClose();
        addToast('📘 Livre ajouté avec succès', 'success');
      } catch (err) {
        alert("Erreur lors de l'importation du fichier.");
      }
    };
    reader.readAsText(file);
  }

  return Modal({
    id: 'settings-modal',
    children: [
      el('h2', {}, '⚙️ Paramètres'),
      el('div', { className: 'settings-section' },
        el('button', { 
          onclick: handleReset,
          className: 'btn danger'
        }, '🧹 Réinitialiser la base'),
      ),
      el('div', { className: 'settings-section' },
        el('button', { 
          onclick: handleDownload,
          className: 'btn primary'
        }, '💾 Télécharger les données (.json)')
      ),
      el('div', { className: 'file-input-container settings-section' },
        el('label', {}, '📥 Importer un fichier JSON :'),
        Input({
          type: 'file',
          accept: 'application/json',
          onChange: handleUpload
        })
      ),
      el('div', { className: 'actions-container' },
        el('button', {
          onclick: onClose,
          className: 'btn secondary'
        }, 'Fermer')
      )
    ]
  });
}
