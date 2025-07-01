import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';
import {closeDB, useStore} from '../../core/store.js';

export function SettingsModal({ onClose }) {
  const { getState, setState } = useStore();

  function handleReset() {
    const confirmReset = confirm("⚠️ Cette action supprimera toutes les données. Continuer ?");
    if (!confirmReset) return;

    closeDB();

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
      } catch (err) {
        alert("Erreur lors de l'importation du fichier.");
      }
    };
    reader.readAsText(file);
  }

  return Modal({
    children: [
      el('h2', {}, '⚙️ Paramètres'),
      el('div', { style: 'margin-bottom: 1rem;' },
        el('button', { onclick: handleReset }, '🧹 Réinitialiser la base'),
      ),
      el('div', { style: 'margin-bottom: 1rem;' },
        el('button', { onclick: handleDownload }, '💾 Télécharger les données (.json)')
      ),
      el('div', { style: 'margin-bottom: 1rem;' },
        el('label', {}, '📥 Importer un fichier JSON :'),
        el('input', {
          type: 'file',
          accept: 'application/json',
          onchange: handleUpload
        })
      ),
      el('button', {
        onclick: onClose,
        style: 'margin-top: 1rem;'
      }, 'Fermer')
    ]
  });
}
