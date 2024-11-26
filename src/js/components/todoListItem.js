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

class TodoListItem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(template.content.cloneNode(true));
    this.addEventListener('click', this.handleComplete);
  }

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

  disconnectedCallback() {
    const todoTextSpan = this.shadowRoot.querySelector('span');
    this.removeEventListener('click', this.handleComplete);
    
    const deleteIcon = this.shadowRoot.querySelectorAll('img')[1];
    deleteIcon.removeEventListener('click', this.handleDelete);
    deleteIcon.removeEventListener('keyup', this.handleDeleteKeyboard);
    todoTextSpan.removeEventListener('keyup', this.handleCompleteKeyboard);
  }

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