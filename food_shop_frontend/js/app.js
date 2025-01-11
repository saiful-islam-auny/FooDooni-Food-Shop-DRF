document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://127.0.0.1:8000/api/menu";
  const menuTabs = document.getElementById("menu-tabs");
  const menuTabContent = document.getElementById("menu-tabContent");

  // Fetch categories
  fetch(`${API_BASE_URL}/categories/`)
    .then((response) => response.json())
    .then((categories) => {
      // console.log("Categories fetched:", categories);

      // Create a mapping from category name to ID
      const categoryMap = {};
      categories.forEach((category, index) => {
        categoryMap[category.name.trim()] = category.id; // Trim to avoid mismatches

        // Render category tabs
        const isActive = index === 0 ? "active" : "";
        menuTabs.innerHTML += `
                    <a class="nav-link ${isActive}" id="tab-${category.id
          }" data-toggle="pill" 
                        href="#menu-${category.id}" role="tab" 
                        aria-controls="menu-${category.id}" 
                        aria-selected="${index === 0}">
                        ${category.name}
                    </a>
                `;

        // Add empty content containers for each category
        menuTabContent.innerHTML += `
                    <div class="tab-pane fade ${isActive ? "show active" : ""}" 
                        id="menu-${category.id}" 
                        role="tabpanel" 
                        aria-labelledby="tab-${category.id}">
                        <div class="row" id="menu-items-${category.id}">
                            <!-- Menu items for ${category.name
          } will be loaded here -->
                        </div>
                    </div>
                `;
      });

      // Fetch food items
      fetch(`${API_BASE_URL}/food-items/`)
        .then((response) => response.json())
        .then((foodItems) => {
          // console.log("Food items fetched:", foodItems);

          // Append food items to their respective category containers
          foodItems.forEach((item) => {
            const categoryId = categoryMap[item.category.trim()]; // Match trimmed category name
            if (categoryId) {
              const categoryContainer = document.getElementById(
                `menu-items-${categoryId}`
              );
              if (categoryContainer) {
                categoryContainer.innerHTML += `
                                    <div class="col-md-4 text-center">
                                        <div class="menu-wrap">
                                            <a href="#" class="menu-img img mb-4" style="background-image: url(${item.image
                  });"></a>
                                            <div class="text">
                                                <h3><a href="#">${item.name
                  }</a></h3>
                                                <p>${item.description
                    .split(" ")
                    .slice(0, 10)
                    .join(" ")}...</p>
                                                <p class="price"><span>$${item.price
                  }</span></p>
                                                <p><a href="#" class="btn btn-white btn-outline-white">Add to cart</a></p>
                                            </div>
                                        </div>
                                    </div>
                                `;
              } else {
                console.error(
                  `No container found for category ID: ${categoryId}`
                );
              }
            } else {
              console.error(
                `No matching category ID for item: ${item.name}, category: ${item.category}`
              );
            }
          });
        })
        .catch((error) => console.error("Error fetching food items:", error));
    })
    .catch((error) => console.error("Error fetching categories:", error));
});


