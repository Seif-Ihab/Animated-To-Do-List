// ============================
// 🌗 Tailwind Dark Mode Setup
// ============================
tailwind.config = {
    darkMode: 'class', // Enable class-based dark mode
};

// Get theme from localStorage and apply it
if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
}

// ============================
// 🚀 Load tasks when DOM is ready
// ============================
document.addEventListener("DOMContentLoaded", loadTasks);

// ============================
// 🔗 DOM Elements
// ============================
const newTask = document.querySelector('input[type="text"]');
const message = document.querySelector(".message");

// ============================
// 🌙 Theme Toggle Function
// ============================
function toggleDark() {
    const html = document.documentElement;
    html.classList.toggle("dark");
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
}

// ============================
// ➕ Add Task Function
// ============================
function addToList() {
    const taskText = newTask.value.trim();

    // If input is empty, show message
    if (taskText === "") {
        message.classList.remove("hidden");
        return;
    }

    message.classList.add("hidden");

    const taskObj = {
        text: taskText,
        completed: false
    };

    createTaskElement(taskObj);
    saveToLocalStorage(taskObj);
    updateItemsLeft();

    newTask.value = ""; // Clear input field
}

// Enable adding task with Enter key
newTask.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addToList();
    }
});

// ============================
// 🧱 Create Task Element in DOM
// ============================
function createTaskElement(taskObj) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item flex justify-between items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-lg shadow m-5 transition-all duration-300 transform scale-95 opacity-0";

    const span = document.createElement("span");
    span.textContent = taskObj.text;
    span.className = "flex-1";

    // If task is completed, style it
    if (taskObj.completed) {
        span.classList.add("opacity-50", "line-through");
    }

    // 🗑 Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.className = "ml-4 text-red-400 hover:text-red-500 hover:scale-110 transition-transform";
    deleteBtn.onclick = function () {
        taskDiv.classList.add("opacity-0", "scale-90", "transition", "duration-300");
        setTimeout(() => {
            taskDiv.remove();
            removeFromLocalStorage(taskObj.text);
            updateItemsLeft();
        }, 300);
    };

    // ✅ Done Button
    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    doneBtn.className = "mr-4 hover:scale-110 transition-transform rounded-full w-5 h-5 flex items-center justify-center text-[12px]";

    // Style done button based on completion
    if (taskObj.completed) {
        doneBtn.classList.add("bg-blue-400", "text-white", "border", "border-transparent");
    } else {
        doneBtn.classList.add("text-blue-400", "border", "border-blue-400");
    }

    // Toggle task completion
    doneBtn.addEventListener("click", function () {
        const isDone = span.classList.toggle("line-through");
        span.classList.toggle("opacity-50");

        doneBtn.classList.toggle("bg-blue-400");
        doneBtn.classList.toggle("text-white");
        doneBtn.classList.toggle("text-blue-400");
        doneBtn.classList.toggle("border-transparent");

        taskObj.completed = isDone;
        updateTaskInLocalStorage(taskObj);
        updateItemsLeft();
    });

    // Append elements
    taskDiv.appendChild(doneBtn);
    taskDiv.appendChild(span);
    taskDiv.appendChild(deleteBtn);

    document.getElementById("tasksContainer").appendChild(taskDiv);

    setTimeout(() => {
        taskDiv.classList.add("scale-100", "opacity-100");
    }, 10);
}

// ============================
// 💾 Save Task to localStorage
// ============================
function saveToLocalStorage(taskObj) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ============================
// 📦 Load Tasks on Page Load
// ============================
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task));
    updateItemsLeft();
}

// ============================
// ✏️ Update Task in localStorage
// ============================
function updateTaskInLocalStorage(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => task.text === updatedTask.text ? updatedTask : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ============================
// ❌ Remove Task from localStorage
// ============================
function removeFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ============================
// 🔢 Update Active Task Counter
// ============================
function updateItemsLeft() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const activeCount = tasks.filter(task => !task.completed).length;
    document.getElementById("itemsCount").textContent = activeCount;
}

// ============================
// 🔍 Apply Filter (All / Active / Completed)
// ============================
function applyFilter(filter) {
    const taskElements = document.querySelectorAll(".task-item");
    taskElements.forEach(el => {
        const isDone = el.querySelector("span").classList.contains("line-through");

        if (filter === "all") {
            el.classList.remove("hidden");
        } else if (filter === "active") {
            el.classList.toggle("hidden", isDone);
        } else if (filter === "completed") {
            el.classList.toggle("hidden", !isDone);
        }
    });

    // Highlight active filter button
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white", "dark:bg-blue-400");
    });

    const activeBtn = document.getElementById("filter" + filter.charAt(0).toUpperCase() + filter.slice(1));
    activeBtn.classList.add("bg-blue-600", "text-white", "dark:bg-blue-400");
}

// ============================
// 📌 Event Listeners
// ============================

// Filter buttons
document.getElementById("filterAll").addEventListener("click", () => applyFilter("all"));
document.getElementById("filterActive").addEventListener("click", () => applyFilter("active"));
document.getElementById("filterCompleted").addEventListener("click", () => applyFilter("completed"));

// Clear completed tasks
document.getElementById("clearCompleted").addEventListener("click", () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => !task.completed);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Remove completed tasks from UI
    document.querySelectorAll(".task-item").forEach(taskEl => {
        if (taskEl.querySelector("span").classList.contains("line-through")) {
            taskEl.remove();
        }
    });

    updateItemsLeft();
});

// ============================
// 🧩 Expose addToList for button
// ============================
window.addToList = addToList;
