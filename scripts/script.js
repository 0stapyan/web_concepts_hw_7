const storedTodos = localStorage.getItem("todos");
const storedSortAsc = localStorage.getItem("sortAsc");
const storedSortDesc = localStorage.getItem("sortDesc");

let todoList = storedTodos ? JSON.parse(storedTodos) : [];
let sortAsc = storedSortAsc === "true";
let sortDesc = storedSortDesc === "true";

function toggleSorting(buttonId) {
    sortAsc = false;
    sortDesc = false;
    if (buttonId === "sortAsc") {
        sortAsc = true;
    } else if (buttonId === "sortDesc") {
        sortDesc = true;
    }

    localStorage.setItem("sortAsc", sortAsc);
    localStorage.setItem("sortDesc", sortDesc);
}

document.getElementById("sortAsc").addEventListener("click", () => {
    toggleSorting("sortAsc");
    renderToDoList();
});

document.getElementById("sortDesc").addEventListener("click", () => {
    toggleSorting("sortDesc");
    renderToDoList();
});

function saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todoList));
}

function clearLocalStorage() {
    localStorage.removeItem("todos");
    localStorage.removeItem("sortAsc");
    localStorage.removeItem("sortDesc");
}

function pickRandomTodo() {
    if (todoList.length === 0) {
        alert("No todos available.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * todoList.length);

    const selectedTodos = document.querySelectorAll('.active');
    for (const selectedTodo of selectedTodos) {
        selectedTodo.classList.remove('active');
    }

    const todoItem = document.querySelectorAll('li')[randomIndex];
    todoItem.classList.add('active');
}

function renderToDoList() {
    let sortedToDoList;
    
    if (sortAsc) {
        sortedToDoList = todoList.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortDesc) {
        sortedToDoList = todoList.sort((a, b) => b.createdAt - a.createdAt);
    } else {
        sortedToDoList = todoList.sort((a, b) => b.createdAt - a.createdAt);
    }

    const taskListElement = document.getElementById("taskList");

    taskListElement.innerHTML = "";

    sortedToDoList.forEach((task, index) => {
        const listItem = document.createElement("li");

        const creationDateTime = new Date(task.createdAt).toLocaleString(); 

        if (task.completed) {
            listItem.innerHTML = `<input type="checkbox" checked>${task.text} (Created: ${creationDateTime}) <button onclick="removeTask(${index})">Remove</button>`;
            listItem.style.textDecoration = "line-through";
        } else {
            listItem.innerHTML = `<input type="checkbox">${task.text} (Created: ${creationDateTime}) <button onclick="removeTask(${index})">Remove</button>`;
        }

        taskListElement.appendChild(listItem);

        listItem.querySelector("input[type='checkbox']").addEventListener("click", () => {
            task.completed = !task.completed;
            renderToDoList();
        });

        listItem.querySelector("button").addEventListener("click", () => {
            removeTask(index);
        });

        listItem.addEventListener("dblclick", () => {
            const newText = prompt("Edit task:", task.text);
            if (newText !== null) {
                task.text = newText;
                task.createdAt = new Date();
                renderToDoList();
            }
        });
    });
}

function addTask(text) {
    if (text.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }
    const newTask = {
        text,
        completed: false,
        createdAt: new Date(),
    };
    todoList.push(newTask);

    saveToLocalStorage();

    renderToDoList();
    document.getElementById("newTask").value = "";
}

function removeTask(index) {
    if (confirm("Are you sure you want to remove this task?")) {
        todoList.splice(index, 1);

        saveToLocalStorage();

        renderToDoList();
    }
}


function removeCompletedTasks() {
    const updatedList = todoList.filter((task) => !task.completed);
    todoList.length = 0;
    Array.prototype.push.apply(todoList, updatedList);
    renderToDoList();
}

function removeAllTasks() {
    if (confirm("Are you sure you want to remove all tasks?")) {
        todoList.length = 0;
        renderToDoList();
    }
}

document.getElementById("newTask").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        addTask(e.target.value);
    }
});

document.getElementById("clearStorage").addEventListener("click", () => {
    clearLocalStorage();
    todoList = [];
    renderToDoList();
});

document.getElementById("pickTodo").addEventListener("click", () => {
    pickRandomTodo();
});



document.getElementById("removeCompleted").addEventListener("click", removeCompletedTasks);
document.getElementById("removeAll").addEventListener("click", removeAllTasks);

renderToDoList();