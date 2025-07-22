import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';
import {useStore} from "../../core/store.js";

export function BookDetailModal({ book, onClose }) {
  const { getState } = useStore();
  const { columns } = getState()
  function handleDelete() {
    const updatedBooks = getState().books.filter(b => b.id !== book.id);
    setState({ books: updatedBooks, isBookDetailOpen: false });
  }
  return Modal({
    id: 'book-detail-modal',
    children: [
      el('h2', {}, book.title),
      el('p', {}, `✍️ Auteur : ${book.author}`),
      el('p', {}, `📚 Statut : ${columns.find(col => col.id === book.status)?.title || 'Inconnu'}`),
      el('p', {}, book.note ? `⭐ Note : ${book.note}/5` : 'Vous n’avez pas noté ce livre.'),
      el('p', {}, book.comment ? `💬 Commentaire : ${book.comment}` : 'Vous n’avez pas commenté ce livre.'),
      el('button', {
        onclick: onClose,
        className: 'btn secondary',
        style: 'margin-top: 1rem;'
      }, 'Fermer'),
      el('button', {
        onclick: () => {
          window.setState({ isBookDetailOpen: false, isBookFormOpen: true });
        },
        className: 'btn primary',
        style: 'margin-top: 0.5rem;'
      }, 'Modifier'),
      el('button', {
        onclick: handleDelete,
        className: 'btn danger',
        style: 'margin-top: 1rem;'
      }, '🗑 Supprimer ce livre')
    ]
  });
}
