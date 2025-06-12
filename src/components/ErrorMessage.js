import { createElement as el } from '../core/createElement.js';

const messages = {
  network: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet.",
  parse: "Données reçues illisibles ou incorrectes. Contactez un administrateur.",
  unknown: "Une erreur inattendue est survenue. Réessayez plus tard.",
};

export function ErrorMessage({ type }) {
  const message = messages[type] || messages.unknown;

  return el('div', {
    style: `
      padding: 1rem;
      background-color: #ffe6e6;
      color: #a30000;
      border: 1px solid #a30000;
      border-radius: 6px;
      text-align: center;
      font-weight: bold;
      margin-bottom: 1rem;
    `
  }, `❌ ${message}`);
}
