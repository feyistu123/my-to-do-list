import { TodoAPI } from './api.js';

// Elements
const taskForm = document.querySelector('#todo-form');
const searchInput = document.querySelector('#search-input');
const categoryFilter = document.querySelector('#category-filter');
const taskList = document.querySelector('#task-list');
const taskListSection = document.querySelector('#task-list-section'); 
const submitBtn = document.querySelector('#submit-btn');
const toggleBtn = document.getElementById('toggle-form-btn');
const formAside = document.getElementById('form-aside');
const themeToggle = document.getElementById("themeToggle");


// --- State Variables (CRITICAL: Added these) ---
let editMode = false;
let editId = null;

// --- 1. Toggle View Logic ---
function toggleView(showForm) {
    if (showForm) {
        formAside.classList.remove('form-hidden');
        if(taskListSection) taskListSection.style.display = 'none';
        toggleBtn.textContent = 'Back to List';
        toggleBtn.classList.add('btn-secondary'); 
    } else {
        formAside.classList.add('form-hidden');
        if(taskListSection) taskListSection.style.display = 'block';
        toggleBtn.textContent = '+ New Task';
        toggleBtn.classList.remove('btn-secondary');
        resetForm(); 
    }
}

toggleBtn.addEventListener('click', () => {
    const isFormHidden = formAside.classList.contains('form-hidden');
    toggleView(isFormHidden); 
});
// dark mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


// --- 2. Render Logic ---
async function loadTasks() {
    // 1. Get current values from the UI
    const query = searchInput ? searchInput.value : '';
    const category = categoryFilter ? categoryFilter.value : '';

    // 2. Pass them to the API (the keys 'q' and 'category' match JSON-server rules)
    const tasks = await TodoAPI.getAll({ q: query, category: category });
    if (!tasks) return; 

    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'done' : ''}`;
        card.innerHTML = `
            <div class="category-tag">${task.category || 'General'}</div>
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
            <small>Due: ${task.dueDate}</small>
            <div class="task-actions">
                <button class="btn-done" onclick="toggleStatus('${task.id}', ${task.completed})">
                    ${task.completed ? '↩️ Undo' : '✅ Done'}
                </button>
                <button class="btn-edit" onclick="prepareEdit('${task.id}')">✏️ Edit</button>
                <button class="btn-delete" onclick="handleDelete('${task.id}')">🗑️ Delete</button>
            </div>
        `;
        taskList.appendChild(card);
    });
}

// --- 3. Submit Logic ---
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskData = {
        title: document.getElementById('title').value,
        description: document.getElementById('desc').value,
        category: document.getElementById('category').value,
        dueDate: document.getElementById('date').value
    };

    if (editMode) {
        // Sends PATCH request via api.js
        await TodoAPI.update(editId, taskData);
    } else {
        // Sends POST request via api.js
        await TodoAPI.create(taskData);
    }

    taskForm.reset();
    await loadTasks();
    toggleView(false); // Automatically returns to list view
});

// --- 4. Interaction Handlers (Attached to window for HTML onclicks) ---
window.handleDelete = async (id) => {
    if (confirm("Delete this task?")) {
        await TodoAPI.delete(id);
        loadTasks();
    }
};

window.toggleStatus = async (id, currentStatus) => {
    await TodoAPI.update(id, { completed: !currentStatus });
    loadTasks();
};

window.prepareEdit = async (id) => {
    const tasks = await TodoAPI.getAll();
    const task = tasks.find(t => String(t.id) === String(id));

    if (!task) return;

    // 1. Fill the form with existing data
    document.getElementById('title').value = task.title;
    document.getElementById('desc').value = task.description;
    document.getElementById('category').value = task.category;
    document.getElementById('date').value = task.dueDate;

    // 2. Set the logic state
    editMode = true;
    editId = id;

    // 3. Update UI
    submitBtn.innerText = "Update Task";
    submitBtn.style.background = "#059669"; // Green for update
    
    // 4. Switch the view
    toggleView(true); 
};

// ... existing element selectors
const cancelBtn = document.querySelector('#cancel-btn');

// --- Cancel Button Logic ---
cancelBtn.addEventListener('click', () => {
    // Simply go back to the list view
    // toggleView(false) already calls resetForm() internally
    toggleView(false);
});

// --- Modified resetForm (to ensure everything clears) ---
function resetForm() {
    editMode = false;
    editId = null;
    submitBtn.innerText = "Add Task";
    submitBtn.style.background = "#4f46e5"; // Original Blue
    taskForm.reset(); // Clears the text inputs
}
// Search as you type (with a tiny delay is better, but this is simplest)
searchInput.addEventListener('input', () => {
    loadTasks();
});

// Filter when category changes
categoryFilter.addEventListener('change', () => {
    loadTasks();
});

// Initial Load
loadTasks();