import { TodoListItem } from './components/todoListItem';
import ToDosModel from './models/todosModel';
import ToDoModel from './models/todoModel';
import { DATASERVICE_BASE_URL, DATASERVICE_PATH_TODOS, API_TIMEOUT_IN_SECONDS } from './constants';

const todoUlElement = document.querySelector('#todo-ul');

let todoItems;

/**
 * Get to-do items via an API call.
 * @param {string} urlAndPath URL and path to get to-do items
 * @returns the JSON response from the API call or null if there as an error
 */
const getTodosFromDataService = async (urlAndPath, timeoutInSeconds) => {
  try {
    const response = await fetch(urlAndPath, {
      signal: AbortSignal.timeout(timeoutInSeconds),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

/**
 * Update a to-do item via an API call.
 * @param {string} urlAndPath URL and path to update a to-do item
 * @param {string | ToDoModel} requestBody request body
 * @returns boolean true or false if the request was successful or not
 */
const updateTodoOnDataService = async (urlAndPath, requestBody, timeoutInSeconds) => {
  try {
    const response = await fetch(urlAndPath, {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeoutInSeconds),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    await response.json();
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

/**
 * Add a new to-do item via an API call.
 * @param {string} urlAndPath URL and path to add a new to-do
 * @param {string | ToDoModel} requestBody request body
 * @returns boolean true or false if the request was successful or not
 */
const addTodoToDataService = async (urlAndPath, requestBody, timeoutInSeconds) => {
  try {
    const response = await fetch(urlAndPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeoutInSeconds),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    await response.json();
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

/**
 * Delete a to-do item via an API call.
 * @param {string} urlAndPath  URL and path to delete a to-do
 * @returns boolean true or false if the request was successful or not
 */
const deleteTodoFromDataService = async (urlAndPath, timeoutInSeconds) => {
  try {
    const response = await fetch(urlAndPath, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeoutInSeconds),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

/**
 * Handle submission of the to-do form.
 * @param {SubmitEvent} event submit event
 * @returns undefined
 */
const handleTodoFormSubmit = async (event) => {
  
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const newTodoItem = todoItems.addTodo(formData.get("todoItemText"));
  
  if (newTodoItem) {
    
    const result = await addTodoToDataService(`${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}`,
      newTodoItem, API_TIMEOUT_IN_SECONDS);

    if (result !== true) {
      alert("Error adding to-do :(");
      return;
    }
    
    document.querySelector('#todoItemText').value = '';

    renderTodos();
  } else {
    alert("Error adding to-do :(");
  }
}

/**
 * Handle changing the completed state of a to-do item.
 * @param {CustomEvent} event x-todo-complete
 * @returns undefined
 */
const completeHandler = async (event) => {
  
  const todoId = parseInt(event.detail.todoId);
  todoItems.markTodoComplete(todoId);
  const updatedTodo = todoItems.todos.filter(todo => todo.id == todoId)[0];

  const result = await updateTodoOnDataService(`${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}/${todoId}`,
    updatedTodo,
    API_TIMEOUT_IN_SECONDS);
  
  if (result !== true) {
    alert("Error updating to-do :(");
    return;
  }

  renderTodos();
}

/**
 * Handle deleting a to-do item.
 * @param {CustomEvent} event x-todo-delete
 * @returns undefined
 */
const deleteHandler = async (event) => {
  
  todoItems.deleteTodo(parseInt(event.detail.todoId));
  const result = await deleteTodoFromDataService(`${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}/${event.detail.todoId}`,
    API_TIMEOUT_IN_SECONDS
  );
  
  if (result !== true) {
    alert("Error removing to-do :(");
    return;
  }

  renderTodos();
}

/**
 * Render the to-do list items.
 * 
 * Creates a new todo-item custom HTML element
 * and appends each <todo-item> to the <ul> HTML element.
 */
const renderTodos = () => {

  todoUlElement.innerHTML = '';
  
  for (let todoIndex = 0; todoIndex < todoItems.todos.length; todoIndex++) {

    const todoItem = document.createElement('todo-item');
    todoItem.addEventListener('x-todo-complete', completeHandler);
    todoItem.addEventListener('x-todo-delete', deleteHandler);
    
    todoItem.setAttribute('text', todoItems.todos[todoIndex].data);
    todoItem.setAttribute('id', todoItems.todos[todoIndex].id);
    todoItem.setAttribute('completed', todoItems.todos[todoIndex].completed);
    
    todoUlElement.appendChild(todoItem);
  }
}

const addTodoForm = document.querySelector('#add-todo-form');
addTodoForm.addEventListener('submit', handleTodoFormSubmit);

const todosFromDb = await getTodosFromDataService(
  `${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}`, API_TIMEOUT_IN_SECONDS);

if (!todosFromDb) {
  alert("Error retrieving data :(");
}

todoItems = new ToDosModel(todosFromDb);

renderTodos();
