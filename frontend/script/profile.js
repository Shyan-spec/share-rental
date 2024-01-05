let arrayOfImages = [];
const listingsButton = document.getElementById("listing-button");
const openCreateModalButton = document.querySelector("#open-modal");
const closeCreateModalButton = document.querySelector("#close-modal");
const cancelCreateModalButton = document.querySelector("#cancel-modal");
const submitNewListing = document.getElementById("upload-form");
const imageSelectorInput = document.getElementById("file-selector");
const itemView = document.querySelector(".detailed-item-view");
const infoDiv = document.createElement("div");
const editItemButton = document.createElement("button");
const deleteItemButton = document.createElement("button");
const closeItemViewButton = document.querySelector("#close-item-view-modal");
const itemTitle = document.createElement("h1");
const productName = document.createElement("p");
const productDescription = document.createElement("p");
const productPrice = document.createElement("p");
const available = document.createElement("p");
const editInfoDiv = document.querySelector("#info-div");

listingsButton.addEventListener("click", toggleListings);
openCreateModalButton.addEventListener("click", openCreateItemModal);
closeCreateModalButton.addEventListener("click", closeCreateItemModal);
cancelCreateModalButton.addEventListener("click", closeCreateItemModal);
submitNewListing.addEventListener("submit", createListing);
imageSelectorInput.addEventListener("change", selectImages);

function openCreateItemModal() {
  document.getElementById("popup").style.display = "block";
}

function closeCreateItemModal() {
  document.getElementById("popup").style.display = "none";
}

function updateProductNameInModal(newName) {
  productName.textContent = "Product Name: " + newName;
  productDescription = "Product Description " + newName;
  productPrice = "Price " + newName
  available = "Availabilty " = newName
}

function editCurrentItem(data) {
  // Clear previous information
  const editInfoDiv = document.querySelector("#info-div");
  editInfoDiv.innerHTML = "";

  // Create a new form div that will contain the inputs and images
  const formDiv = document.createElement("form");
  formDiv.id = `update-form-${data._id}`;

  // Create input elements
  const nameLabel = document.createElement("p");
  const nameInput = document.createElement("input");
  nameInput.setAttribute("name", "productName");
  nameLabel.textContent = "Product Name:";
  nameInput.value = data.name;

  const descriptionLabel = document.createElement("p");
  const descriptionInput = document.createElement("input");
  descriptionInput.setAttribute("name", "productDescription");
  descriptionLabel.textContent = "Product Description:";
  descriptionInput.value = data.description;

  const priceLabel = document.createElement("p");
  const priceInput = document.createElement("input");
  priceInput.setAttribute("name", "productPrice");
  priceLabel.textContent = "Price:";
  priceInput.value = data.price;

  const availableLabel = document.createElement("p");
  const availableInput = document.createElement("input");
  availableInput.name = "productAvailable";
  availableLabel.textContent = "Availability:";
  availableInput.type = "checkbox";
  availableInput.checked = data.available;

  const fileSelector = document.createElement("input");

  // Set attributes of the input element
  fileSelector.setAttribute("type", "file");
  fileSelector.id = "update-file-selector";
  fileSelector.setAttribute("name", "images");
  fileSelector.setAttribute("multiple", "");
  // Create a new div for images
  const editImagesDiv = document.createElement("div");
  editImagesDiv.id = "edit-images";

  // Populate the new div with images
  data.images.forEach((element) => {
    const image = document.createElement("img");
    image.src = `http://localhost:3000/${element}`;
    image.style.width = "100px";
    image.style.height = "100px";
    image.style.borderRadius = "10px";
    arrayOfImages.push(image);
    editImagesDiv.appendChild(image);
  });

  // Append inputs and images to formDiv
  formDiv.appendChild(nameLabel);
  formDiv.appendChild(nameInput);
  formDiv.appendChild(descriptionLabel);
  formDiv.appendChild(descriptionInput);
  formDiv.appendChild(priceLabel);
  formDiv.appendChild(priceInput);
  formDiv.appendChild(availableLabel);
  formDiv.appendChild(availableInput);
  formDiv.appendChild(fileSelector);
  formDiv.appendChild(editImagesDiv);

  const saveButton = document.createElement("input");
  saveButton.setAttribute("type", "submit");
  saveButton.setAttribute("value", "Save");
  saveButton.textContent = "Save";
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  formDiv.appendChild(saveButton);
  formDiv.appendChild(deleteButton);

  editInfoDiv.appendChild(formDiv);

  // Add event listeners to buttons
  formDiv.addEventListener("submit", savedUpdatedItem);

  deleteButton.addEventListener("click", function () {
    // Implement delete functionality here
  });

  fileSelector.addEventListener("change", selectUpdatedImages);
}

