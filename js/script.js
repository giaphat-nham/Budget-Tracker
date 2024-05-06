//modal
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll(
  "[data-modal-close-button]"
);
const overlay = document.getElementById("overlay");

//functionalities
const categoriesContainer = document.querySelector("[data-category-list]");
const addCategoryButton = document.querySelector("[data-add-category-button]");
const addCategoryInput = document.querySelector("[data-add-category-input]");
const deleteCategoryButton = document.querySelector(
  "[data-delete-category-button]"
);
const categoryDisplayContainer = document.querySelector(
  "[data-category-display-container]"
);
const categoryTitleElement = document.querySelector("[data-category-title]");
const categoryTotalElement = document.querySelector("[data-category-total]");
const detailContainer = document.querySelector("[data-details]");
const detailTemplate = document.getElementById("detail-template");
const addExpenseButton = document.querySelector("[data-add-expense-button]");
const addExpenseInputName = document.querySelector(
  "[data-add-expense-input-name]"
);
const addExpenseInputAmount = document.querySelector(
  "[data-add-expense-input-amount]"
);

const LOCAL_STORAGE_CATEGORY_KEY = "budget.categories";
const LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY = "budget.selectedCategoryId";

let categories =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_CATEGORY_KEY)) || [];
let selectedCategoryId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY
);

//localStorage.clear();

detailContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("ex-delete")) {
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId
    );
    selectedCategory.details = selectedCategory.details.filter(
      (detail) => detail.id !== e.target.id
    );
    saveAndRender();
  }
});

deleteCategoryButton.addEventListener("click", (e) => {
  categories = categories.filter(
    (category) => category.id !== selectedCategoryId
  );
  selectedCategoryId = null;
  saveAndRender();
});

categoriesContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedCategoryId = e.target.dataset.categoryId;
    saveAndRender();
  }
});

addCategoryButton.addEventListener("click", (e) => {
  const categoryName = addCategoryInput.value;
  if (categoryName == null || categoryName == "") return;
  const category = createCategory(categoryName);
  const modal = document.querySelector("#add-category");
  closeModal(modal);
  categories.push(category);
  saveAndRender();
});

addExpenseButton.addEventListener("click", (e) => {
  const expenseName = addExpenseInputName.value;
  const expenseAmount = addExpenseInputAmount.value;
  if (
    expenseName == null ||
    expenseName == "" ||
    expenseAmount == null ||
    expenseAmount == ""
  )
    return;
  const expense = createExpense(expenseName, expenseAmount);
  const modal = document.querySelector("#add-expense");
  closeModal(modal);
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );
  selectedCategory.details.push(expense);
  saveAndRender();
});

function createExpense(name, amount) {
  return { id: Date.now().toString(), name: name, amount: amount };
}

function createCategory(name) {
  return { id: Date.now().toString(), name: name, details: [] };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_CATEGORY_KEY, JSON.stringify(categories));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY,
    selectedCategoryId
  );
}

function render() {
  clearElement(categoriesContainer);
  renderCategoryList();

  console.log(selectedCategoryId);
  if (selectedCategoryId == null)
    categoryDisplayContainer.style.display = "none";
  else {
    categoryDisplayContainer.style.display = "";
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId
    );
    categoryTitleElement.innerText = selectedCategory.name;
    renderCategoryTotal(selectedCategory);
    clearElement(detailContainer);
    renderDetails(selectedCategory);
  }
}

function renderDetails(selectedCategory) {
  selectedCategory.details.forEach((detail) => {
    const detailElement = document.importNode(detailTemplate.content, true);
    const detailName = detailElement.querySelector("[data-detail-name]");
    const detailAmount = detailElement.querySelector("[data-detail-amount]");
    const detailDeleteButton = detailElement.querySelector("button");
    detailDeleteButton.id = detail.id;
    detailName.append(detail.name);
    detailAmount.append(detail.amount);
    detailContainer.appendChild(detailElement);
  });
}

function renderCategoryTotal(selectedCategory) {
  const details = selectedCategory.details;
  let totalDisplay = 0;
  details.forEach((detail) => {
    totalDisplay += parseInt(detail.amount);
  });

  categoryTotalElement.innerText = `Total: ${totalDisplay}`;
}

function renderCategoryList() {
  if (categories == null) return;
  categories.forEach((category) => {
    const categoryElement = document.createElement("li");
    categoryElement.dataset.categoryId = category.id;
    categoryElement.innerText = category.name;
    if (category.id === selectedCategoryId)
      categoryElement.classList.add("active-category");
    categoriesContainer.appendChild(categoryElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//modal
openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");

  inputs = modal.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = null;
  });
}

render();
