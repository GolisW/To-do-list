const ITEM_CONTAINER = document.getElementById("items");
const ITEM_TEMPLATE = document.getElementById("itemTemplate");
const ADD_BUTTON = document.getElementById("add");
const DELETE_BUTTON = document.getElementById("delete");

// Dodawanie itemów
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

function refreshList() {
  // Filtrowanie
  let filteredItems = items.filter((item) => {
    if (filter === "completed") {
      return item.completed;
    } else if (filter === "not-completed") {
      return !item.completed;
    } else {
      return true;
    }
  });

  // Sortowanie alfabetyczne
  filteredItems.sort((a, b) => {
    if (a.completed) {
      return 1;
    }
    if (b.completed) {
      return -1;
    }
    return a.description.localeCompare(b.description);
  });

  ITEM_CONTAINER.innerHTML = "";

  for (const item of filteredItems) {
    const itemElement = ITEM_TEMPLATE.content.cloneNode(true);
    const descriptionInput = itemElement.querySelector(".item-description");
    const completedInput = itemElement.querySelector(".item-completed");
    const deleteButton = itemElement.querySelector(".delete-item");

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

    ITEM_CONTAINER.append(itemElement);
  }
}

// Przycisk sortowania
const SORT_OPTIONS = document.querySelectorAll(".sort-option");

SORT_OPTIONS.forEach((option) => {
  option.addEventListener("click", (event) => {
    const sortType = event.target.getAttribute("data-sort");
    filter = sortType;
    refreshList();
  });
});

// Przycisk dodawania
ADD_BUTTON.addEventListener("click", () => {
  addItem();
});

// Przycisk usuwania wszystkiego
DELETE_BUTTON.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all items?")) {
    localStorage.clear();
    items = [];
    refreshList();
  }
});

refreshList();

//Logowanie
//Popup login
const popup = document.getElementById("login");
const button = document.getElementById("openlogin");
const blurr = document.getElementById("fog");

button.addEventListener("click", () => {
  popup.style.display = "flex";
  blurr.style.display = "block";
});

const button_exit1 = document.getElementById("button-exit-login");

button_exit1.addEventListener("click", () => {
  popup.style.display = "none";
  blurr.style.display = "none";
});

//Popup signin
const popup2 = document.getElementById("signin");
const button2 = document.getElementById("go-to-signin");

button2.addEventListener("click", () => {
  popup.style.display = "none";
  popup2.style.display = "flex";
});

const button_exit2 = document.getElementById("button-exit-signin");

button_exit2.addEventListener("click", () => {
  popup2.style.display = "none";
  blurr.style.display = "none";
});

//Popup login from sigin
const button3 = document.getElementById("go-to-login");

button3.addEventListener("click", () => {
  popup2.style.display = "none";
  popup.style.display = "flex";
});

//Fog popup end ;-;
blurr.addEventListener("click", () => {
  popup.style.display = "none";
  popup2.style.display = "none";
  blurr.style.display = "none";
});
