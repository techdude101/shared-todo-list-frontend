/**
 * Save todo items to local storage.
 * @param {string} key local storage key
 * @param {[ToDoModel[]]} todoItems an array of todo items.
 */
export const saveTodosToLocalStorage = (key, todos) => {
  if (typeof Storage !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify({ todos: todos }));
  }
};

/**
 * Load todo items to local storage.
 * @param {string} key local storage key
 * @returns an array of todo items or null.
 */
export const loadTodosFromLocalStorage = (key) => {
  if (typeof Storage !== "undefined") {
    const data = JSON.parse(window.localStorage.getItem(key));
    if (data && data.todos !== undefined) {
      return data.todos;
    }
    return null;
  }
};