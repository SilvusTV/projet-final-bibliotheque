let globalState = JSON.parse(localStorage.getItem('state')) || {
  books: [],
  columns: [
    {
    id: 1,
    title: 'À lire',
    },
    {
      id: 2,
      title: 'En cours',
    },
    {
      id: 3,
      title: 'Lu',
    }
    ],
  loading: true,
  error: null,
  initialized: false,
  isBookDetailOpen: false,
  isBookFormOpen: false,
};

const listeners = [];

export function useStore() {
  function getState() {
    return globalState;
  }

  function setState(partialState) {
    globalState = {...globalState, ...partialState};
    localStorage.setItem('state', JSON.stringify(globalState));
    listeners.forEach((fn) => fn());
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => listeners.filter((l) => l !== fn);
  }

  return {getState, setState, subscribe};
}