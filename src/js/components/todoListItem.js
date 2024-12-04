const template = document.createElement('template');
template.innerHTML = `
<style>
.todo-li {
  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 0.5em 1em;
  border-bottom: 1px solid black;
}

.todo-li:hover,
.todo-li:focus,
.todo-li:active {
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.todo-text {
  color: black;
  text-align: left;
  overflow-x: auto;
}

.todo-text__complete {
  text-decoration: line-through;
  font-style: oblique;
}

.todo-icons {
  padding: 0;
  margin: 0;
  text-align: right;
}

.todo-delete {
  color: red;
  margin-left: 0.5em;
}

.todo-delete:hover {
  cursor: pointer;
}

.todo-complete {
  color: green;
}

.todo-complete:hover {
  cursor: pointer;
}

.todo-icon {
  max-height: 1.5rem;
}
</style>
<li class="todo-li" role="list-item">
        <span class="todo-text" tabindex="0"></span>
        <span class="todo-icons">
          <img src="./assets/icons/circle-check.svg" class="todo-icon" tabindex="0" alt="mark complete" />
          <img src="./assets/icons/trash.svg" class="todo-icon" tabindex="0" alt="delete" />
        </span>
</li>
`;

/**
 * To-do list item web element.
 */
class TodoListItem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(template.content.cloneNode(true));
    this.addEventListener('click', this.handleComplete);
  }

  /**
   * Invoked when the custom element is first connected to the document's DOM.
   */
  connectedCallback() {

    const todoTextSpan = this.shadowRoot.querySelector('span');
    todoTextSpan.textContent = this.getAttribute('text');
    todoTextSpan.addEventListener('keyup', this.handleCompleteKeyboard);

    const deleteIcon = this.shadowRoot.querySelectorAll('img')[1];
    deleteIcon.addEventListener('click', this.handleDelete);
    deleteIcon.addEventListener('keyup', this.handleDeleteKeyboard);
    
    this.todoId = this.getAttribute('id');
    this.completed = this.getAttribute('completed') === "true";

    if (this.completed === true) {
      todoTextSpan.classList.add('todo-text__complete');
    }
  }

  /**
   * Invoked when the custom element is disconnected from the document's DOM.
   */
  disconnectedCallback() {

    const todoTextSpan = this.shadowRoot.querySelector('span');
    this.removeEventListener('click', this.handleComplete);
    
    const deleteIcon = this.shadowRoot.querySelectorAll('img')[1];
    deleteIcon.removeEventListener('click', this.handleDelete);
    deleteIcon.removeEventListener('keyup', this.handleDeleteKeyboard);
    todoTextSpan.removeEventListener('keyup', this.handleCompleteKeyboard);
  }

  /**
   * Handles when a user clicks the web element to mark a to-do item as complete.
   * @param {Event} event mouse click
   * @event x-todo-complete
   * @fires x-todo-complete
   */
  handleComplete = (event) => {
    event.stopPropagation();

    const todoId = this.todoId;

    this.dispatchEvent(new CustomEvent('x-todo-complete', {
      bubbles: true,
      composed:true,
      detail: {
        todoId,
      }
    }));
  }

  /**
   * Handles when a user clicks the web element to delete a to-do item.
   * @param {Event} event keyboard event
   * @event x-todo-complete
   * @fires x-todo-complete
   */
  handleCompleteKeyboard = (event) => {
    event.stopPropagation();

    const todoId = this.todoId;

    if (event.keyCode != 13) return;

    this.dispatchEvent(new CustomEvent('x-todo-complete', {
      bubbles: true,
      composed:true,
      detail: {
        todoId,
      }
    }));
  }

  /**
   * Handles when a user presses enter on the keyboard to mark a to-do item as complete.
   * @param {Event} event mouse click
   * @event x-todo-delete
   * @fires x-todo-delete
   */
  handleDelete = (event) => {
    event.stopPropagation();

    const todoId = this.todoId;
    this.dispatchEvent(new CustomEvent('x-todo-delete', {
      bubbles: true,
      composed:true,
      detail: {
        todoId,
      }
    }));
  }

  /**
   * Handles when a user presses enter on the keyboard to delete a to-do item.
   * @param {Event} event keyboard event
   * @event x-todo-delete
   * @fires x-todo-delete
   */
  handleDeleteKeyboard = (event) => {
    event.stopPropagation();

    if (event.keyCode != 13) return;
    
    const todoId = this.todoId;
    this.dispatchEvent(new CustomEvent('x-todo-delete', {
      bubbles: true,
      composed:true,
      detail: {
        todoId,
      }
    }));
  }
}

window.customElements.define('todo-item', TodoListItem);