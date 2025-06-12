import { createDomNode } from './utils/createDomNode.js';

let oldVNode = null;

export function render(vnode, container) {
  const newDom = createDomNode(vnode);
  container.innerHTML = '';
  container.appendChild(newDom);
  oldVNode = vnode;
}