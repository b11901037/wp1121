/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");
const select1 = document.querySelector("#selectone");
const select2 = document.querySelector("#selecttwo");
const newaddButton = document.querySelector("#new-add");
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const todos = await getTodos();
    console.log(todos);
    todos.forEach((todo) => renderTodo(todo));
  } catch (error) {
    alert("Failed to load todos!");
  }
  
}
function getToday() {
  var today = new Date();
  var Year = today.getFullYear();
  var Month = today.getMonth()+1;
  var date = today.getDate();
  var day = today.getDay();
  var Yearstr = Year.toString();
  var Monthstr = Month.toString();
  var Datestr = date.toString();
  var daystr;
  if(Month<10){
    Monthstr="0"+Monthstr;
  }
  if(Date<10){
    Datestr="0"+Datestr;
  }
  switch(day){
    case(0):
      daystr = "(日)";
      break;
    case(1):
      daystr = "(一)";
      break;
    case(2):
      daystr = "(二)";
      break;
    case(3):
      daystr = "(三)";
      break;
    case(4):
      daystr = "(四)";
      break;
    case(5):
      daystr = "(五)";
      break;
    case(6):
      daystr = "(六)";
      break;
  }
  return Yearstr+"."+Monthstr+"."+Datestr+daystr;
 
}
function setupEventListeners() {
  const ableToAddButton = document.querySelector("#new-add");
  const todoNoAddButton = document.querySelector("#todo-no-add");
  const addTodoButton = document.querySelector("#todo-add");
  /*const todoInput = document.querySelector("#todo-input");*/
  const todoDescriptionInput = document.querySelector("#todo-description-input");
  todoNoAddButton.addEventListener("click", async () => {
    const todoContainer = document.querySelector("#todo-input-container");
    console.log(todoContainer);
    todoContainer.style.visibility = "hidden";
    todoDescriptionInput.style.visibility = "hidden";
    todoList.style.visibility = "visible";

    ableToAddButton.style.visibility = "visible";

  });
  ableToAddButton.addEventListener("click", async () => {
    const todoContainer = document.querySelector("#todo-input-container");
    //const todoCompiler = item.querySelector("#todoCompiler");
    console.log(todoContainer);
    todoContainer.style.visibility = "visible";
    todoDescriptionInput.style.visibility = "visible";
    todoList.style.visibility = "hidden";
    itemTemplate.style.visibility = "hidden";
    console.log("1234556");



    ableToAddButton.style.visibility = "hidden";



  });
  addTodoButton.addEventListener("click", async () => {
    const todoContainer = document.querySelector("#todo-input-container");
    const title = getToday();
    const description = todoDescriptionInput.value;
    const select1Value = select1.value;
    const select2Value = select2.value;
    
    if (!title) {
      alert("Please enter a todo title!");
      return;
    }
    if (!description) {
      alert("Please enter  description!");
      return;
    }
    console.log(select2Value);
    try {
      const todo = await createTodo({ title,select1Value,select2Value,description });
      console.log(select1.value);
      renderTodo(todo);
    } catch (error) {
      alert("Failed to create todo!");
      console.log(error);
      return;
    }
    /*todoInput.value = "";*/
    todoDescriptionInput.value = "";
    console.log(todoContainer);
    todoContainer.style.visibility = "hidden";
    todoDescriptionInput.style.visibility = "hidden";
    todoList.style.visibility = "visible";


    ableToAddButton.style.visibility = "visible";


  });
}

function renderTodo(todo) {
  const item = createTodoElement(todo);
  todoList.appendChild(item);
  
}

function createTodoElement(todo) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".todo-item");
  container.id = todo.id;
  
  const checkbox = item.querySelector(`input[type="checkbox"]`);
  checkbox.checked = todo.completed;
  checkbox.dataset.id = todo.id;
  const title = item.querySelector("p.todo-title");
  const select1text = item.querySelector("p.select1");
  const select2text = item.querySelector("p.select2");
  title.innerText = todo.title;
  select1text.innerText = todo.select1;
  select2text.innerText = todo.select2;
  
  const description = item.querySelector("p.todo-description");
  description.innerText = todo.description;
  const deleteButton = item.querySelector("button.delete-todo");
  deleteButton.dataset.id = todo.id;
  deleteButton.addEventListener("click", () => {
    deleteTodoElement(todo.id);
  });
  
  //compile button
  const compileButton = item.querySelector("button.compile-todo");
  const todoCompiler = item.querySelector("#todoCompiler");
  var select1change = item.querySelector("#selectonechange");
  var select2change = item.querySelector("#selecttwochange");
  var todoDescriptionInputchange = item.querySelector("#todo-description-inputchange");
  const saveButton = item.querySelector("button.save");
  const cancelButton = item.querySelector("button.cancel");
  
  select1change.value = todo.select1;
  select2change.value = todo.select2;
  todoDescriptionInputchange.value = todo.description;
  try{
    compileButton.addEventListener("click", () => {
    todoCompiler.style.visibility = "visible";
    select1text.style.visibility = "hidden";
    select2text.style.visibility = "hidden";
    description.style.visibility = "hidden";
    newaddButton.style.visibility = "hidden";
    compileButton.style.visibility = "hidden";
    });
    
    //save button
    saveButton.addEventListener("click", async () => {
      const select1Valuechange = select1change.value;
      const select2Valuechange = select2change.value;
      const descriptionchange = todoDescriptionInputchange.value;
      const completed = true;
      const titlechange = getToday();
      console.log(todoDescriptionInputchange.value);
      console.log(descriptionchange);
      console.log(select2Valuechange);
      console.log(select1Valuechange);
      await updateTodoStatus (todo.id,{titlechange,select1Valuechange,select2Valuechange,descriptionchange,completed});
      location.reload();

    });
    
    //cancel button
    cancelButton.addEventListener("click", () => {
      todoCompiler.style.visibility = "hidden";
      select1text.style.visibility = "visible";
      select2text.style.visibility = "visible";
      description.style.visibility = "visible";
      location.reload();
    });

    
  } catch(error) {
    console.log(error);
  }

  return item;
}

async function deleteTodoElement(id) {
  try {
    await deleteTodoById(id);
  } catch (error) {
    alert("Failed to delete todo!");
  } finally {
    const todo = document.getElementById(id);
    todo.remove();
  }
}

async function getTodos() {
  const response = await instance.get("/todos");
  return response.data;
}

async function createTodo(todo) {
  const response = await instance.post("/todos", todo);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateTodoStatus(id, todo) {
  const response = await instance.put(`/todos/${id}`, todo);
  return response.data;
}

async function deleteTodoById(id) {
  const response = await instance.delete(`/todos/${id}`);
  return response.data;
}

main();
