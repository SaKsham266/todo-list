// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const allBtn = document.getElementById('allBtn');
const activeBtn = document.getElementById('activeBtn');
const completedBtn = document.getElementById('completedBtn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// App State
let tasks = [];
let currentFilter = 'all';

// Initialize the app
function init() {
    loadTasksFromLocalStorage();
    renderTasks();
    updateTaskCount();
    
    // Event Listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    allBtn.addEventListener('click', () => setFilter('all'));
    activeBtn.addEventListener('click', () => setFilter('active'));
    completedBtn.addEventListener('click', () => setFilter('completed'));
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('todoTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasksToLocalStorage();
        renderTasks();
        updateTaskCount();
        
        // Clear input field
        taskInput.value = '';
        taskInput.focus();
    }
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage();
    renderTasks();
    updateTaskCount();
}

// Toggle task completion status
function toggleTaskStatus(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasksToLocalStorage();
    renderTasks();
    updateTaskCount();
}

// Clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasksToLocalStorage();
    renderTasks();
    updateTaskCount();
}

// Set the current filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    [allBtn, activeBtn, completedBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (filter === 'all') {
        allBtn.classList.add('active');
    } else if (filter === 'active') {
        activeBtn.classList.add('active');
    } else if (filter === 'completed') {
        completedBtn.classList.add('active');
    }
    
    renderTasks();
}

// Render tasks based on current filter
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Filter tasks based on current filter
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') {
            return !task.completed;
        } else if (currentFilter === 'completed') {
            return task.completed;
        }
        return true; // 'all' filter
    });
    
    // Render each task
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(deleteButton);
        
        taskList.appendChild(taskItem);
    });
}

// Update the task count
function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}
const themeToggleBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
    // Apply or remove dark mode class on <body>
    document.body.classList.toggle('dark-mode', theme === 'dark');

    // Update icon based on theme
    themeToggleBtn.textContent = theme === 'dark' ? '🌞' : '🌙';

    // Save the selected theme in localStorage
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// Run this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // default to light
    applyTheme(savedTheme); // Apply saved theme on load

    // Add event listener to toggle button
    themeToggleBtn.addEventListener('click', toggleTheme);
});

