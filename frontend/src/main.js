// ____________________FUNCTIONS____________________

function toggleDisplay(elementID, display) {
  document.getElementById(elementID).style.display = display;
}

function clearUserData() {
  toggleDisplay("userProfile", "none");
  toggleDisplay("userProfileButton", "none");
  toggleDisplay("unlogged", "flex");

  function clearCookies(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  clearCookies("token");
  clearCookies("username");
  localStorage.clear();
  window.location.reload();
}

function getAuthData() {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const token = cookies["token"];
  if (!token) return null;

  try {
    const { userID } = JSON.parse(atob(token.split(".")[1]));
    return { userID, token };
  } catch (error) {
    handleError(error);
  }
}

function getCookies() {
  return document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function validateForm(fields) {
  for (const field of fields) {
    if (!field.value) {
      console.error(`${field.name} cannot be empty`);
      return false;
    }
  }
  return true;
}

function handleError(error) {
  console.error(error.message);
  alert("An error occurred: " + error.message);
}

// ____________________OPEN/CLOSE POPUP____________________

const blurr = document.getElementById("fog");

// OPEN POPUP
function openPopup(event) {
  const button = event.target.closest(".openPopup");

  if (button) {
    closeAllPopups();
    const popupId = button.getAttribute("data-open");
    const popup = document.getElementById(popupId);

    if (popup) {
      popup.style.display = "flex";
      blurr.style.display = "flex";
    }
  }
}

document.querySelectorAll(".openPopup").forEach((button) => {
  button.addEventListener("click", openPopup);
});

// CLOSE ALL POPUPS
function closeAllPopups() {
  const popups = document.querySelectorAll(
    ".login, .signin, .deleteUserPopUp, .changeUsernamePopUp, .addTaskPopUp"
  );

  popups.forEach((popup) => {
    popup.style.display = "none";
  });

  blurr.style.display = "none";
}

// EXIT POPUP
function closePopup(event) {
  const button = event.target.closest(".exit");

  if (button) {
    closeAllPopups();
  }
}

document.querySelectorAll(".exit").forEach((button) => {
  button.addEventListener("click", closePopup);
});

function closePopupFog() {
  closeAllPopups();
}

if (blurr) {
  blurr.addEventListener("click", closePopupFog);
}

// ____________________TO DO LIST____________________
let items = [];

// FETCH TASKS
async function fetchTasks(userID, token) {
  try {
    const response = await fetch(
      `http://localhost:5000/users/${userID}/getTasks`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const tasks = await response.json();

    localStorage.setItem("tasks", JSON.stringify(tasks));
    items = tasks;

    tasks.forEach(displayTask);
  } catch (error) {
    handleError(error);
  }
}

function setItems(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
const saveButton = document.getElementById("submitNewTask");
const newTaskInput = document.getElementById("newTaskInput");

saveButton.addEventListener("click", saveTask);
newTaskInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    await saveTask();
  }
});

async function saveTask() {
  const input = newTaskInput.value.trim();
  if (input === "") {
    closeAllPopups();
  } else {
    await addTask(input);
  }
}

async function addTask(description) {
  const authData = getAuthData();

  if (!authData) {
    console.error("Authentication data not found");
    return;
  }

  const { userID, token } = authData;

  try {
    const response = await fetch(`http://localhost:5000/users/${userID}/add`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        userID: userID,
        description: description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    let task = null;
    const responseText = await response.text();
    if (responseText) {
      task = JSON.parse(responseText);
    } else {
      console.warn("Received empty response from server.");
    }

    if (task) {
      addTaskToLocalStorage(task);
      displayTask(task);
    }

    document.getElementById("newTaskInput").value = "";
    closeAllPopups();
  } catch (error) {
    handleError(error);
  }
}

// LIST DISPLAY
function displayTask(task) {
  const taskList = document.getElementById("items");

  if (!taskList) {
    console.error("Item ID 'items' not found.");
    return;
  }

  const template = document.getElementById("itemTemplate");

  if (!template) {
    console.error("No template with ID 'itemTemplate' found.");
    return;
  }

  const listItem = template.content.cloneNode(true);
  const itemDescription = listItem.querySelector(".itemDescription");
  const checkbox = listItem.querySelector(".itemCompleted");

  itemDescription.value = task.description;
  checkbox.checked = !!task.completed;

  checkbox.addEventListener("change", () => {
    const isCompleted = checkbox.checked ? 1 : 0;
    updateTaskStatus(task.id, isCompleted);
  });

  function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedUpdateTaskDescription = debounce(updateTaskDescription, 500);

  itemDescription.addEventListener("change", () => {
    const newDescription = itemDescription.value.trim();
    if (newDescription) {
      debouncedUpdateTaskDescription(task.id, newDescription);
    }
  });

  listItem
    .querySelector(".deleteItem")
    .addEventListener("click", () => deleteTask(task.id));

  // adding id to task
  const itemElement = listItem.querySelector(".item");
  itemElement.setAttribute("data-id", task.id);

  taskList.appendChild(listItem);
}

// ADDING A TASK TO A LOCALSTORAGE
function addTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || []);
  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// UPDATE TASK STATUS
async function updateTaskStatus(taskId, isCompleted) {
  const authData = getAuthData();

  if (!authData) {
    console.error("Authentication data not found");
    return;
  }

  const { userID, token } = authData;

  // local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      task.completed = isCompleted;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  try {
    const response = await fetch(
      `http://localhost:5000/users/${userID}/${taskId}/updateStatus`,
      {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ completed: isCompleted }),
      }
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    handleError(error);
  }
}

