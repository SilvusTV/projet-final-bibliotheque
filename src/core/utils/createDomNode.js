export function createDomNode(vnode) {
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.type);
  for (const [key, value] of Object.entries(vnode.props || {})) {
    if (key === 'children') continue;
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }

  for (const child of vnode.props.children || []) {
    el.appendChild(createDomNode(child));
  }

  return el;
}