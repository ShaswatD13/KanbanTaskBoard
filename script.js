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