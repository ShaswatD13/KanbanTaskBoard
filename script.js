var tasks = [];

var currentEditId = null;
window.onload = function () {
    loadTasks();
    renderTasks();
};

function submitAddTask() {

    var title = document.getElementById("taskTitle").value;
    var description = document.getElementById("taskDesc").value;
    var priority = document.getElementById("taskPriority").value;

    document.getElementById("addTaskAlert").style.display = "none";

    document.getElementById("taskTitle").style.borderColor = "";
    document.getElementById("taskDesc").style.borderColor = "";
    document.getElementById("taskPriority").style.borderColor = "";

    if (title.trim() === "") {
        document.getElementById("taskTitle").style.borderColor = "red";
        document.getElementById("addTaskAlert").style.display = "block";
        return;
    }

    if (description.trim() === "") {
        document.getElementById("taskDesc").style.borderColor = "red";
        document.getElementById("addTaskAlert").style.display = "block";
        return;
    }

    if (priority === "") {
        document.getElementById("taskPriority").style.borderColor = "red";
        document.getElementById("addTaskAlert").style.display = "block";
        return;
    }

    var newTask = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        status: "To Do"
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDesc").value = "";
    document.getElementById("taskPriority").value = "";

    var modal = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
    modal.hide();
}

function openEditModal(id) {

    currentEditId = id;

    var task = null;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            task = tasks[i];
            break;
        }
    }

    if (task === null) {
        return;
    }

    document.getElementById("editTaskTitle").value = task.title;
    document.getElementById("editTaskDesc").value = task.description;
    document.getElementById("editTaskPriority").value = task.priority;

    document.getElementById("editTaskAlert").style.display = "none";

    document.getElementById("editTaskTitle").style.borderColor = "";
    document.getElementById("editTaskDesc").style.borderColor = "";

    var modal = new bootstrap.Modal(document.getElementById("editTaskModal"));
    modal.show();
}

function submitEditTask() {

    var title = document.getElementById("editTaskTitle").value;
    var description = document.getElementById("editTaskDesc").value;
    var priority = document.getElementById("editTaskPriority").value;

    document.getElementById("editTaskAlert").style.display = "none";

    if (title.trim() === "") {
        document.getElementById("editTaskTitle").style.borderColor = "red";
        document.getElementById("editTaskAlert").style.display = "block";
        return;
    }

    if (description.trim() === "") {
        document.getElementById("editTaskDesc").style.borderColor = "red";
        document.getElementById("editTaskAlert").style.display = "block";
        return;
    }

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === currentEditId) {
            tasks[i].title = title;
            tasks[i].description = description;
            tasks[i].priority = priority;
            break;
        }
    }

    saveTasks();

    renderTasks();

    var modal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
    modal.hide();
}

function openDeleteModal(id) {

    document.getElementById("deleteTaskId").value = id;

    var modal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
    modal.show();
}

function confirmDelete() {

    var id = parseInt(document.getElementById("deleteTaskId").value);

    var newTasksList = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            newTasksList.push(tasks[i]);
        }
    }

    tasks = newTasksList;

    saveTasks();

    renderTasks();

    var modal = bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal"));
    modal.hide();
}

function onDragStart(event, id) {
    event.dataTransfer.setData("text", id);
    event.target.style.opacity = "0.5";
}

function onDragEnd(event) {
    event.target.style.opacity = "1";
}

function onDragOver(event) {
    event.preventDefault();

    event.currentTarget.style.border = "2px dashed #6366f1";
    event.currentTarget.style.background = "rgba(99, 102, 241, 0.07)";
}

function onDragLeave(event) {
    event.currentTarget.style.border = "2px dashed transparent";
    event.currentTarget.style.background = "";
}

function onDrop(event, newStatus) {
    event.preventDefault();

    event.currentTarget.style.border = "2px dashed transparent";
    event.currentTarget.style.background = "";

    var id = parseInt(event.dataTransfer.getData("text"));

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].status = newStatus;
            break;
        }
    }

    saveTasks();
    renderTasks();
}

function saveTasks() {
    var text = JSON.stringify(tasks);
    localStorage.setItem("kanban_tasks", text);
}

