import { createElement as el } from '../core/createElement.js';

export function Modal({ children }) {
  return el('div', {
      style: `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `
    },
    el('div', {
      style: `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `
    }, ...children)
  );
}
