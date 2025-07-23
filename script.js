// Initialize users array with numeric IDs
let users = [];
let nextId = 1; // Auto-incrementing ID

// Get DOM elements
const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const taskInput = document.getElementById('task');
const submitBtn = document.getElementById('submitBtn');
const userList = document.getElementById('userList');
const searchIdInput = document.getElementById('searchId');
const searchNameInput = document.getElementById('searchName');
const searchEmailInput = document.getElementById('searchEmail');
const searchTaskInput = document.getElementById('searchTask');

// Render users table
function renderUsers(filteredUsers = users) {
    userList.innerHTML = '';
    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.task}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Add new user with numeric ID
function addUser(name, email, task) {
    const id = nextId++;
    users.push({ id, name, email, task });
    localStorage.setItem('users', JSON.stringify(users));
    resetForm(); // Reset form after adding
    renderUsers();
}

// Edit user
function editUser(index) {
    userIdInput.value = index;
    nameInput.value = users[index].name;
    emailInput.value = users[index].email;
    taskInput.value = users[index].task;
    submitBtn.textContent = 'Update';
}

// Update user
function updateUser(index, name, email, task) {
    users[index] = { ...users[index], name, email, task }; // Preserve ID
    localStorage.setItem('users', JSON.stringify(users));
    resetForm(); // Reset form after updating
    renderUsers();
}

// Delete user
function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
}

// Reset form
function resetForm() {
    userForm.reset(); // Clears all form inputs
    userIdInput.value = ''; // Clear hidden ID field
    submitBtn.textContent = 'Add User'; // Reset button text
}

// Search user by ID, Name, Email, or Task
function searchUser() {
    const searchId = searchIdInput.value.trim();
    const searchName = searchNameInput.value.trim().toLowerCase();
    const searchEmail = searchEmailInput.value.trim().toLowerCase();
    const searchTask = searchTaskInput.value.trim().toLowerCase();

    const filteredUsers = users.filter(user => {
        const matchesId = !searchId || user.id.toString().includes(searchId);
        const matchesName = !searchName || user.name.toLowerCase().includes(searchName);
        const matchesEmail = !searchEmail || user.email.toLowerCase().includes(searchEmail);
        const matchesTask = !searchTask || user.task.toLowerCase().includes(searchTask);
        return matchesId && matchesName && matchesEmail && matchesTask;
    });
    renderUsers(filteredUsers);
    // Clear search inputs after search
    searchIdInput.value = '';
    searchNameInput.value = '';
    searchEmailInput.value = '';
    searchTaskInput.value = '';
}

// Handle form submission
userForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!nameInput.value.trim() || !emailInput.value.trim() || !taskInput.value.trim()) {
        alert('Please fill all fields!');
        return;
    }
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const task = taskInput.value.trim();
    const userIndex = userIdInput.value;

    if (userIndex !== '') {
        updateUser(parseInt(userIndex), name, email, task);
    } else {
        addUser(name, email, task);
    }
});

// Load users on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
        // Find the highest ID and set nextId accordingly
        const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
        nextId = maxId + 1;
    }
    if (userForm && userList && nameInput && emailInput && taskInput && submitBtn &&
        searchIdInput && searchNameInput && searchEmailInput && searchTaskInput) {
        renderUsers();
    } else {
        console.error('One or more DOM elements not found:', {
            userForm, userList, nameInput, emailInput, taskInput, submitBtn,
            searchIdInput, searchNameInput, searchEmailInput, searchTaskInput
        });
    }
});

// Reset search on input change
[searchIdInput, searchNameInput, searchEmailInput, searchTaskInput].forEach(input => {
    input.addEventListener('input', () => {
        if (!searchIdInput.value.trim() && !searchNameInput.value.trim() &&
            !searchEmailInput.value.trim() && !searchTaskInput.value.trim()) {
            renderUsers();
        }
    });
});