function loadTasks() {
    var savedText = localStorage.getItem("kanban_tasks");

    if (savedText !== null) {
        tasks = JSON.parse(savedText);
    } else {
        tasks = [
            {
                id: 1,
                title: "Read Board Instructions",
                description: "Welcome! Try dragging this card to In Progress.",
                priority: "Low",
                status: "To Do"
            },
            {
                id: 2,
                title: "Test Drag and Drop",
                description: "Drag task cards between columns to change their status.",
                priority: "Medium",
                status: "In Progress"
            },
            {
                id: 3,
                title: "Prepare Capstone Slides",
                description: "Draft slides explaining localStorage and DOM manipulation.",
                priority: "High",
                status: "Done"
            }
        ];

        saveTasks();
    }
}

function renderTasks() {

    document.getElementById("todoList").innerHTML = "";
    document.getElementById("inProgressList").innerHTML = "";
    document.getElementById("doneList").innerHTML = "";

    var todoCount = 0;
    var inProgressCount = 0;
    var doneCount = 0;

    for (var i = 0; i < tasks.length; i++) {

        var task = tasks[i];

        var card = buildCard(task);

        if (task.status === "To Do") {
            document.getElementById("todoList").appendChild(card);
            todoCount++;

        } else if (task.status === "In Progress") {
            document.getElementById("inProgressList").appendChild(card);
            inProgressCount++;

        } else if (task.status === "Done") {
            document.getElementById("doneList").appendChild(card);
            doneCount++;
        }
    }

    if (todoCount === 0) {
        document.getElementById("todoList").innerHTML =
            "<div class='empty-column-state'><i class='fa-solid fa-inbox'></i><span>No tasks yet. Click Add Task!</span></div>";
    }

    if (inProgressCount === 0) {
        document.getElementById("inProgressList").innerHTML =
            "<div class='empty-column-state'><i class='fa-solid fa-spinner'></i><span>No tasks in progress. Drag a card here.</span></div>";
    }

    if (doneCount === 0) {
        document.getElementById("doneList").innerHTML =
            "<div class='empty-column-state'><i class='fa-solid fa-circle-check'></i><span>No completed tasks yet.</span></div>";
    }

    document.getElementById("todoCount").textContent = todoCount;
    document.getElementById("inProgressCount").textContent = inProgressCount;
    document.getElementById("doneCount").textContent = doneCount;
}

function buildCard(task) {

    var card = document.createElement("div");
    card.className = "task-card priority-" + task.priority.toLowerCase();
    card.setAttribute("draggable", "true");
    card.setAttribute("ondragstart", "onDragStart(event, " + task.id + ")");
    card.setAttribute("ondragend", "onDragEnd(event)");

    var cardHeader = document.createElement("div");
    cardHeader.className = "task-card-header";

    var badge = document.createElement("span");
    badge.className = "badge-priority";
    badge.textContent = task.priority;

    if (task.priority === "High") {
        badge.style.background = "rgba(239,68,68,0.1)";
        badge.style.color = "#f87171";
        badge.style.border = "1px solid rgba(239,68,68,0.2)";
    } else if (task.priority === "Medium") {
        badge.style.background = "rgba(245,158,11,0.1)";
        badge.style.color = "#fbbf24";
        badge.style.border = "1px solid rgba(245,158,11,0.2)";
    } else {
        badge.style.background = "rgba(16,185,129,0.1)";
        badge.style.color = "#34d399";
        badge.style.border = "1px solid rgba(16,185,129,0.2)";
    }

    var actionsDiv = document.createElement("div");
    actionsDiv.className = "task-card-actions";

    var editBtn = document.createElement("button");
    editBtn.className = "btn-action btn-action-edit";
    editBtn.title = "Edit Task";
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editBtn.setAttribute("onclick", "openEditModal(" + task.id + ")");

    var deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-action btn-action-delete";
    deleteBtn.title = "Delete Task";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.setAttribute("onclick", "openDeleteModal(" + task.id + ")");

    var titleEl = document.createElement("h3");
    titleEl.className = "task-card-title";
    titleEl.textContent = task.title;

    var descEl = document.createElement("p");
    descEl.className = "task-card-description";
    descEl.textContent = task.description;

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    cardHeader.appendChild(badge);
    cardHeader.appendChild(actionsDiv);

    card.appendChild(cardHeader);
    card.appendChild(titleEl);
    card.appendChild(descEl);

    return card;
}