// UPDATE TASK DESCRIPTION
function updateTaskDescription(taskId, newDescription) {
  const authData = getAuthData();

  if (!authData) {
    console.error("Authentication data not found");
    return;
  }

  const { userID, token } = authData;

  // local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, description: newDescription };
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  fetch(`http://localhost:5000/users/${userID}/${taskId}/updateDescription`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ description: newDescription }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Update error: ${response.status}`);
      }
      return response.json();
    })
    .then((updatedTask) => {
      console.log("Task updated:", updatedTask);
    })
    .catch((error) => {
      console.error("Error while updating a task:", error);
      alert("An error occurred while updating the task.");
    });
}

// DELETE TASK
async function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  const authData = getAuthData();

  if (!authData) {
    console.error("Authentication data not found");
    return;
  }

  const { userID, token } = authData;

  try {
    const response = await fetch(
      `http://localhost:5000/users/${userID}/${taskId}/delete`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    // Aktualizacja widoku
    const taskElement = document.querySelector(`.item[data-id="${taskId}"]`);
    if (taskElement) {
      taskElement.remove();
    }
  } catch (error) {
    handleError(error);
  }
}

// DELETE ALL BUTTON
const deleteButton = document.getElementById("delete");

deleteButton.addEventListener("click", async () => {
  if (confirm("Are you sure you want to delete all items?")) {
    const authData = getAuthData();

    if (!authData) {
      console.error("Authentication data not found");
      return;
    }

    const { userID, token } = authData;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${userID}/deleteAll`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.text();
      console.log(data);
    } catch (error) {
      handleError(error);
    }

    localStorage.clear();
    items = [];
    window.location.reload();
  }
});

// SORT BUTTON
const sortOptions = document.querySelectorAll(".sortOption");

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function displayFilteredTasks(tasks) {
  const taskList = document.getElementById("items");
  taskList.innerHTML = "";

  const fragment = document.createDocumentFragment();
  tasks.forEach((task) => fragment.appendChild(createTaskElement(task)));
  taskList.appendChild(fragment);
}

function sortTasks(filter) {
  const tasks = getTasksFromLocalStorage();

  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed === 1);
  } else if (filter === "notCompleted") {
    filteredTasks = tasks.filter((task) => task.completed === 0);
  }

  displayFilteredTasks(filteredTasks);
}

sortOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const filter = option.getAttribute("data-sort");
    sortTasks(filter);
  });
});

// ____________________USER OPTIONS____________________

// ADD NEW USER
let registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let username = document.getElementById("username");
  let email = document.getElementById("emailSignin");
  let password = document.getElementById("passwordSignin");

  if (!validateForm([username, email, password])) return;

  try {
    const data = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    const response = await fetch("http://localhost:5000/users/createUser", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Response status: ${response.status} - ${errorText}`);
    }

    toggleDisplay("userProfile", "flex");
    toggleDisplay("userProfileButton", "flex");
    toggleDisplay("unlogged", "none");

    const cookies = getCookies();
    const usernameFromCookie = cookies["username"] || "Unknown User";
    document.getElementById("h3username").innerText =
      "Hi " + usernameFromCookie + "!";
  } catch (error) {
    handleError(error);
  }
  closeAllPopups();
});

// LOGIN
let loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let email = document.getElementById("email");
  let password = document.getElementById("password");

  if (!validateForm([email, password])) return;

  try {
    const data = {
      email: email.value,
      password: password.value,
    };

    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Response status: ${response.status} - ${errorText}`);
    }

    toggleDisplay("userProfile", "flex");
    toggleDisplay("userProfileButton", "flex");
    toggleDisplay("unlogged", "none");

    const cookies = getCookies();
    const usernameFromCookie = cookies["username"] || "Unknown User";
    document.getElementById("h3username").innerText =
      "Hi " + usernameFromCookie + "!";

    const token = cookies["token"];

    // UserID from token
    const arrayToken = token.split(".");

    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    if (!tokenPayload.userID) {
      console.error("No user ID found");
      return;
    }

    // Tasks from database
    await fetchTasks(tokenPayload.userID, token);
  } catch (error) {
    handleError(error);
  }
  closeAllPopups();
});

// DELETE USER
let deleteUserSubmit = document.getElementById("deleteUserSubmit");

deleteUserSubmit.addEventListener("click", async () => {
  const authData = getAuthData();

  if (!authData) {
    console.error("Authentication data not found");
    return;
  }

  const { userID, token } = authData;

  try {
    const response = await fetch(`http://localhost:5000/users/${userID}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.text();
    console.log(data);
  } catch (error) {
    handleError(error);
  }
  closeAllPopups();
  clearUserData();
});

// CHANGE USERNAME
let submitUsernameChange = document.getElementById("submitUsernameChange");

submitUsernameChange.addEventListener("click", async (e) => {
  e.preventDefault();

  let newUsername = document.getElementById("changeUsernameInput").value;

  const authData = getAuthData();

  if (!authData) {
    console.error("Authentication data not found");
    return;
  }

  const { userID, token } = authData;

  try {
    const response = await fetch(`http://localhost:5000/users/${userID}`, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ username: newUsername }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.text();
    console.log(data);

    document.getElementById("h3username").innerText = "Hi " + newUsername + "!";
  } catch (error) {
    handleError(error);
  }
  closeAllPopups();
});

// LOG OUT
let logoutButton = document.getElementById("logoutUser");

logoutButton.addEventListener("click", async (e) => {
  e.preventDefault();

  clearUserData();
});
