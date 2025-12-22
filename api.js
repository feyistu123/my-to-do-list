const API_URL = 'http://localhost:3000/todos';

export const TodoAPI = {
    // GET all tasks
    getAll: () => fetch(API_URL).then(res => res.json()),
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