// discount item js start
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://127.0.0.1:8000/api/menu";

  // Fetch discounted items
  fetch(`${API_BASE_URL}/specials/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((discountItems) => {
      console.log("Fetched Discount Items:", discountItems);

      const discountContainer = document.getElementById("discount-items");

      if (!discountContainer) {
        console.error("Discount container not found");
        return;
      }

      discountContainer.innerHTML = ""; // Clear previous content

      if (discountItems.length === 0) {
        discountContainer.innerHTML = `<p class="text-center">No discount items available at the moment.</p>`;
        return;
      }

      // Loop through items and create card elements
      discountItems.forEach((item) => {
        const imageUrl = item.image
          ? item.image.startsWith("http")
            ? item.image
            : `http://127.0.0.1:8000${item.image}`
          : "https://via.placeholder.com/300"; // Fallback image

        const originalPrice = parseFloat(item.price || "0").toFixed(2);
        const discountedPrice = parseFloat(
          item.discounted_price || "0"
        ).toFixed(2);

        const discountPercentage = Math.round(
          ((originalPrice - discountedPrice) / originalPrice) * 100
        );

        const itemHTML = `
            <div class="col-md-4 mb-5">
              <div class="card h-100">
                <div class="position-relative">
                  <img src="${imageUrl}" class="card-img-top" alt="${item.name}">
                  <div class="discount-badge">-${discountPercentage}%</div>
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${item.name}</h5>
                  <p class="card-text">${item.description
                    .split(" ")
                    .slice(0, 10)
                    .join(" ")}...</p>
                  <div class="mt-auto">
                    <p class="price mb-3">
                      <span style="text-decoration: line-through; color: white;">$${originalPrice}</span>
                      <span style="color: #7FFF00; font-weight: bold;"> $${discountedPrice}</span>
                    </p>
                    <a href="#" class="btn btn-white btn-outline-white">Order Now</a>
                  </div>
                </div>
              </div>
            </div>
          `;

        // Append card to the container
        discountContainer.innerHTML += itemHTML;
      });
    })
    .catch((error) => {
      console.error("Error fetching discounted items:", error);
      const discountContainer = document.getElementById("discount-items");
      if (discountContainer) {
        discountContainer.innerHTML = `<p class="text-center text-danger">Failed to load discount items. Please try again later.</p>`;
      }
    });
});


// cart start 
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://127.0.0.1:8000/api/cart"; // Replace with your API base URL
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyMessage = document.getElementById("cart-empty-message");
  const checkoutButton = document.getElementById("checkout-button");
  const cartItemCount = document.getElementById("cart-item-count");

  // Fetch and display cart items
  fetch(`${API_BASE_URL}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}` // Use your authentication mechanism
    }
  })
    .then(response => response.json())
    .then(data => {
      const items = data.cart_items || [];

      if (items.length === 0) {
        emptyMessage.classList.remove("d-none");
        checkoutButton.classList.add("d-none");
      } else {
        emptyMessage.classList.add("d-none");
        checkoutButton.classList.remove("d-none");

        let totalItems = 0;
        items.forEach(item => {
          totalItems += item.quantity;
          const itemHTML = `
            <div class="col-md-6 mb-4">
              <div class="card">
                <img src="${item.food_item.image}" class="card-img-top" alt="${item.food_item.name}">
                <div class="card-body">
                  <h5 class="card-title">${item.food_item.name}</h5>
                  <p class="card-text">${item.food_item.description}</p>
                  <p>Price: $${item.food_item.price}</p>
                  <p>Quantity: 
                    <input type="number" value="${item.quantity}" data-id="${item.food_item.id}" class="update-quantity form-control" style="width: 80px; display: inline-block;">
                  </p>
                  <button class="btn btn-danger remove-item" data-id="${item.food_item.id}">Remove</button>
                </div>
              </div>
            </div>`;
          cartItemsContainer.innerHTML += itemHTML;
        });

        // Update cart item count in the navbar
        cartItemCount.textContent = totalItems;
      }
    })
    .catch(error => console.error("Error fetching cart items:", error));

  // Handle quantity update
  cartItemsContainer.addEventListener("input", event => {
    if (event.target.classList.contains("update-quantity")) {
      const foodItemId = event.target.dataset.id;
      const newQuantity = event.target.value;

      fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ food_item: foodItemId, quantity: newQuantity })
      })
        .then(response => response.json())
        .then(data => console.log("Quantity updated:", data))
        .catch(error => console.error("Error updating quantity:", error));
    }
  });

  // Handle item removal
  cartItemsContainer.addEventListener("click", event => {
    if (event.target.classList.contains("remove-item")) {
      const foodItemId = event.target.dataset.id;

      fetch(`${API_BASE_URL}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ food_item: foodItemId })
      })
        .then(response => response.json())
        .then(data => {
          console.log("Item removed:", data);
          location.reload(); // Reload the page to update cart
        })
        .catch(error => console.error("Error removing item:", error));
    }
  });

  // Handle checkout button click
  checkoutButton.addEventListener("click", () => {
    alert("Proceeding to checkout..."); // Placeholder for checkout functionality
  });
});

// cart end 