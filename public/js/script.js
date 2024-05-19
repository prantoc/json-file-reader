document.addEventListener("DOMContentLoaded", () => {
  const categoryDropdown = document.getElementById("category");
  categoryDropdown.addEventListener("change", updateKeys);
});

function updateKeys() {
  const category = document.getElementById("category").value;
  const keyDropdown = document.getElementById("key");
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