async function savedUpdatedItem(e) {
  e.preventDefault();

  const form = e.target;
  const id = form.id.split("-")[2];
  console.log("Item ID:", id);

  // Create FormData from the form, this includes all input fields
  const newFormData = new FormData(form);


  // Logging for debug purposes
  for (let [key, value] of newFormData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await axios.put(
      `http://localhost:3000/api/items/${id}`,
      { "name": newFormData.get('productName'),
        "description": newFormData.get('productDescription'),
        "price": newFormData.get('productPrice'),
        "available": newFormData.get('productAvailable')},
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data); // Log the response
  } catch (error) {
    console.error("Error submitting form:", error);
  }

  // Clear the array after submission
  arrayOfImages = [];
}


async function selectUpdatedImages(e) {
  const updateContentModal = document.querySelector("#info-div");

  Array.from(e.target.files).forEach((file) => {
    const uploadedImage = document.createElement("img");
    uploadedImage.src = URL.createObjectURL(file); // Create a URL for the file
    uploadedImage.style.width = "100px";
    uploadedImage.style.height = "auto";
    uploadedImage.onload = () => URL.revokeObjectURL(uploadedImage.src); // Release object URL after loading

    updateContentModal.appendChild(uploadedImage);
  });

  arrayOfImages.push(...Array.from(e.target.files));

  console.log(arrayOfImages);
  return arrayOfImages;
}

function deleteCurrentItem() {
  document.getElementById("popup").style.display = "none";
}

async function fetchAnItem(itemId) {
  const response = await axios.get(`http://localhost:3000/api/items/${itemId}`);

  return response.data.item;
}

function openDetailedItemViewModal(id, editMode) {
  fetchAnItem(id)
    .then((data) => {
      populateModalWithData(data);
      document.getElementById("item-view").style.display = "block";
      return data;
    })
    .then((data) => {
      if (editMode) {
        editCurrentItem(data);
      }
    });
}

function populateModalWithData(data) {
  const newEditButton = document.createElement("button");

  itemView.innerHTML = "";

  const infoDiv = document.createElement("div");
  infoDiv.id = "info-div";

  const imageUrl = `http://localhost:3000/${data.images[0]}`;
  const imgEl = document.createElement("img");
  imgEl.id = "item-img";
  imgEl.src = imageUrl;
  imgEl.style.width = "100%";
  imgEl.style.height = "100%";

  itemTitle.textContent = data.name;
  itemTitle.style.fontFamily = "Special Elite";

  itemView.addEventListener("click", function (event) {
    if (event.target.id === "info-div") {
      // Click on infoDiv - ensure it's fully visible
      infoDiv.style.opacity = ".95";
    }
    if (event.target.id === "item-img")
      // Click elsewhere in detailedItemView - dim infoDiv
      infoDiv.style.opacity = "0.1";
  });

  productName.textContent = "Product Name: " + data.name;
  productDescription.textContent = "Description: " + data.description; // Example text
  productPrice.textContent = "Price: $" + data.price; // Example text
  available.textContent = "Available: " + (data.available ? "Yes" : "No"); // Example

  // Append all elements to infoDiv
  infoDiv.appendChild(itemTitle);
  infoDiv.appendChild(productName);
  infoDiv.appendChild(document.createTextNode("Description: "));
  infoDiv.appendChild(productDescription);
  infoDiv.appendChild(document.createTextNode("Price: "));
  infoDiv.appendChild(productPrice);
  infoDiv.appendChild(available);

  itemView.appendChild(imgEl);
  itemView.appendChild(infoDiv);

  newEditButton.textContent = "Edit";
  deleteItemButton.textContent = "Remove";

  infoDiv.appendChild(newEditButton);
  infoDiv.appendChild(deleteItemButton);

  newEditButton.addEventListener("click", () => onEditItemClicked(data));
}

function onEditItemClicked(data) {
  editCurrentItem(data); // Make sure 'data' is accessible in this scope
}

function onDeleteItemClicked() {
  deleteCurrentItem(data); // Make sure 'data' is accessible in this scope
}

function closeDetailedItemViewModal() {
  document.getElementById("item-view").style.display = "none";
}

// Close the popup if the user clicks outside of it
window.onclick = function (event) {
  if (event.target == document.getElementById("popup")) {
    document.getElementById("popup").style.display = "none";
  }

  if (event.target == document.getElementById("item-view")) {
    document.getElementById("item-view").style.display = "none";
    console.log("cleared");
    clearModal();
  }
};

