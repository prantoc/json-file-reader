document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".category-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", updateKeys);
  });
  document
    .getElementById("category-fields")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("add-category")) {
        addCategoryField();
      } else if (event.target.classList.contains("add-key")) {
        addKeyField(event.target);
      }
    });
});

function updateKeys(event) {
  const category = event.target.value;
  const keyDropdown = event.target
    .closest(".row")
    .querySelector(".key-dropdown");
  keyDropdown.innerHTML =
    '<option value="" disabled selected>Select key</option>';

  if (category) {
    fetch(`/keys?category=${category}`)
      .then((response) => response.json())
      .then((keys) => {
        keys.forEach((key) => {
          const option = document.createElement("option");
          option.value = key;
          option.textContent = key;
          keyDropdown.appendChild(option);
        });
      });
  }
}

function addCategoryField() {
  const categoryFields = document.getElementById("category-fields");
  const index = categoryFields.querySelectorAll(".category-row").length;
  const newField = document.createElement("div");
  newField.classList.add("row", "mb-3", "category-row");
  newField.innerHTML = `
    <div class="col">
      <label for="category-${index}" class="form-label">Category</label>
      <div class="input-group">
        <select class="form-select category-dropdown" name="categories[${index}][category]" id="category-${index}">
          <option value="" disabled selected>Select category</option>
          ${getCategoriesOptions()}
        </select>
        <button class="btn btn-outline-secondary add-category" type="button">+</button>
      </div>
    </div>
    <div class="col">
      <label for="key-${index}" class="form-label">Key</label>
      <div class="input-group">
        <select class="form-select key-dropdown" name="categories[${index}][key]" id="key-${index}">
          <option value="" disabled selected>Select key</option>
        </select>
        <button class="btn btn-outline-secondary add-key" type="button">+</button>
      </div>
    </div>
  `;
  categoryFields.appendChild(newField);

  newField
    .querySelector(".category-dropdown")
    .addEventListener("change", updateKeys);
}

function addKeyField(target) {
  const keyDropdown = target
    .closest(".input-group")
    .querySelector(".key-dropdown");
  const newField = document.createElement("div");
  newField.classList.add("input-group", "mt-2");
  newField.innerHTML = `
    <select class="form-select key-dropdown" name="categories[${index}][key]">
      <option value="" disabled selected>Select key</option>
    </select>
    <button class="btn btn-outline-secondary add-key" type="button">+</button>
  `;
  keyDropdown.closest(".col").appendChild(newField);
}

function getCategoriesOptions() {
  const categories = JSON.parse(
    document.getElementById("categories-data").value
  );
  return categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}
