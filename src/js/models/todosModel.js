import ToDoModel from './todoModel.js';
import { todoSchema, todosSchema } from '../schemas/todo.js';

/**
 * Represents a collection of TODO items.
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
   * Add a new todo.
   * @param {string} todoText text or description e.g., Laundry.
   * @returns an array of todo items.
   */
  addTodo = (todoText) => {
   
    const todoId = this.todos.length;
    const todoItem = new ToDoModel(todoId, todoText, false, 0);
    this.todos.push(todoItem);
    
    return this.todos;
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
  * @param {number} todoId  todoId the ID of the todo to be marked as complete.
  * @returns an array of todo items.
  */
  markTodoComplete = (todoId) => {

    const todo = this.todos[todoId];
    if (!todo.completed) {
      todo.completed = true;
      todo.completed_timestamp = Math.floor(new Date().getTime() / 1000);
    } else {
      todo.completed = false;
    }

    return;
  }
}

export default ToDosModel;