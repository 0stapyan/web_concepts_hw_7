const todoList = [];

function renderToDoList() {
    const sortedToDoList = todoList.sort((a, b) => b.createdAt - a.createdAt);

    const taskListElement = document.getElementById("taskList");

    taskListElement.innerHTML = "";

    sortedToDoList.forEach((task, index) => {
        const listItem = document.createElement("li");

        const creationDateTime = new Date(task.createdAt).toLocaleString(); // Format creation date and time

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
    renderToDoList();
    document.getElementById("newTask").value = "";
}

function removeTask(index) {
    if (confirm("Are you sure you want to remove this task?")) {
        todoList.splice(index, 1);
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

document.getElementById("removeCompleted").addEventListener("click", removeCompletedTasks);
document.getElementById("removeAll").addEventListener("click", removeAllTasks);

renderToDoList();