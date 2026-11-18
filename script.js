
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let editId = null;

// Save tasks in Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add or Update Task
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    if (editId !== null) {
        tasks = tasks.map(task =>
            task.id === editId
                ? { ...task, text: text }
                : task
        );

        editId = null;
        document.getElementById("addBtn").textContent = "+ Add Task";

    } else {
        tasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });
    }

    input.value = "";

    saveTasks();
    displayTasks();
}

// Display Tasks
function displayTasks() {
    const taskList = document.getElementById("taskList");
    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        let matchesSearch = task.text.toLowerCase().includes(search);

        let matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty-message">No tasks found!</p>';
    }

    filteredTasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleTask(task.id);

        const span = document.createElement("span");
        span.className = task.completed
            ? "task-text completed"
            : "task-text";
        span.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";
        editButton.onclick = () => editTask(task.id);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteTask(task.id);

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        div.appendChild(checkbox);
        div.appendChild(span);
        div.appendChild(actions);

        taskList.appendChild(div);
    });

    updateStatistics();
}

// Mark Task as Completed
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    displayTasks();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(task => task.id === id);

    document.getElementById("taskInput").value = task.text;

    editId = id;

    document.getElementById("addBtn").textContent = "Update Task";

    document.getElementById("taskInput").focus();
}

// Delete Task
function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        displayTasks();

        if (editId === id) {
            editId = null;
            document.getElementById("taskInput").value = "";
            document.getElementById("addBtn").textContent = "+ Add Task";
        }
    }
}

// Filter Tasks
function setFilter(filter, button) {
    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayTasks();
}

// Clear Completed Tasks
function clearCompleted() {
    if (confirm("Delete all completed tasks?")) {
        tasks = tasks.filter(task => !task.completed);

        saveTasks();
        displayTasks();
    }
}

// Update Statistics
function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

// Enter Key Support
document.getElementById("taskInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Initial Display
displayTasks();
