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
