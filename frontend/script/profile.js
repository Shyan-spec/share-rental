let currentImageIndex = 0; //Keep track of current image index
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
const imageViewer = document.querySelector(".image-viewer");
let formDiv;
const selectedImagesDiv = document.querySelector('#selected-images');
const imgEl = document.createElement("img");
  imgEl.id = "item-img";

listingsButton.addEventListener("click", () => {
  toggleListings()
  scrollToElement("view-listings")
});
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

function editCurrentItem(data) {
  // Clear previous information
  const editInfoDiv = document.querySelector("#info-div");
  editInfoDiv.innerHTML = "";

  // Style for the form
  editInfoDiv.style.display = "flex";
  editInfoDiv.style.flexDirection = "column";
  editInfoDiv.style.justifyContent = "center";
  editInfoDiv.style.alignItems = "center";
  editInfoDiv.style.padding = "20px";

  // Style new form div that will contain the inputs and images
  formDiv = document.createElement("form");
  formDiv.id = `update-form-${data._id}`;
  formDiv.style.width = "100%";

  // Create and append form fields
  createFormField("Product Name:", "productName", data.name);
  createFormField(
    "Product Description:",
    "productDescription",
    data.description
  );
  createFormField("Price:", "productPrice", data.price);
  createFormField("Availability:", "productAvailable", data.available, true);

  // Style and append buttons
  const saveButton = document.createElement("input");
  saveButton.setAttribute("type", "submit");
  saveButton.setAttribute("value", "Save");
  saveButton.style.padding = "10px";
  saveButton.style.margin = "10px 0";
  saveButton.style.width = "100%";
  saveButton.style.borderRadius = "5px";
  saveButton.style.cursor = "pointer";

  const cancelButton = document.createElement("button");
  cancelButton.id = "cancel-button";
  cancelButton.style.padding = "10px";
  cancelButton.style.margin = "10px 0";
  cancelButton.textContent = "Cancel";
  cancelButton.style.width = "100%";
  cancelButton.style.borderRadius = "5px";
  cancelButton.style.cursor = "pointer";

  formDiv.appendChild(saveButton);
  formDiv.appendChild(cancelButton);

  editInfoDiv.appendChild(formDiv);

  data.images.forEach((file) => {
    arrayOfImages.push(file);
  });

  // Add event listeners to buttons
  formDiv.addEventListener("submit", savedUpdatedItem);

  cancelButton.addEventListener("click", () => {
    populateModalWithData(data);
  });
}

function createFormField(labelText, inputName, inputValue, isCheckbox = false) {
  const label = document.createElement("p");
  label.textContent = labelText;
  label.style.margin = "10px 0";

  const input = document.createElement("input");
  input.setAttribute("name", inputName);
  input.value = inputValue;
  input.style.width = "95%";
  input.style.padding = "8px";
  input.style.margin = "5px 0";
  if (isCheckbox) {
    input.type = "checkbox";
    input.checked = inputValue;
  }

  formDiv.appendChild(label);
  formDiv.appendChild(input);
}

