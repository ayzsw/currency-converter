const API_BASE = 'https://jsonplaceholder.typicode.com';
const USER_ID = 1; // Фиксированный userId для наших задач

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const noTasks = document.getElementById('noTasks');

const editModal = document.getElementById('editModal');
const deleteAlert = document.getElementById('deleteAlert');
const editInput = document.getElementById('editInput');
const saveEdit = document.getElementById('saveEdit');
const cancelEdit = document.getElementById('cancelEdit');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

let tasks = []; // Массив задач из API
let currentEditId = null;
let currentDeleteId = null;

// Загрузка задач из API
async function loadTasks() {
  try {
    const response = await fetch(`${API_BASE}/todos?userId=${USER_ID}`);
    const apiTasks = await response.json();
    // Фильтруем только наши (userId=1), берём title как текст задачи
    tasks = apiTasks.map(task => ({ id: task.id, text: task.title }));
    renderTasks();
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    // Fallback на localStorage, если API не работает
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
  }
}

// Сохранение в localStorage (fallback)
function saveToLocal() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Рендер задач (как раньше)
function renderTasks() {
  taskList.innerHTML = '';
  noTasks.style.display = tasks.length === 0 ? 'block' : 'none';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">✕</button>
      </div>
    `;

    // Редактирование
    li.querySelector('.edit-btn').addEventListener('click', () => {
      currentEditId = task.id;
      editInput.value = task.text;
      editModal.style.display = 'flex';
    });

    // Удаление
    li.querySelector('.delete-btn').addEventListener('click', () => {
      currentDeleteId = task.id;
      deleteAlert.style.display = 'flex';
    });

    taskList.appendChild(li);
  });
}

// Добавить задачу (POST)
async function addTask(text) {
  try {
    // POST возвращает 201 с данными
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, title: text, completed: false })
    });
    const newTask = await response.json();
    // Добавляем в локальный массив (id генерируется API)
    tasks.push({ id: newTask.id, text: text });
    renderTasks();
  } catch (error) {
    console.error('Ошибка добавления:', error);
    // Fallback
    const fallbackId = Date.now(); // Простой ID
    tasks.push({ id: fallbackId, text });
    saveToLocal();
    renderTasks();
  }
}

// Обновить задачу (PUT)
async function updateTask(id, newText) {
  try {
    await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, title: newText, completed: false })
    });
    // Обновляем локально
    const task = tasks.find(t => t.id === id);
    if (task) task.text = newText;
    renderTasks();
  } catch (error) {
    console.error('Ошибка обновления:', error);
    // Fallback
    const task = tasks.find(t => t.id === id);
    if (task) task.text = newText;
    saveToLocal();
    renderTasks();
  }
}

// Удалить задачу (DELETE)
async function deleteTask(id) {
  try {
    await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
    // Удаляем локально
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
  } catch (error) {
    console.error('Ошибка удаления:', error);
    // Fallback
    tasks = tasks.filter(t => t.id !== id);
    saveToLocal();
    renderTasks();
  }
}

// События (как раньше, но с API)
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text) {
    addTask(text);
    taskInput.value = '';
  }
});

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

saveEdit.addEventListener('click', () => {
  const text = editInput.value.trim();
  if (text && currentEditId !== null) {
    updateTask(currentEditId, text);
  }
  closeEdit();
});

cancelEdit.addEventListener('click', closeEdit);
function closeEdit() {
  editModal.style.display = 'none';
  currentEditId = null;
}

yesBtn.addEventListener('click', () => {
  if (currentDeleteId !== null) {
    deleteTask(currentDeleteId);
  }
  deleteAlert.style.display = 'none';
  currentDeleteId = null;
});

noBtn.addEventListener('click', () => {
  deleteAlert.style.display = 'none';
  currentDeleteId = null;
});

// Инициализация: загружаем из API
loadTasks();