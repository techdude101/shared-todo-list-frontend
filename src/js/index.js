import { TodoListItem } from './components/todoListItem';
import ToDosModel from './models/todosModel';
import { loadTodosFromLocalStorage, saveTodosToLocalStorage } from './localStorageUtils';
import { DATASERVICE_BASE_URL, DATASERVICE_PATH_TODOS } from './constants';

const todoUlElement = document.querySelector('#todo-ul');

let todoItems;
const localStorageKey = "shared-todo-list";

const getTodosFromDataService = async (urlAndPath) => {
  try {
    const response = await fetch(urlAndPath);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

const updateTodoOnDataService = async (urlAndPath, requestBody) => {
  try {
    const response = await fetch(urlAndPath, {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

const addTodoToDataService = async (urlAndPath, requestBody) => {
  try {
    const response = await fetch(urlAndPath, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

const deleteTodoFromDataService = async (urlAndPath) => {
  try {
    const response = await fetch(urlAndPath, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error(error.message);
  }
}

const handleTodoFormSubmit = (event) => {
  
  event.preventDefault();
  const formData = new FormData(event.target);
  
  todoItems.addTodo(formData.get("todoItemText"));
  
  const newTodoItem = todoItems.todos[todoItems.todos.length - 1];
  addTodoToDataService(`${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}`, newTodoItem)
  
  document.querySelector('#todoItemText').value = '';
  // saveTodosToLocalStorage(localStorageKey, todoItems.todos);
  renderTodos();
}

const completeHandler = (event) => {
  
  todoItems.markTodoComplete(event.detail.todoId);
  const updatedTodo = todoItems.todos[event.detail.todoId];

  updateTodoOnDataService(`${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}/${event.detail.todoId}`, updatedTodo);
  // saveTodosToLocalStorage(localStorageKey, todoItems.todos);
  renderTodos();
}

const deleteHandler = (event) => {
  
  todoItems.deleteTodo(parseInt(event.detail.todoId));
  deleteTodoFromDataService(`${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}/${event.detail.todoId}`);
  // saveTodosToLocalStorage(localStorageKey, todoItems.todos);
  renderTodos();
}

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

const todosFromLocal = loadTodosFromLocalStorage(localStorageKey);
const todosFromDb = await getTodosFromDataService(`${DATASERVICE_BASE_URL}${DATASERVICE_PATH_TODOS}`)
// todoItems = new ToDosModel(todosFromLocal);
todoItems = new ToDosModel(todosFromDb);

renderTodos();
