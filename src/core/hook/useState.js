import { rerender } from '../render.js';

let states = [];
let currentIndex = 0;
let currentComponent = null;

export function setCurrentComponent(componentFn) {
  currentComponent = componentFn;
  currentIndex = 0;
}

export function useState(initialValue) {
  const componentKey = currentComponent;
  states[componentKey] ??= [];

  const index = currentIndex;
  const localStates = states[componentKey];

  if (localStates[index] === undefined) {
    localStates[index] = initialValue;
  }

  const setState = (newValue) => {
    states[componentKey][index] = newValue;
    currentIndex = 0;
    rerender(componentKey, componentKey);
  };

  const value = localStates[index];
  currentIndex++;
  return [value, setState];

}
