const listAllAvailableItemsDiv = document.querySelector("#browse-items");

async function listAllAvailableItems() {
  try {
    const response = await axios.get('http://localhost:3000/api/browse');
    let data = response.data.items;

    const filteredData = data.filter(item => item.owner !== "658892c02f2941b502485764");


    filteredData.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "card";
      card.id = `card-${cardData._id}`;

      const cardImageDiv = document.createElement("div");
      cardImageDiv.className = "card-image";
      const img = document.createElement("img");
      img.src = `http://localhost:3000/${cardData.images[0]}`;
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

      card.appendChild(cardImageDiv);
      card.appendChild(cardInfoDiv);

      listAllAvailableItemsDiv.appendChild(card);

      
    });

    populateItemData(filteredData)
  } catch (error) {
    console.error("Error fetching items:", error);
    // Handle error (e.g., show an error message to the user)
  }
}

function populateItemData(data) {
    
        const container = document.getElementById("browse-items-data");
        container.innerHTML = ''; // Clear existing content
    
        const title = document.createElement("h2");
        title.textContent = data[0].name;
        title.className = "item-title";
    
        const description = document.createElement("p");
        description.textContent = data[0].description;
        description.className = "item-description";
    
        const price = document.createElement("p");
        price.textContent = `Price: $${data[0].price}/day`;
        price.className = "item-price";
    
        const imageContainer = document.createElement("div");
        imageContainer.className = "item-image-container";
        // data[0].images.forEach(src => {
        //     const img = document.createElement("img");
        //     img.src = `http://localhost:3000/${src}`;
        //     img.alt = "Item Image";
        //     imageContainer.appendChild(img);
        // });
    
        container.appendChild(title);
        container.appendChild(description);
        container.appendChild(price);
        //container.appendChild(imageContainer);
    }


listAllAvailableItems();
