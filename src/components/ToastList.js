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
        className:`toast ${t.type}`
      }, t.message)
    )
  );
}
