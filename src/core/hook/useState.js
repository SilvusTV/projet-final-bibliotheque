import { rerender } from '../render.js';

let states = [];
let currentIndex = 0;
let currentComponent = null;

export function setCurrentComponent(componentFn) {
  currentComponent = componentFn;
  currentIndex = 0;
}

export function useState(initialValue) {
  const index = currentIndex;
  states[index] = states[index] ?? initialValue;

  function setState(newValue) {
    states[index] = newValue;
    currentIndex = 0;
    if (currentComponent) {
      rerender(currentComponent, currentComponent);
    }
  }

  currentIndex++;
  return [states[index], setState];
}
