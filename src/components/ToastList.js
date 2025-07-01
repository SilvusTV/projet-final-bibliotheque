import { createElement as el } from '../core/createElement.js';
import { useStore } from '../core/store.js';

export function ToastList() {
  const { getState } = useStore();
  const toasts = getState().toasts;

  return el('div', {
      style: `
      position: fixed; bottom: 1rem; right: 1rem;
      display: flex; flex-direction: column; gap: 0.5rem; z-index: 9999;
    `
    },
    ...toasts.map(t =>
      el('div', {
        style: `
          padding: 0.75rem 1rem;
          background: ${t.type === 'success' ? '#4caf50' :
          t.type === 'error' ? '#f44336' :
            '#2196f3'};
          color: white;
          border-radius: 5px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        `
      }, t.message)
    )
  );
}
