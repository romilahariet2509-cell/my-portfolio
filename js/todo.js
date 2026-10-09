```javascript
const taskForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const addButton = document.getElementById("add-button");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";
let editingId = null;

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "todo-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.action = "toggle";
        checkbox.dataset.id = task.id;
        checkbox.setAttribute("aria-label", "Mark " + task.text + " completed");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed-task");
        }

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = task.id;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = task.id;

        li.append(checkbox, taskText, editButton, deleteButton);
        taskList.appendChild(li);
    });

    const remaining = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent = remaining + " task(s) remaining";
    emptyMessage.hidden = filteredTasks.length > 0;
}

// Add a new task or save an edited task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    if (editingId !== null) {
        tasks = tasks.map(function (task) {
            if (task.id === editingId) {
                return { ...task, text: text };
            }

            return task;
        });

        editingId = null;
        addButton.textContent = "Add Task";
    } else {
        tasks.push({
            id: Date.now().toString() + Math.random().toString(16).slice(2),
            text: text,
            completed: false
        });
    }

    saveTasks();
    renderTasks();
    taskForm.reset();
    taskInput.focus();
});

// Handle task actions using event delegation
taskList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") {
        const task = tasks.find(function (item) {
            return item.id === id;
        });

        if (task) {
            taskInput.value = task.text;
            editingId = id;
            addButton.textContent = "Save Changes";
            taskInput.focus();
        }
    }

    if (action === "delete") {
        tasks = tasks.filter(function (task) {
            return task.id !== id;
        });

        if (editingId === id) {
            editingId = null;
            taskForm.reset();
            addButton.textContent = "Add Task";
        }

        saveTasks();
        renderTasks();
    }
});

// Handle completion checkboxes using event delegation
taskList.addEventListener("change", function (event) {
    if (event.target.matches('input[data-action="toggle"]')) {
        const id = event.target.dataset.id;

        tasks = tasks.map(function (task) {
            if (task.id === id) {
                return { ...task, completed: event.target.checked };
            }

            return task;
        });

        saveTasks();
        renderTasks();
    }
});

// Filter tasks
document.querySelector(".todo-filters").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-filter]");

    if (!button) {
        return;
    }

    currentFilter = button.dataset.filter;
    renderTasks();
});

// Initial display
renderTasks();
```