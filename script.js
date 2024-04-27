// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Get references to DOM elements
let input = document.getElementById("input-field");
let button = document.getElementById("add-button");
let tasksList = document.getElementById("task-list");

// Firebase app configuration
const appSettings = {
    databaseURL: "https://clarity---todolist-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase app with the provided settings
const app = initializeApp(appSettings);

// Get a reference to the Firebase database
const database = getDatabase(app);

// Reference to the 'tasks' node in the Firebase database
const tasksListInDB = ref(database, "tasks");

// Add event listener to the 'Add' button to call the addTask function when clicked
button.addEventListener("click", addTask);

// Listen for changes in the 'tasks' node in the Firebase database
onValue(tasksListInDB, (snapshot) => {
    // Convert the snapshot of tasks into an array of key-value pairs
    let tasksArray = Object.entries(snapshot.val() || {});

    // Clear the existing task list before appending new tasks
    clearTaskList();

    // Iterate through each task in the tasksArray and append it to the task list
    tasksArray.forEach(([taskId, task]) => {
        appendTaskToTaskList(taskId, task);
    });

    // Clear input value after fetching and displaying tasks
    clearInputValue();
});

// Function to add a task to the Firebase database
function addTask() {
    // Get the value of the input field and trim any leading or trailing spaces
    let inputValue = input.value.trim();
    // If the input value is not empty, push it to the 'tasks' node in the database
    if (inputValue !== "") {
        push(tasksListInDB, inputValue);
    }
}

// Function to clear the task list in the UI
function clearTaskList() {
    tasksList.innerHTML = "";
}

// Function to clear the input value
function clearInputValue() {
    input.value = "";
}

// Function to append a task to the task list in the UI
function appendTaskToTaskList(taskId, task) {
    // Create a new <li> element for the task
    const taskItem = document.createElement('li');
    // Set the text content of the task item to the task name
    taskItem.textContent = task;
    // Set a custom data attribute 'data-id' with the taskId
    taskItem.setAttribute('data-id', taskId);
    
    // Generate random color for the border and text of the task item
    const colors = generateRandomColor();
    taskItem.style.border = `2px solid ${colors.borderColor}`;
    taskItem.style.color = colors.textColor;
    
    // Add double click event listener to delete the task
    taskItem.addEventListener('dblclick', () => deleteTask(taskId));
    // Append the task item to the task list
    tasksList.appendChild(taskItem);
}

// Function to delete a task from the Firebase database
function deleteTask(taskId) {
    remove(ref(database, `tasks/${taskId}`));
}

// Function to generate random border color and text color
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    // Calculate luminance of the generated color
    const luminance = (0.2126 * parseInt(color.substr(1, 2), 16)) +
        (0.7152 * parseInt(color.substr(3, 2), 16)) +
        (0.0722 * parseInt(color.substr(5, 2), 16));
    // Set text color based on luminance
    const textColor = luminance > 0.5 ? '#000000' : '#ffffff'; // Black for light backgrounds, white for dark backgrounds
    // Return an object containing the generated border color and text color
    return { borderColor: color, textColor: textColor };
}
