export function createElement(type, props = {}, ...children) {
  if (typeof type === 'function') {
    return type({ ...props, children });
  }

  return {
    type,
    props: {
      ...props,
      children: children
        .flat()
        .filter(c => c !== false && c !== null && c !== undefined),
    },
  };
}