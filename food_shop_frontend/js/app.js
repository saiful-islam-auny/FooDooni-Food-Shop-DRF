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
                                <p><button class="btn btn-white btn-outline-white add-to-cart" data-id="${item.id
                  }">Add to cart</button></p>
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
                  <img src="${imageUrl}" class="card-img-top" alt="${item.name
          }">
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
                    <p><button class="btn btn-white btn-outline-white add-to-cart" data-id="${item.id
          }">Add to cart</button></p>                  </div>
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


// cart functionality start fom here
document.addEventListener("DOMContentLoaded", () => {
  const API_CART_URL = "http://127.0.0.1:8000/api/cart/";

  // Handle "Add to Cart" and "Cart" button clicks
  document.addEventListener("click", (event) => {
    // Add to Cart Button
    if (event.target.classList.contains("add-to-cart")) {
      const itemId = event.target.getAttribute("data-id"); // Get item ID from button
      addToCart(itemId);
    }

    // Cart Button
    if (event.target.classList.contains("cart-button")) {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "./login.html"; // Navigate to login page
      } else {
        window.location.href = "./cart.html"; // Navigate to cart page
      }
    }
  });

  function showLoginModal() {
    const modal = document.getElementById("login-modal");
    const closeBtn = modal.querySelector(".close-btn");
    const loginBtn = document.getElementById("login-btn");

    // Show the modal
    modal.style.display = "block";

    // Close the modal when clicking the close button
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Redirect to the login page when clicking the login button
    loginBtn.addEventListener("click", () => {
      window.location.href = "./login.html";
    });

    // Close the modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Add item to cart
  function addToCart(foodItemId) {
    const token = localStorage.getItem("token"); // Get user's auth token

    if (!token) {
      showLoginModal();
      return;
    }

    const cartData = {
      food_item: foodItemId, // Item ID from the button
      quantity: 1, // Default quantity
    };

    fetch(API_CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
      body: JSON.stringify(cartData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorDetails) => {
            throw new Error(`Error: ${JSON.stringify(errorDetails)}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Item added to cart successfully:", data);
        showToast("Item added to cart!", "success");

        // Update cart item count in the navbar
        if (data.cart_item_count !== undefined) {
          updateCartItemCount(data.cart_item_count);
        } else {
          console.warn("Cart item count not provided in response.");
        }

        // Optional: Uncomment to redirect to cart
        // console.log("Redirecting to cart page...");
        // window.location.href = "/cart.html";
      })
      .catch((error) => {
        console.error("Failed to add item to cart:", error);
        showToast("Failed to add item to cart!", "error");
      });
  }
});

// show the cart count
document.addEventListener("DOMContentLoaded", () => {
  const API_CART_URL = "http://127.0.0.1:8000/api/cart/";

  // Update the cart item count in the navbar
  function updateCartItemCount(count) {
    console.log("Updating cart item count to:", count);
    const cartItemCountElement = document.getElementById("cart-item-count");
    if (cartItemCountElement) {
      cartItemCountElement.innerText = count; // Update the count
    } else {
      console.warn("Cart item count element not found in DOM.");
    }
  }

  // Fetch and display the cart item count on page load
  function fetchCartItemCount() {
    console.log("Fetching cart item count...");
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found. User might not be logged in.");
      return;
    }

    fetch(API_CART_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Cart fetch response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch cart item count.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Cart data received from API:", data); // Debugging
        const itemCount = data.items ? data.items.length : 0; // Count items in the cart
        updateCartItemCount(itemCount);
      })
      .catch((error) => {
        console.error("Error fetching cart item count:", error);
      });
  }

  fetchCartItemCount();
});

// get cart item
document.addEventListener("DOMContentLoaded", () => {
  const API_CART_URL = "http://127.0.0.1:8000/api/cart/";
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");
  const addToOrderButton = document.getElementById("add-to-order");

  if (!cartItemsContainer || !cartTotalContainer || !addToOrderButton) {
    console.error("Essential elements not found.");
    return;
  }

  fetchCartItems();

  // Fetch and display cart items
  function fetchCartItems() {
    const token = localStorage.getItem("token");

    if (!token) {
      cartItemsContainer.innerHTML = `
      <div class="col-12 text-danger text-center">Please log in to view your cart.</div>
    `;
      cartTotalContainer.textContent = "Total: $0.00";
      return;
    }

    cartItemsContainer.innerHTML = `
    <div class="col-12 text-muted text-center">Loading your cart...</div>
  `;

    fetch(API_CART_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        cartItemsContainer.innerHTML = ""; // Clear existing items

        if (!data.items || data.items.length === 0) {
          cartItemsContainer.innerHTML = `
          <div class="col-12 text-center">Your cart is empty.</div>
        `;
          cartTotalContainer.textContent = "Total: $0.00";
          return;
        }

        let totalCartPrice = 0;

        data.items.forEach((item) => {
          const imageUrl = item.food_item.image
            ? item.food_item.image.startsWith("http")
              ? item.food_item.image
              : `http://127.0.0.1:8000${item.food_item.image}`
            : "https://via.placeholder.com/50";

          const price = parseFloat(item.food_item.discounted_price || item.food_item.price) || 0;
          const total = (price * item.quantity).toFixed(2);
          totalCartPrice += price * item.quantity;

          const blockHTML = `
          <div class="col-12 mb-4 cart-item" data-id="${item.food_item.id}">
            <div class="cart-item-content">
              <!-- Row 1: Image -->
              <div class="col-3">
                <img src="${imageUrl}" class="cart-item-img" alt="${item.food_item.name}">
              </div>
        
              <!-- Row 2: Name and Price -->
              <div class="col-3">
                <div class="cart-item-details">
                  <h5 class="cart-item-title">${item.food_item.name}</h5>
                  <p class="cart-item-price">$${price.toFixed(2)}</p>
                </div>
              </div>
        
              <!-- Row 3: Quantity and Total -->
              <div class="col-3">
                <div class="quantity-control">
                  <button class="btn btn-sm btn-primary increment-quantity" aria-label="Increase quantity">+</button>
                  <span class="mx-2 item-quantity">${item.quantity}</span>
                  <button class="btn btn-sm btn-secondary decrement-quantity" aria-label="Decrease quantity">-</button>
                </div>
                <div class="cart-item-total">
                  <p>Total: $<span class="item-total">${total}</span></p>
                </div>
              </div>
        
              <!-- Row 4: Remove Button -->
              <div class="col-3">
                <button class="btn btn-sm btn-danger remove-item" aria-label="Remove item from cart">X</button>
              </div>
            </div>
          </div>
        `;


          cartItemsContainer.innerHTML += blockHTML;
        });

        cartTotalContainer.textContent = `Total: $${totalCartPrice.toFixed(2)}`;
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        cartItemsContainer.innerHTML = `
        <div class="col-12 text-danger text-center">Failed to load cart items. Please try again later.</div>
      `;
      });
  }

  // Update quantity (increment or decrement)
  cartItemsContainer.addEventListener("click", (event) => {
    const button = event.target;
    const card = button.closest(".cart-item");
    const foodItemId = card ? card.getAttribute("data-id") : null;

    if (!foodItemId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to modify your cart.");
      return;
    }

    if (button.classList.contains("increment-quantity")) {
      updateCartQuantity(foodItemId, 1);
    } else if (button.classList.contains("decrement-quantity")) {
      updateCartQuantity(foodItemId, -1);
    } else if (button.classList.contains("remove-item")) {
      removeCartItem(foodItemId);
    }
  });

  // Update quantity in the backend
  function updateCartQuantity(foodItemId, quantityChange) {
    const token = localStorage.getItem("token");

    fetch(`${API_CART_URL}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        food_item: foodItemId,
        quantity_change: quantityChange,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update cart item.");
        }
        return response.json();
      })
      .then(() => {
        fetchCartItems(); // Refresh cart items
      })
      .catch((error) => {
        console.error("Error updating cart item:", error);
        alert("Failed to update item quantity. Please try again.");
      });
  }

  // Remove item from the cart
  function removeCartItem(foodItemId) {
    const token = localStorage.getItem("token");

    fetch(`${API_CART_URL}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ food_item: foodItemId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to remove cart item.");
        }
        return response.json();
      })
      .then(() => {
        fetchCartItems(); // Refresh cart items
      })
      .catch((error) => {
        console.error("Error removing cart item:", error);
        alert("Failed to remove item. Please try again.");
      });
  }

  // Navigate to order page
  addToOrderButton.addEventListener("click", () => {
    window.location.href = "/order"; // Replace "/order" with your actual order page URL
  });
});

function showToast(message, type = "success") {
  // Create the toast element
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  // Add content to the toast
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === "success" ? "✔️" : type === "error" ? "❌" : "ℹ️"}
    </div>
    <div>${message}</div>
  `;

  // Append to the toast container
  const container = document.getElementById("toast-container");
  container.appendChild(toast);

  // Remove the toast after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

