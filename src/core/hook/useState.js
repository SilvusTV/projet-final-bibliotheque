import {render} from "../render.js";

let states = [];
let currentIndex = 0;

export function useState(initialValue) {
  const index = currentIndex;
  states[index] = states[index] ?? initialValue;

  function setState(newValue) {
    states[index] = newValue;
    currentIndex = 0;
    render(window.App(), document.getElementById('app'));
  }

  currentIndex++;
  return [states[index], setState];
}
