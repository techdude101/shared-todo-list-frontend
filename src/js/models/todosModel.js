import ToDoModel from './todoModel.js';
import { todoSchema, todosSchema } from '../schemas/todo.js';
import { getMaxInArray } from '../utils/arrayUtils.js';

/**
 * Represents a collection of todo items.
 * @class
 */
class ToDosModel {
  /**
   * Default constructor.
   * @param {[ToDoModel[]]} todoItems (Optional) an array of todo items.
   */
  constructor(todoItems) {

    this.todos = [];
    if (todoItems) {
      this.todos = ToDosModel.initialize(todoItems);
    }
  }

  /**
   * Initialize an array of todo items.
   * @param {[ToDoModel[]]} todoItems (Optional) an array of todo items.
   * @returns an array of todo items.
   */
  static initialize = (todoItems) => {
    
    const todoItemsAreValid = ToDosModel.validateTodoItems(todoItems);

    if (todoItemsAreValid != true) {
      console.error("Invalid to-do items");
      return [];
    }
    return todoItems;
  }

  /**
   * Check if an array of todo items is valid.
   * @param {[ToDoModel[]]} todoItems an array of todo items.
   * @returns true if all items are valid, false if one or more items are invalid.
   */
  static validateTodoItems = (todoItems) => {

    let todoItemsAreValid = true;
    
    const errorDuplicate = todosSchema.validate(todoItems).error;
    todoItemsAreValid |= errorDuplicate;
    
    for (let todoIndex = 0; todoIndex < todoItems.length; todoIndex++) {
      const errorValidation  = todoSchema.validate(todoItems[todoIndex]).error;
      
      if (errorValidation !== undefined) {
        console.error(`Invalid to-do item ${errorValidation}`);
        todoItemsAreValid = false;
      }
    }

    return todoItemsAreValid;
  }

  /**
   * Get the next available todo ID.
   * @returns number the next available todo ID as a number
   */
  getNextAvailableTodoId = () => {

    if (this.todos.length === 0) {
      return 1;
    }

    if (this.todos.length <= 0) {
      return -1;
    }

    const todoIds = this.todos.map(todoItem => todoItem.id);
    const maxTodoId = getMaxInArray(todoIds);

    return maxTodoId + 1;
  }

  /**
   * Add a new todo.
   * @param {string} todoText text or description e.g., Laundry.
   * @returns an array of todo items.
   */
  addTodo = (todoText) => {
   
    const todoId = this.getNextAvailableTodoId();
    const todoItem = new ToDoModel(todoId, todoText, false, 0);
    const todoItemIsValid = ToDosModel.validateTodoItems([todoItem]);
    
    if (!todoItemIsValid) {
      return null;
    }

    this.todos.push(todoItem);
    
    return todoItem;
  }


  /**
   * Delete a todo.
   * @param {number} todoId the ID of the todo to be deleted.
   * @returns an array of todo items.
   */
  deleteTodo = (todoId) => {

    const remainingTodos = this.todos.filter(todo => todo.id !== todoId);
    this.todos = remainingTodos;
    return remainingTodos;
  }


  /**
  * Mark a todo as complete.
  * @param {number} todoId the ID of the todo to be marked as complete.
  * @returns an array of todo items.
  */
  markTodoComplete = (todoId) => {

    let todoIndex = -1;
    for (let index = 0; index < this.todos.length; index++) {
      if (this.todos[index].id == todoId) {
        todoIndex = index;
      }
    }

    if (todoIndex == -1) {
      return;
    }

    if (!this.todos[todoIndex].completed) {
      this.todos[todoIndex].completed = true;
      this.todos[todoIndex].completed_timestamp = Math.floor(new Date().getTime() / 1000);
    } else {
      this.todos[todoIndex].completed = false;
    }

    return;
  }
}

export default ToDosModel;