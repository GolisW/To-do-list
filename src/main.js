// ____________________WORKSHOP OPTIONS____________________

// ADD ITEM
let items = getItems();
let filter = "all";

function getItems() {
  const value = localStorage.getItem("todo") || "[]";

  return JSON.parse(value);
}

function setItems(items) {
  const itemsJson = JSON.stringify(items);

  localStorage.setItem("todo", itemsJson);
}

function addItem() {
  items.unshift({
    description: "",
    completed: false,
  });

  setItems(items);
  refreshList();
}

function updateItem(item, key, value) {
  item[key] = value;

  setItems(items);
  refreshList();
}

// FILTERING ITEMS
function refreshList() {
  let filteredItems = items.filter((item) => {
    if (filter === "completed") {
      return item.completed;
    } else if (filter === "notCompleted") {
      return !item.completed;
    } else {
      return true;
    }
  });

  // ALPHABETICAL SORTING ITEMS
  filteredItems.sort((a, b) => {
    if (a.completed) {
      return 1;
    }
    if (b.completed) {
      return -1;
    }
    return a.description.localeCompare(b.description);
  });

  // ITEM OPTIONS
  const itemContainer = document.getElementById("items");
  const itemTemplate = document.getElementById("itemTemplate");

  itemContainer.innerHTML = "";

  for (const item of filteredItems) {
    const itemElement = itemTemplate.content.cloneNode(true);
    const descriptionInput = itemElement.querySelector(".itemDescription");
    const completedInput = itemElement.querySelector(".itemCompleted");
    const deleteButton = itemElement.querySelector(".deleteItem");

    descriptionInput.value = item.description;
    completedInput.checked = item.completed;

    descriptionInput.addEventListener("change", () => {
      updateItem(item, "description", descriptionInput.value);
    });

    completedInput.addEventListener("change", () => {
      updateItem(item, "completed", completedInput.checked);
    });

    deleteButton.addEventListener("click", () => {
      items = items.filter((i) => i !== item);
      setItems(items);
      refreshList();
    });

    itemContainer.append(itemElement);
  }
}

// SORT BUTTON
const SORT_OPTIONS = document.querySelectorAll(".sortOption");

SORT_OPTIONS.forEach((option) => {
  option.addEventListener("click", (event) => {
    const sortType = event.target.getAttribute("data-sort");
    filter = sortType;
    refreshList();
  });
});

// ADD BUTTON
const addButton = document.getElementById("add");

addButton.addEventListener("click", () => {
  addItem();
});

// DELETE ALL BUTTON
const deleteButton = document.getElementById("delete");

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all items?")) {
    localStorage.clear();
    items = [];
    refreshList();
  }
});

refreshList();

// ____________________OPEN/CLOSE POPUP____________________

const blurr = document.getElementById("fog");

// CLOSE ALL POPUPS
function closeAllPopups() {
  const popups = document.querySelectorAll(
    ".login, .signin, .deleteUserPopUp, .changeUsernamePopUp"
  );

  popups.forEach((popup) => {
    popup.style.display = "none";
  });

  blurr.style.display = "none";
}

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

// EXIT POPUP FOG
function closePopupFog() {
  closeAllPopups();
}

if (blurr) {
  blurr.addEventListener("click", closePopupFog);
}

// ____________________USER OPTIONS____________________

// ADD NEW USER - SIGNIN
let registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let username = document.getElementById("username");
  let email = document.getElementById("emailSignin");
  let password = document.getElementById("passwordSignin");

  const url = "http://localhost:5000/users/createUser";

  try {
    const data = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Response status: ${response.status} - ${errorText}`);
    }

    // Receive user data and set up the interface
    const json = await response.json();
    console.log(json);

    // Page change
    document.getElementById("userProfile").style.display = "flex";
    document.getElementById("userProfileButton").style.display = "flex";

    document.getElementById("unlogged").style.display = "none";

    // Username from cookies
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find((cookie) => cookie.startsWith("username="));
    const usernameFromCookie = userCookie
      ? userCookie.split("=")[1]
      : "Unknown User";

    document.getElementById("h3username").innerText = usernameFromCookie;
  } catch (error) {
    console.error("Error during registration: ", error.message);
  }
  closeAllPopups();
});

// LOGIN
// let loginForm = document.getElementById("loginForm");
// loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   let email = document.getElementById("email");
//   let password = document.getElementById("password");

//   const url = "http://localhost:5000/users/login";

//   try {
//     const data = {
//       email: email.value,
//       password: password.value,
//     };

//     const response = await fetch(url, {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const json = response.json();
//     console.log(json);

//     redirectToUserPage(json.id);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// function redirectToUserPage(id) {
//   window.location.href = `/users/${id}`;
// }

// CHANGE USERNAME
// let submitUsernameChange = document.getElementById("submitUsernameChange");
// submitUsernameChange.addEventListener("click", async (e) => {
//   e.preventDefault();

//   let newUsername = document.getElementById("changeUsernameInput").value;
//   // let userId = /* Pobierz ID użytkownika

//   try {
//     const response = await fetch(`/users/${userId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username: newUsername }),
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

// DELETE USER
// let deleteUserSubmit = document.getElementById("deleteUserSubmit");

// deleteUserSubmit.addEventListener("click", async () => {
//   // let userId = /* Pobierz ID użytkownika */;

//   try {
//     const response = await fetch(`/users/${userId}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error(error.message);
//   }
// });
