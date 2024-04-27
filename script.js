import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"

let input = document.getElementById("input-field")
let button = document.getElementById("add-button")
let taskContainer = document.querySelector(".task-container")
let tasksList = document.getElementById("task-list")

const appSettings = {
    databaseURL: "https://clarity---todolist-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const tasksListInDB = ref(database, "tasks")

button.addEventListener("click", () => {
    let inputValue = input.value
    push(tasksListInDB, inputValue)

    // clearInputValue() // This line is not needed here because we clear the input value after getting the tasks from the database
})

onValue(tasksListInDB, (snapshot) => {
    let tasksArray = Object.values(snapshot.val())

    // Clear the tasksList before appending new tasks
    clearTaskList()

    for (let task = 0; task < tasksArray.length; task++) {
        const element = tasksArray[task];
        appendTaskToTaskList(element)
    }

    // Clear input value after fetching and displaying tasks
    clearInputValue()
})

function clearTaskList() { 
    tasksList.innerHTML = ""
}

function clearInputValue() {
    input.value = ""
}

function appendTaskToTaskList(task) {
    tasksList.innerHTML += `<li>${task}</li>`
}
