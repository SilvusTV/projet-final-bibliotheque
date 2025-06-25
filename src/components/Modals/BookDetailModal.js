import { createElement as el } from '../../core/createElement.js';
import { Modal } from '../Modal.js';

export function BookDetailModal({ book, onClose }) {
  return Modal({
    children: [
      el('h2', {}, book.title),
      el('p', {}, `✍️ Auteur : ${book.author}`),
      el('p', {}, `📚 Statut : ${book.status}`),
      el('p', {}, book.note ? `⭐ Note : ${book.note}/5` : 'Vous n’avez pas noté ce livre.'),
      el('p', {}, book.comment ? `💬 Commentaire : ${book.comment}` : 'Vous n’avez pas commenté ce livre.'),
      el('button', {
        onclick: onClose,
        style: 'margin-top: 1rem;'
      }, 'Fermer'),
      el('button', {
        onclick: () => {
          window.setState({ isBookDetailOpen: false, isBookFormOpen: true });
        },
        style: 'margin-top: 0.5rem;'
      }, 'Modifier')
    ]
  });
}