async function createListing(e) {
  e.preventDefault();

  const formData = new FormData(this);
  arrayOfImages.forEach((file) => {
    formData.append(`images`, file);
  });

  const response = await axios
    .post("http://localhost:3000/api/items/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data);
      arrayOfImages = [];
    })
    .catch((error) => console.error("Error:", error));
}

async function selectImages(e) {
  const contentModal = document.querySelector(".popup-content");

  Array.from(e.target.files).forEach((file) => {
    const uploadedImage = document.createElement("img");
    uploadedImage.src = URL.createObjectURL(file); // Create a URL for the file
    uploadedImage.style.width = "100px";
    uploadedImage.style.height = "auto";
    uploadedImage.onload = () => URL.revokeObjectURL(uploadedImage.src); // Release object URL after loading

    contentModal.appendChild(uploadedImage);
  });

  arrayOfImages.push(...Array.from(e.target.files));

  console.log(arrayOfImages);
  return arrayOfImages;
}

async function loadUserListings() {
  let id = 0;
  const response = await axios
    .get("http://localhost:3000/api/items/user/658892c02f2941b502485764")
    .then((response) => {
      const data = response.data.items;
      const cardContainer = document.querySelector(".new-div");

      data.forEach((cardData) => {
        const card = document.createElement("div");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        editButton.textContent = "Edit";
        deleteButton.textContent = "Remove";
        card.className = "card";
        card.id = `card-${cardData._id}`;
        id++;
        const cardImageDiv = document.createElement("div");
        cardImageDiv.className = "card-image";
        const img = document.createElement("img");
        img.src = `http://localhost:3000/${cardData.images[0]}`;
        cardImageDiv.id = `card-${cardData._id}`;
        img.alt = "Item Image";
        cardImageDiv.appendChild(img);

        const cardInfoDiv = document.createElement("div");
        cardInfoDiv.className = "card-info";
        const itemName = document.createElement("h3");
        itemName.textContent = cardData.name;
        const price = document.createElement("p");
        price.textContent = `Price: $${cardData.price}/day`;
        const available = document.createElement("p");
        available.textContent = `Available: ${
          cardData.available ? "Yes" : "No"
        }`;
        available.style.color =
          available.textContent === "Yes" ? "red" : "green";

        cardInfoDiv.appendChild(itemName);
        cardInfoDiv.appendChild(price);
        cardInfoDiv.appendChild(available);
        cardInfoDiv.appendChild(editButton);
        cardInfoDiv.appendChild(deleteButton);

        card.appendChild(cardImageDiv);
        card.appendChild(cardInfoDiv);

        editButton.addEventListener("click", () => {
          openDetailedItemViewModal(cardData._id, true);
        });
        //deleteButton.addEventListener()

        cardContainer.appendChild(card);
      });
    });
  document.querySelectorAll(".card-image").forEach((element) => {
    element.addEventListener("click", function (e) {
      const id = this.id.split("-")[1];
      openDetailedItemViewModal(id);
    });
  });
}

async function loadUserInfo() {
  const response = await axios
    .get("http://localhost:3000/api/users/658892c02f2941b502485764")
    .then((response) => {
      let data = response.data.user[0];
      const container = document.querySelector(".inner-container");
      const profileBio = document.querySelector("#profile-bio");

      if (container && profileBio) {
        const nameHeader = profileBio.querySelector("#profile-name");
        if (nameHeader) nameHeader.innerHTML = data.name;

        const usernameInput = container.querySelector("#username");
        if (usernameInput) usernameInput.value = data.username;

        const phoneInput = container.querySelector("#phone");
        if (phoneInput) phoneInput.value = data.phone;

        const emailInput = container.querySelector("#email");
        if (emailInput) emailInput.value = data.email;

        const locationInput = container.querySelector("#location");
        if (locationInput) locationInput.value = data.location;
      }
    });
}

function clearModal() {
  // Clear modal content
  const modalContentDiv = document.querySelector("#info-div");
  modalContentDiv.innerHTML = "";
  // Remove any event listeners if they are not removed by innerHTML = "" above
  // For example:
  // const editButton = modalContentDiv.querySelector("#edit-button");
  // if (editButton) {
  //   editButton.removeEventListener("click", namedEditFunction);
  // }
}

function toggleListings() {
  const container = document.getElementById("view-listings");
  const isNewDiv = container.querySelector(".new-div");

  if (isNewDiv) {
    container.innerHTML = "";
  } else {
    const newDiv = document.createElement("div");
    const listingTitle = document.createElement("div");
    listingTitle.classList.add("listing-title");
    newDiv.classList.add("new-div");
    listingTitle.textContent = "Listings";
    container.appendChild(listingTitle);
    container.appendChild(newDiv);
    loadUserListings();
  }
}

loadUserInfo();
