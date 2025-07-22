const DB_NAME = 'LibraryDB';
const DB_VERSION = 2; // Mise à jour version pour ajout de 'config'
let db = null;

let globalState = {
  books: [],
  columns: [],
  loading: true,
  error: null,
  initialized: false,
  isBookDetailOpen: false,
  isBookFormOpen: false,
  toasts: [],
};

const listeners = [];

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('columns')) {
        db.createObjectStore('columns', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config', { keyPath: 'key' });
      }
    };
  });
}

export function closeDB() {
  if (db) db.close();
}

function readAll(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function writeAll(storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    store.clear();
    data.forEach(item => store.put(item));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function readConfig(key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('config', 'readonly');
    const store = transaction.objectStore('config');
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
  });
}

function writeConfig(key, value) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('config', 'readwrite');
    const store = transaction.objectStore('config');
    store.put({ key, value });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function initStateFromIndexedDB() {
  await openDB();

  const books = await readAll('books');
  const columns = await readAll('columns');
  const initialized = await readConfig('initialized');

  globalState.books = books;
  globalState.columns = columns.length ? columns : [
    { id: 1, title: 'À lire', color: '#4CAF50' },
    { id: 2, title: 'En cours', color: '#2196F3' },
    { id: 3, title: 'Lu', color: '#9C27B0' }
  ];
  globalState.initialized = Boolean(initialized);

  if (!columns.length) {
    await writeAll('columns', globalState.columns);
  }

  globalState.loading = false;
  listeners.forEach(fn => fn());
}

export function useStore() {
  function getState() {
    return globalState;
  }

  function addToast(message, type = 'info') {
    const toasts = [...globalState.toasts, { id: Date.now(), message, type }];
    setState({ toasts });
    setTimeout(() => {
      setState({ toasts: globalState.toasts.filter(t => t.id !== toasts[toasts.length - 1].id) });
    }, 3000);
  }

  function setState(partialState) {
    if (!('initialized' in partialState)) {
      partialState.initialized = globalState.initialized;
    }

    globalState = { ...globalState, ...partialState };

    if ('books' in partialState) {
      writeAll('books', globalState.books);
    }
    if ('columns' in partialState) {
      writeAll('columns', globalState.columns);
    }
    if ('initialized' in partialState) {
      writeConfig('initialized', partialState.initialized);
    }

    listeners.forEach(fn => fn());
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => listeners.filter((l) => l !== fn);
  }

  return { getState, setState, subscribe, addToast };
}

// Init state once at app load
initStateFromIndexedDB();
