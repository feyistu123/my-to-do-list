// 1. Detect environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// 2. Set URL (Replace 'feyistu123' and 'todo-list' with your actual GitHub info)
const API_URL = isLocal 
    ? 'http://localhost:3000/todos' 
    : 'https://my-json-server.typicode.com/feyistu123/todo-list/todos';

console.log("Connected to:", API_URL);

export const TodoAPI = {
    // GET all tasks (supports ?q= and ?category=)
    getAll: (params = {}) => {
        const url = new URL(API_URL);
        
        // Appends search parameters to the URL
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.append(key, params[key]);
            }
        });
        console.log("Fetching from URL:", url.toString());
        return fetch(url).then(res => res.json());
    },

    // POST a new task
    create: (task) => fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: false })
    }).then(res => res.json()),

    // PATCH (Update) task properties
    update: (id, updates) => fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    }).then(res => res.json()),

    // DELETE a task
    delete: (id) => fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())
};