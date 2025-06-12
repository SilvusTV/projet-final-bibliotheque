import { createDomNode } from './utils/createDomNode.js';

const roots = new Map(); // clé = composant, valeur = container DOM

export function render(vnode, container, key = null) {
  container.innerHTML = '';
  container.appendChild(createDomNode(vnode));

  if (key) {
    roots.set(key, container);
  }
}

// Cette fonction permet à useState de redessiner un composant donné
export function rerender(key, componentFn) {
  const container = roots.get(key);
  if (container) {
    render(componentFn(), container, key);
  }
}
