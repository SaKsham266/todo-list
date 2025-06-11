// App State
let tasks = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const themeToggleBtn = document.getElementById('themeToggle');

    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeToggleBtn.textContent = theme === 'dark' ? '🌞' : '🌙';
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // Theme logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Core functionality
    function init() {
        loadTasksFromLocalStorage();
        renderTasks();
        updateTaskCount();

        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        allBtn.addEventListener('click', () => setFilter('all'));
        activeBtn.addEventListener('click', () => setFilter('active'));
        completedBtn.addEventListener('click', () => setFilter('completed'));
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }

    function loadTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem('todoTasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

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
            taskInput.value = '';
            taskInput.focus();
        }
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasksToLocalStorage();
        renderTasks();
        updateTaskCount();
    }

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

    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasksToLocalStorage();
        renderTasks();
        updateTaskCount();
    }

    function setFilter(filter) {
        currentFilter = filter;
        [allBtn, activeBtn, completedBtn].forEach(btn => btn.classList.remove('active'));
        if (filter === 'all') allBtn.classList.add('active');
        else if (filter === 'active') activeBtn.classList.add('active');
        else completedBtn.classList.add('active');
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

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

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    // Initialize app
    init();
});
