let arrayOfImages = []
const listingsButton = document.getElementById("listing-button");
const openCreateModalButton = document.querySelector("#open-modal");
const closeCreateModalButton = document.querySelector("#close-modal");
const cancelCreateModalButton = document.querySelector("#cancel-modal");
const submitNewListing = document.getElementById("upload-form");
const imageSelectorInput = document.getElementById("file-selector")

listingsButton.addEventListener("click", toggleListings);
openCreateModalButton.addEventListener("click", openModel);
closeCreateModalButton.addEventListener("click", closeModal);
cancelCreateModalButton.addEventListener("click", closeModal);
submitNewListing.addEventListener("submit", createListing);
imageSelectorInput.addEventListener("change", selectImages)

function openModel() {
  document.getElementById("popup").style.display = "block";
}

function closeModal() {
  document.getElementById("popup").style.display = "none";
}

// Close the popup if the user clicks outside of it
window.onclick = function (event) {
  if (event.target == document.getElementById("popup")) {
    document.getElementById("popup").style.display = "none";
  }
};

async function createListing(e) {
  e.preventDefault();

  const formData = new FormData(this);
  arrayOfImages.forEach((file) => {
    formData.append(`images`,file)
  })

  const response = await axios
    .post("http://localhost:3000/api/items/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => { 
        console.log(response.data)
        arrayOfImages = []
    })
    .catch((error) => console.error("Error:", error));
}



async function selectImages(e) {
    

    arrayOfImages.push(...Array.from(e.target.files))

    console.log(arrayOfImages)
    return arrayOfImages

}

async function loadUserListings() {
  const response = await axios
    .get("http://localhost:3000/api/items/user/658892c02f2941b502485764")
    .then((response) => {
      const data = response.data.items;
      const cardContainer = document.querySelector(".new-div");

      data.forEach((cardData) => {
        const card = document.createElement("div");
        card.className = "card";

        const cardImageDiv = document.createElement("div");
        cardImageDiv.className = "card-image";
        const img = document.createElement("img");
        img.src = `http://localhost:3000/${cardData.images[0]}`;
        console.log(img.src)
        img.alt = "Item Image";
        cardImageDiv.appendChild(img);

        const cardInfoDiv = document.createElement("div");
        cardInfoDiv.className = "card-info";
        const itemName = document.createElement("h3");
        itemName.textContent = cardData.itemName;
        const price = document.createElement("p");
        price.textContent = `Price: $${cardData.price}/day`;
        const available = document.createElement("p");
        available.textContent = `Available: ${
          cardData.available ? "Yes" : "No"
        }`;

        cardInfoDiv.appendChild(itemName);
        cardInfoDiv.appendChild(price);
        cardInfoDiv.appendChild(available);

        card.appendChild(cardImageDiv);
        card.appendChild(cardInfoDiv);

        cardContainer.appendChild(card);
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
      console.log("open listings");
    }
  }

loadUserInfo();
