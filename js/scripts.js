const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector(".todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const finishBtns = document.querySelectorAll(".finish-btn");
const todoSection = document.querySelector(".todo-section");
const editSection = document.querySelector(".edit-section");
const editTextArea = document.querySelector("#edit-text-area");
const searchInput = document.querySelector("#search-input");
const eraseSearchBtn = document.querySelector("#erase-btn");
const filterSelect = document.querySelector("#filter-select");
let currentTodo = null;

//Funções
function addTodo(text, checked = 0, save = 1) {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoText = document.createElement("h4");
  todoText.innerText = text;
  todo.appendChild(todoText);

  const btnsContainer = document.createElement("div");
  btnsContainer.classList.add("btns-container");

  const finishBtn = document.createElement("button");
  finishBtn.classList.add("finish-btn");
  finishBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  btnsContainer.appendChild(finishBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  btnsContainer.appendChild(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  //utilizando dados da local storage
  if (checked) {
    todo.classList.add("checked");
  }
  if (save) {
    saveTodoLocalStorage({ text, checked });
  }

  btnsContainer.appendChild(removeBtn);

  todo.appendChild(btnsContainer);
  todoList.appendChild(todo);
}

function editTodo(todo, text) {
  const todoText = todo.querySelector("h4");
  todoText.innerText = text;
}

function removeTodo(todo, text) {
  todo.remove();
  removeTodoLocalStorage(text);
}

function cleanInput(input) {
  input.value = "";
}

function toggleCheck(todo) {
  todo.classList.toggle("checked");
}

function toggleHideSections() {
  todoSection.classList.toggle("hide");
  editSection.classList.toggle("hide");
}

function applySearchAndFilter() {
  const search = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const text = todo.querySelector("h4").innerText.toLowerCase();
    const isChecked = todo.classList.contains("checked");

    let matchesSearch = text.includes(search);
    let matchesFilter =
      filter === "todos" ||
      (filter === "feitos" && isChecked) ||
      (filter === "a_fazer" && !isChecked);

    if (matchesSearch && matchesFilter) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
}

//Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); //para não enviar o formulário (não tem backend)

  const inputValue = todoInput.value;
  if (inputValue) {
    addTodo(inputValue);
  }
  cleanInput(todoInput);
  todoInput.focus();
  applySearchAndFilter();
});

todoList.addEventListener("click", (e) => {
  currentTodo = e.target.closest(".todo"); //closest serve para indicar que se trata de um elemento de um respectivo pai
  const todoText = currentTodo.querySelector("h4").innerText;
  if (e.target.closest(".finish-btn")) {
    toggleCheck(currentTodo);
    updateTodoCheckedStatus(todoText);
  } else if (e.target.closest(".remove-btn")) {
    removeTodo(currentTodo, todoText);
  } else if (
    e.target.closest(".edit-btn") &&
    !currentTodo.classList.contains("checked")
  ) {
    toggleHideSections();
    editTextArea.value = todoText;
  }
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newText = editTextArea.value;
  if (newText) {
    const oldText = currentTodo.querySelector("h4").innerText;
    editTodo(currentTodo, newText);
    updateTodoLocalStorage(oldText, newText);
    toggleHideSections();
  }
});

cancelEditBtn.addEventListener("click", () => {
  toggleHideSections();
});

searchInput.addEventListener("keyup", applySearchAndFilter);
eraseSearchBtn.addEventListener("click", () => {
  cleanInput(searchInput);
  applySearchAndFilter();
});

filterSelect.addEventListener("click", applySearchAndFilter);

//Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    addTodo(todo.text, todo.checked, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage(); //todos os todos da local storage

  todos.push(todo); //add o novo todo no array

  localStorage.setItem("todos", JSON.stringify(todos)); //salvar tudo na local storage
};

const updateTodoCheckedStatus = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.checked = !todo.checked) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text !== todoText); //incluirá todos os todos menos o com o texto do todo sendo removido (texto sendo usado como chave, pois não temos um ID)

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

loadTodos(); //Executando assim que o programa executa para carregar os todos salvos na local storage
