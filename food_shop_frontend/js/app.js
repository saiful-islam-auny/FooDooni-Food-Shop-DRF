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
                    <!-- Clickable image -->
                    <a href="details.html?id=${item.id}" class="menu-img img mb-4 clickable-link" style="background-image: url(${item.image});"></a>
                    <div class="text">
                      <!-- Clickable name -->
                      <h3><a href="details.html?id=${item.id}" class="clickable-link">${item.name}</a></h3>
                      <!-- Description -->
                      <p>${item.description.split(" ").slice(0, 10).join(" ")}...</p>
                      <!-- Price -->
                      <p class="price"><span>$${item.price}</span></p>
                      <!-- Add to Cart Button -->
                      <p>
                        <button class="btn btn-white btn-outline-white add-to-cart" data-id="${item.id}">Add to cart</button>
                      </p>
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
            // Add click event listeners to cards
            const cards = document.querySelectorAll(".clickable-link");
            cards.forEach((card) => {
              card.addEventListener("click", () => {
                const itemId = card.getAttribute("data-id");
                window.location.href = `details.html?id=${itemId}`;
              });
            });
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
                  <img src="${imageUrl}" class="card-img-top clickable-link" data-id="${item.id}" alt="${item.name}">
                  <div class="discount-badge">-${discountPercentage}%</div>
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title clickable-link" data-id="${item.id}">${item.name}</h5>
                  <p class="card-text" data-id="${item.id}">${item.description
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

      // Add click event listeners to cards
      const cards = document.querySelectorAll(".clickable-link");
      cards.forEach((card) => {
        card.addEventListener("click", () => {
          const itemId = card.getAttribute("data-id");
          window.location.href = `details.html?id=${itemId}`;
        });
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

          const price =
            parseFloat(
              item.food_item.discounted_price || item.food_item.price
            ) || 0;
          const total = (price * item.quantity).toFixed(2);
          totalCartPrice += price * item.quantity;

          const blockHTML = `
          <div class="col-12 mb-4 cart-item" data-id="${item.food_item.id}">
            <div class="cart-item-content">
              <!-- Row 1: Image -->
              <div class="col-3">
                <img src="${imageUrl}" class="cart-item-img" alt="${item.food_item.name
            }">
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
  // addToOrderButton.addEventListener("click", () => {
  //   window.location.href = "/profile"; // Replace "/order" with your actual order page URL
  // });
});


document.addEventListener("DOMContentLoaded", () => {
  const API_ORDER_HISTORY_URL = "http://127.0.0.1:8000/api/order/history/";
  const orderListContainer = document.getElementById("order-list");

  if (!orderListContainer) {
    console.error("Order list container not found in DOM.");
    return;
  }

  fetchOrderHistory();

  function fetchOrderHistory() {
    const token = localStorage.getItem("token");

    if (!token) {
      orderListContainer.innerHTML = `
        <li class="text-danger text-center">Please log in to view your order history.</li>
      `;
      return;
    }

    orderListContainer.innerHTML = `
      <li class="text-muted text-center">Loading your order history...</li>
    `;

    fetch(API_ORDER_HISTORY_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        renderOrderHistory(data);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
        orderListContainer.innerHTML = `
          <li class="text-danger text-center">Failed to load order history: ${error.message}</li>
        `;
      });
  }

  function renderOrderHistory(orders) {
    orderListContainer.innerHTML = "";

    if (!orders || orders.length === 0) {
      orderListContainer.innerHTML = `
        <li class="text-center">You have no orders in your history.</li>
      `;
      return;
    }

    const BASE_URL = "http://127.0.0.1:8000"; // Base URL for the images

    orders.forEach((order) => {
      const orderHTML = `
        <li class="order-item">
          <div class="order-header">
            <h5>Order No: ${order.id}</h5>
            <p class="order-date">Date: ${new Date(
        order.created_at
      ).toLocaleDateString()}</p>
            <p class="order-status">Status: ${order.status}</p>
            <p class="order-total">Total: $${parseFloat(
        order.total_price
      ).toFixed(2)}</p>
          </div>
          <ul class="order-items">
            ${order.items
          .map(
            (item) => `
              <li class="order-item-detail">
                <img src="${item.food_item_image
                ? BASE_URL + item.food_item_image
                : "https://via.placeholder.com/50"
              }" 
                     alt="${item.food_item_name}" class="item-image">
                <span class="item-name">${item.food_item_name}</span>
                <span class="item-quantity">Qty: ${item.quantity}</span>
                <span class="item-price">$${parseFloat(
                item.food_item_discounted_price
              ).toFixed(2)}</span>
              </li>
            `
          )
          .join("")}
          </ul>
        </li>
      `;

      orderListContainer.innerHTML += orderHTML;
    });
  }
});

// make order
document.addEventListener("DOMContentLoaded", () => {
  // Get required elements
  const addToOrderButton = document.getElementById("add-to-order");
  const orderModal = document.getElementById("orderModal");
  const closeModalButton = document.querySelector(".close-button");
  const orderForm = document.getElementById("order-form");

  // Show modal when "Add to Order" is clicked
  addToOrderButton.addEventListener("click", () => {
    orderModal.classList.remove("hidden");
  });

  // Close modal when the close button is clicked
  closeModalButton.addEventListener("click", () => {
    orderModal.classList.add("hidden");
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target === orderModal) {
      orderModal.classList.add("hidden");
    }
  });

  // Handle form submission
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get input values
    const deliveryAddress = document
      .getElementById("delivery-address")
      .value.trim();
    const phoneNumber = document.getElementById("phone-number").value.trim();

    // Validate inputs
    if (!deliveryAddress || !phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Send POST request to the API
      const response = await fetch("http://127.0.0.1:8000/api/order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include user's token
        },
        body: JSON.stringify({
          delivery_address: deliveryAddress,
          phone_number: phoneNumber,
        }),
      });

      // Handle response
      if (response.ok) {
        alert("Order placed successfully!");
        orderModal.classList.add("hidden"); // Close the modal
        window.location.reload(); // Reload the page to clear the cart
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An unexpected error occurred.");
    }
  });
});


// item details 
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://127.0.0.1:8000/api/menu";

  // Get item ID from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("id");

  if (!itemId) {
    document.getElementById("item-details").innerHTML =
      "<p class='text-danger'>Item ID is missing in the URL.</p>";
    return;
  }

  // Fetch item details
  fetch(`${API_BASE_URL}/food-items/${itemId}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((item) => {
      const imageUrl = item.image
        ? item.image.startsWith("http")
          ? item.image
          : `http://127.0.0.1:8000${item.image}`
        : "https://via.placeholder.com/600"; // Fallback image

      const itemHTML = `
        <div class="container">
          <div class="row align-items-center mb-4">
            <!-- Image Section -->
            <div class="col-lg-6 col-md-12 mb-4">
              <img src="${imageUrl}" alt="${item.name}" class="details-image img-fluid">
            </div>
            <!-- Details Section -->
            <div class="col-lg-6 col-md-12">
              <h1 class="details-heading">${item.name}</h1>
              <p class="details-price">
                <span class="original-price">$${parseFloat(item.price).toFixed(2)}</span>
                <span class="discounted-price">$${parseFloat(item.discounted_price).toFixed(2)}</span>
              </p>
              <p class="details-description">${item.description}</p>
              <p class="details-category-btn">${item.category}</p>
              <p><button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to cart</button></p>
            </div>
          </div>
          <!-- Review Section -->
          <div class="row mt-5 mb-5">
            <div class="col-12">
              <h2>Reviews</h2>
              <div id="reviews">
                <p>No reviews yet. Be the first to leave a review!</p>
              </div>
              <!-- Add Review Form -->
              <div class="mt-4">
                <h3>Leave a Review</h3>
                <form id="review-form">
                  <div class="mb-3">
                    <label for="review-text" class="form-label">Your Review</label>
                    <textarea id="review-text" class="form-control" rows="4" placeholder="Write your review here..."></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">Submit Review</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById("item-details").innerHTML = itemHTML;

      // Add event listener for "Add to cart" button
      const addToCartButton = document.querySelector(".add-to-cart");
      if (addToCartButton) {
        addToCartButton.addEventListener("click", () => {
          showToast("Item added to cart!", "success");
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching item details:", error);
      document.getElementById("item-details").innerHTML =
        "<p class='text-danger'>Failed to load item details. Please try again later.</p>";
    });
});
