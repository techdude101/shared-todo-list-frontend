/**
 * Represents a TODO item.
 * @class
 */
class ToDoModel {

  /**
   * Create a new TODO item.
   * @param {number} todoId Unique ID of the todo.
   * @param {string} todoText Todo item text or description.
   * @param {boolean} completed Whether the todo item as been completed or not.
   * @param {number} completedTimestamp Unix timestamp of when the todo was marked complete.
   */
  constructor(todoId, todoText, completed, completedTimestamp) {
    this.id = todoId;
    this.data = todoText;
    this.completed = completed;
    this.completed_timestamp = completedTimestamp;
  }
}

export default ToDoModel;