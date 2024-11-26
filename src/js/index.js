import { TodoListItem } from './components/todoListItem';
import ToDosModel from './models/todosModel';
import { loadTodosFromLocalStorage, saveTodosToLocalStorage } from './localStorageUtils';

const todoUlElement = document.querySelector('#todo-ul');

let todoItems;
const localStorageKey = "shared-todo-list";

const handleTodoFormSubmit = (event) => {
  
  event.preventDefault();
  const formData = new FormData(event.target);
  
  todoItems.addTodo(formData.get("todoItemText"));
  document.querySelector('#todoItemText').value = '';
  saveTodosToLocalStorage(localStorageKey, todoItems.todos);
  renderTodos();
}

const completeHandler = (event) => {
  
  todoItems.markTodoComplete(event.detail.todoId);
  saveTodosToLocalStorage(localStorageKey, todoItems.todos);
  renderTodos();
}

const deleteHandler = (event) => {
  
  todoItems.deleteTodo(parseInt(event.detail.todoId));
  saveTodosToLocalStorage(localStorageKey, todoItems.todos);
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
todoItems = new ToDosModel(todosFromLocal);

renderTodos();
