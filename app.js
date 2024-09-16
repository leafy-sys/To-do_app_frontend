const apiUrl = 'http:techsbible.com'; // Replace with your server's IP and port

async function fetchTasks() {
    try {
        const response = await fetch(`${apiUrl}/tasks`);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';
        if (task.is_completed) {
            listItem.classList.add('completed');
        }

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.description;

        const completeButton = document.createElement('button');
        completeButton.textContent = task.is_completed ? 'Undo' : 'Complete';
        completeButton.addEventListener('click', () => toggleTaskCompletion(task.id, !task.is_completed));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        listItem.appendChild(taskText);
        listItem.appendChild(completeButton);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    const addTaskButton = document.getElementById('add-task-button');
    addTaskButton.addEventListener('click', () => {
        const taskInput = document.getElementById('new-task-input');
        const description = taskInput.value.trim();
        if (description) {
            addTask(description);
            taskInput.value = '';
        }
    });
});


async function addTask(description) {
    try {
        await fetch(`${apiUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description, is_completed: false })
        });
        fetchTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function toggleTaskCompletion(taskId, isCompleted) {
    try {
        // Fetch the current task first to get its description
        const taskResponse = await fetch(`${apiUrl}/tasks/${taskId}`);
        const task = await taskResponse.json();

        // Send the updated task with the current description and updated is_completed status
        await fetch(`${apiUrl}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: task.description, // Keep the description the same
                is_completed: isCompleted // Update the completion status
            })
        });

        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error updating task:', error);
    }
}


async function deleteTask(taskId) {
    try {
        await fetch(`${apiUrl}/tasks/${taskId}`, {
            method: 'DELETE'
        });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}
