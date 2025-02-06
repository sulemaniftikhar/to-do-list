// Select DOM elements
const taskInput = document.getElementById('taskInput');
const taskTime = document.getElementById('taskTime');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const alarmSound = document.getElementById('alarmSound');

// Add event listener to the "Add Task" button
addTaskBtn.addEventListener('click', addTask);

// Add event listener for pressing Enter key in the input field
taskInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDueTime = taskTime.value;

    if (taskText === '' || taskDueTime === '') {
        alert('Please enter both a task and a time!');
        return;
    }

    // Create a new list item
    const li = document.createElement('li');
    li.textContent = taskText;

    // Create a span to show the scheduled time
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `⏰ ${taskDueTime}`;
    timeSpan.classList.add('task-time');
    li.appendChild(timeSpan);

    // Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    // Add event listener to the delete button
    deleteBtn.addEventListener('click', function () {
        taskList.removeChild(li);
        clearTimeout(taskTimeout); // Clear the timeout when the task is deleted
    });

    // Append delete button to the list item
    li.appendChild(deleteBtn);

    // Append the list item to the task list
    taskList.appendChild(li);

    // Clear the input fields
    taskInput.value = '';
    taskTime.value = '';

    // Schedule the alarm for the exact due time
    scheduleAlarm(taskDueTime, li);
}

// Function to schedule an alarm for a specific time
function scheduleAlarm(dueTime, taskElement) {
    const now = new Date();
    const [hours, minutes] = dueTime.split(':').map(Number);

    // Create a Date object for the due time today
    const dueDate = new Date(now);
    dueDate.setHours(hours, minutes, 0, 0);

    // If the due time is earlier than the current time, assume it's for the next day
    if (dueDate <= now) {
        dueDate.setDate(dueDate.getDate() + 1);
    }

    // Calculate the time difference in milliseconds
    const timeDifference = dueDate - now;

    // Use setTimeout to trigger the alarm at the exact due time
    const taskTimeout = setTimeout(() => {
        if (!taskElement.classList.contains('completed')) {
            // Play the alarm sound
            alarmSound.play();

            // Alert the user
            // alert(`Task "${taskElement.textContent.split('⏰')[0].trim()}" is due now!`);

            // Optionally, stop the alarm after some time
            setTimeout(() => {
                alarmSound.pause();
                alarmSound.currentTime = 0; // Reset the sound
            }, 50000); // Stop after 5 seconds
        }
    }, timeDifference);

    // Store the timeout ID in the task element for later use
    taskElement.dataset.timeoutId = taskTimeout;
}

// Function to clear all alarms when the page is refreshed or closed
window.addEventListener('beforeunload', () => {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        clearTimeout(task.dataset.timeoutId);
    });
});