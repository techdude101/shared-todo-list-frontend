import ToDoModel from "./todoModel";
import ToDosModel from "./todosModel";

test('Initialize todos with zero todo items', () => {
  
  const todos = new ToDosModel();
  
  expect(todos.todos.length).toEqual(0);
});

test('Add a new valid todo item', () => {
  
  const todos = new ToDosModel();
  todos.addTodo("Write more unit tests");
  
  const todoItem = todos.todos[0];
  const expectedTodoItem = {
    id: 1,
    data: "Write more unit tests",
    completed: false,
    completed_timestamp: 0
  }

  expect(todos.todos.length).toEqual(1);
  expect(todoItem).toEqual(expectedTodoItem)
});

test('Initialize todos with valid todo items', () => {
  
  const todoItems = [new ToDoModel(0, "write unit tests", false, 0)]
  const todos = new ToDosModel(todoItems);
  
  expect(todos.todos.length).toEqual(1);
});

test('Initialize todos with x1 valid and x1 invalid todo item', () => {
  
  const todoItems = [
    {
      id: 0,
      data: "valid todo item",
      completed: false,
      completed_timestamp: 0
    },
    {
      id: 1,
      text: "invalid todo item - invalid key",
      completed: false,
      completed_timestamp: 0
    }
  ]
  const todos = new ToDosModel(todoItems);
  
  expect(todos.todos.length).toEqual(0);
});

test('Validate todos with one or more invalid todo items', () => {
  
  const todoItems = [
    {
      id: 0,
      data: "valid todo item",
      completed: false,
      completed_timestamp: 0
    },
    {
      id: 1,
      text: "invalid todo item - invalid key",
      completed: false,
      completed_timestamp: 0
    }
  ]

  const validateResult = ToDosModel.validateTodoItems(todoItems);
  
  expect(validateResult).toEqual(false);
});