export function createDomNode(vnode) {
  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach(child => fragment.appendChild(createDomNode(child)));
    return fragment;
  }

  if (vnode === null || vnode === undefined || vnode === false) {
    return document.createTextNode('');
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (typeof vnode !== 'object' || !vnode.type) {
    console.warn('❌ VNode invalide détecté :', vnode);
    return document.createTextNode('');
  }

  const node = document.createElement(vnode.type);

  const { props = {} } = vnode;

  for (const [key, value] of Object.entries(props)) {
    if (key === 'class' || key === 'className') {
      node.className = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      const event = key.slice(2).toLowerCase();
      node.addEventListener(event, value);
    } else if (key !== 'children') {
      node.setAttribute(key, value);
    }
  }

  const children = props.children || [];
  children.forEach(child => {
    const childNode = createDomNode(child);
    node.appendChild(childNode);
  });

  return node;
}
