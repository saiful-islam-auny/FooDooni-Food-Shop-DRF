document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "http://127.0.0.1:8000/api/menu";
    const menuTabs = document.getElementById("menu-tabs");
    const menuTabContent = document.getElementById("menu-tabContent");

    // Fetch categories
    fetch(`${API_BASE_URL}/categories/`)
        .then(response => response.json())
        .then(categories => {
            console.log("Categories fetched:", categories);

            // Create a mapping from category name to ID
            const categoryMap = {};
            categories.forEach((category, index) => {
                categoryMap[category.name.trim()] = category.id; // Trim to avoid mismatches

                // Render category tabs
                const isActive = index === 0 ? "active" : "";
                menuTabs.innerHTML += `
                    <a class="nav-link ${isActive}" id="tab-${category.id}" data-toggle="pill" 
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
                            <!-- Menu items for ${category.name} will be loaded here -->
                        </div>
                    </div>
                `;
            });

            // Fetch food items
            fetch(`${API_BASE_URL}/food-items/`)
                .then(response => response.json())
                .then(foodItems => {
                    console.log("Food items fetched:", foodItems);

                    // Append food items to their respective category containers
                    foodItems.forEach(item => {
                        const categoryId = categoryMap[item.category.trim()]; // Match trimmed category name
                        if (categoryId) {
                            const categoryContainer = document.getElementById(`menu-items-${categoryId}`);
                            if (categoryContainer) {
                                categoryContainer.innerHTML += `
                                    <div class="col-md-4 text-center">
                                        <div class="menu-wrap">
                                            <a href="#" class="menu-img img mb-4" style="background-image: url(${item.image});"></a>
                                            <div class="text">
                                                <h3><a href="#">${item.name}</a></h3>
                                                <p>${item.description.split(" ").slice(0, 10).join(" ")}...</p>
                                                <p class="price"><span>$${item.price}</span></p>
                                                <p><a href="#" class="btn btn-white btn-outline-white">Add to cart</a></p>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            } else {
                                console.error(`No container found for category ID: ${categoryId}`);
                            }
                        } else {
                            console.error(`No matching category ID for item: ${item.name}, category: ${item.category}`);
                        }
                    });
                })
                .catch(error => console.error("Error fetching food items:", error));
        })
        .catch(error => console.error("Error fetching categories:", error));
});