async function savedUpdatedItem(e) {
  const form = e.target;
  const id = form.id.split("-")[2];
  console.log("Item ID:", id);

  try {
    const updatedItemData = {
      name: form.querySelector('[name="productName"]').value,
      description: form.querySelector('[name="productDescription"]').value,
      price: form.querySelector('[name="productPrice"]').value,
      available: form.querySelector('[name="productAvailable"]').checked,
      images: arrayOfImages, // Include existing images
    };

    console.log(updatedItemData.images);

    const response = await axios.put(
      `http://localhost:3000/api/items/${id}`,
      updatedItemData
    );
    console.log(response.data); // Log the response
    arrayOfImages = [];
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

async function deleteCurrentItem(data) {
  const id = data._id;
  const response = await axios.delete(`http://localhost:3000/api/items/${id}`);

  
  location.reload()
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
  imageViewer.innerHTML = "";

  let itemData = data;
  const newEditButton = document.createElement("button");
  const changeImageLeft = document.createElement("button");
  const changeImageRight = document.createElement("button");
  changeImageLeft.id = "left-button";
  changeImageRight.id = "right-button";
  changeImageLeft.textContent = "←";
  changeImageRight.textContent = "→";

  itemView.innerHTML = "";

  const infoDiv = document.createElement("div");
  infoDiv.id = "info-div";

  const imageUrl = `http://localhost:3000/${data.images[0]}`;
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
  infoDiv.appendChild(productDescription);
  infoDiv.appendChild(productPrice);
  infoDiv.appendChild(available);

  imageViewer.appendChild(changeImageLeft);
  imageViewer.appendChild(imgEl);
  imageViewer.appendChild(changeImageRight);

  itemView.appendChild(imageViewer);
  itemView.appendChild(infoDiv);

  newEditButton.textContent = "Edit";
  newEditButton.id = "edit-button";
  deleteItemButton.textContent = "Remove";
  deleteItemButton.id = "delete-button";

  infoDiv.appendChild(newEditButton);
  infoDiv.appendChild(deleteItemButton);

  changeImageLeft.addEventListener("click", () => changePhotoLeft(data.images))
  changeImageRight.addEventListener("click", () => changePhotoRight(data.images))

  newEditButton.addEventListener("click", () => onEditItemClicked(data));

  deleteItemButton.addEventListener("click", () => deleteCurrentItem(itemData));

  if(!data.available) {
    infoDiv.removeChild(deleteItemButton)
  }

  if(data.images.length === 1) {
    imageViewer.removeChild(changeImageLeft);
    imageViewer.removeChild(changeImageRight);
  }
}

function onEditItemClicked(data) {
  editCurrentItem(data); // Make sure 'data' is accessible in this scope
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
    console.log("cleared Item");
    clearModal();
  }

  if (event.target == document.querySelector(".image-viewer")) {
    document.querySelector(".image-viewer").style.display = "none";
    console.log("cleared Images");
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
      location.reload()
    })
    .catch((error) => console.error("Error:", error));
}

async function selectImages(e) {

  Array.from(e.target.files).forEach((file) => {
    const uploadedImage = document.createElement("img");
    uploadedImage.src = URL.createObjectURL(file); // Create a URL for the file
    uploadedImage.style.width = "100px";
    uploadedImage.style.height = "auto";
    uploadedImage.onload = () => URL.revokeObjectURL(uploadedImage.src); // Release object URL after loading

    //contentModal.appendChild(uploadedImage);
    selectedImagesDiv.appendChild(uploadedImage)
  });

  arrayOfImages.push(...Array.from(e.target.files));

  console.log(arrayOfImages);
  return arrayOfImages;
}

async function loadUserListings() {
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
        editButton.id = "edit-button";
        deleteButton.textContent = "Remove";
        deleteButton.id = "delete-button";
        card.className = "card";
        card.id = `card-${cardData._id}`;
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
        available.textContent = "Available: ";

        const availabilityStatus = document.createElement("span");
        availabilityStatus.textContent = cardData.available ? "Yes" : "No";
        availabilityStatus.style.color = cardData.available ? "green" : "red";

        available.appendChild(availabilityStatus);
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
        
        deleteButton.addEventListener("click", () => {deleteCurrentItem(cardData)})

        cardContainer.appendChild(card);
        
        if(!cardData.available) {
          cardInfoDiv.removeChild(deleteButton)
        }
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

  const modalImageDiv = document.querySelector(".image-viewer");
  modalImageDiv.innerHTML = "";

  arrayOfImages = [];
}

function changePhotoLeft(dataImages) {
  if (currentImageIndex > 0) {
    currentImageIndex--; 
  } else {
    currentImageIndex = dataImages.length - 1; // Loop back to the last image if at the beginning
  }
  updateImageSrc(dataImages[currentImageIndex]);
}

function changePhotoRight(dataImages) {
  if (currentImageIndex < dataImages.length - 1) {
    currentImageIndex++;
  } else {
    currentImageIndex = 0; // Loop back to the first image if at the end
  }
  updateImageSrc(dataImages[currentImageIndex]);
}

function updateImageSrc(newSrc) {
  const imageElement = document.getElementById("item-img"); 
  imageElement.src = `http://localhost:3000/${newSrc}`;
  console.log(newSrc); // Log the new source URL
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

function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

loadUserInfo();
