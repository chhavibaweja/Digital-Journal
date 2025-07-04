document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const categorySelect = document.getElementById("categorySelect");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const todoList = document.getElementById("todoList");

    let editingTask = null;

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
        tasks.forEach(({ task, category, completed }) => {
            const taskItem = createTaskItem(task, category, completed);
            todoList.appendChild(taskItem);
        });
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        const taskItems = document.querySelectorAll(".todo-item");
        taskItems.forEach(item => {
            const text = item.querySelector("span").textContent;
            const [task, category] = text.split(" - ");
            const completed = item.classList.contains("completed");
            tasks.push({ task, category, completed });
        });
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    // Create task item
    function createTaskItem(task, category, completed = false) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("todo-item");

        const taskContent = document.createElement("span");
        taskContent.textContent = `${task} - ${category}`;

        const markCompletedBtn = document.createElement("button");
        markCompletedBtn.textContent = "✔️";
        markCompletedBtn.classList.add("mark-completed-btn");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        taskItem.appendChild(taskContent);
        taskItem.appendChild(markCompletedBtn);
        taskItem.appendChild(editBtn);
        taskItem.appendChild(deleteBtn);

        // Apply completed class if needed
        if (completed) {
            taskItem.classList.add("completed");
        }

        // Mark Task as Completed
        markCompletedBtn.addEventListener("click", function () {
            taskItem.classList.toggle("completed");
            saveTasks();
        });

        // Edit Task
        editBtn.addEventListener("click", function () {
            if (editingTask) return;
            editingTask = taskItem;
            const [taskText, categoryText] = taskContent.textContent.split(" - ");
            taskInput.value = taskText;
            categorySelect.value = categoryText;
            addTaskBtn.textContent = "Save Changes";
        });

        // Delete Task
        deleteBtn.addEventListener("click", function () {
            todoList.removeChild(taskItem);
            saveTasks();
        });

        return taskItem;
    }

    // Add or Edit Task
    addTaskBtn.addEventListener("click", function () {
        const task = taskInput.value.trim();
        const category = categorySelect.value;

        if (!task) {
            alert("Please enter a task!");
            return;
        }

        if (editingTask) {
            const taskContent = editingTask.querySelector("span");
            taskContent.textContent = `${task} - ${category}`;
            addTaskBtn.textContent = "Add Task";
            editingTask = null;
        } else {
            const newTaskItem = createTaskItem(task, category);
            todoList.appendChild(newTaskItem);
        }

        saveTasks();

        taskInput.value = "";
        categorySelect.value = "Work";
    });

    // Load on start
    loadTasks();
});
