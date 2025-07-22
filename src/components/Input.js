import { createElement as el } from '../core/createElement.js';

export function Input({
  type = 'text',
  name,
  value = '',
  placeholder = '',
  className = '',
  min,
  max,
  onChange,
  required = false,
  options = [],
  id,
  ...rest
}) {
  const baseClassName = `input ${className}`.trim();
  
  // Common props for all input types
  const commonProps = {
    name,
    id: id || name,
    className: baseClassName,
    ...(required ? { required: true } : {}),
    ...(onChange ? { onchange: onChange } : {}),
    ...rest
  };

  // Handle different input types
  switch (type) {
    case 'textarea':
      return el('textarea', {
        placeholder,
        ...commonProps
      }, value);
      
    case 'select':
      return el('select', {
        value,
        ...commonProps
      }, ...options.map(option => 
        el('option', {
          value: option.value,
          ...(option.value === value ? { selected: true } : {})
        }, option.label || option.value)
      ));
      
    default: // text, number, email, password, etc.
      return el('input', {
        type,
        placeholder,
        value,
        ...(type === 'number' && min !== undefined ? { min } : {}),
        ...(type === 'number' && max !== undefined ? { max } : {}),
        ...commonProps
      });
  }
}