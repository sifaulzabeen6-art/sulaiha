// =====================================================
// SULAIHA - BUILDING MATERIALS
// DATABASE DYNAMIC PRODUCTS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {


    // =================================================
    // GET ELEMENTS
    // =================================================

    const searchInput =
        document.getElementById(
            "buildingMaterialsSearch"
        );

    const categoryFilter =
        document.getElementById(
            "buildingMaterialsCategoryFilter"
        );

    const priceFilter =
        document.getElementById(
            "buildingMaterialsPriceFilter"
        );

    const availabilityFilter =
        document.getElementById(
            "buildingMaterialsAvailabilityFilter"
        );

    const clearButton =
        document.getElementById(
            "clearBuildingMaterialsFilters"
        );

    const productGrid =
        document.getElementById(
            "buildingMaterialsProductGrid"
        );

    const productCount =
        document.getElementById(
            "buildingMaterialsProductCount"
        );

    const noProducts =
        document.getElementById(
            "buildingMaterialsNoProducts"
        );


    // =================================================
    // PRODUCTS FROM DATABASE
    // =================================================

    let products = [];


    // =================================================
    // LOAD PRODUCTS
    // =================================================

    async function loadProducts() {

        try {

            const response =
                await fetch("/api/products");


            if (!response.ok) {

                throw new Error(
                    "Failed to load products"
                );

            }


            const allProducts =
                await response.json();


            // Only Building Materials
            products =
                allProducts.filter(function (product) {

                    return (
                        (product.category || "")
                            .trim()
                            .toLowerCase()
                        ===
                        "building materials"
                    );

                });


            renderProducts(products);


        } catch (error) {

            console.error(
                "Error loading building materials:",
                error
            );

            productGrid.innerHTML = "";

            productCount.textContent = "0";

            noProducts.style.display = "block";

        }

    }


    // =================================================
    // RENDER PRODUCTS
    // =================================================

    function renderProducts(productList) {

        productGrid.innerHTML = "";


        if (productList.length === 0) {

            productCount.textContent = "0";

            noProducts.style.display = "block";

            return;
        }


        noProducts.style.display = "none";


        productList.forEach(function (product) {

            const card =
                document.createElement("article");


            card.className =
                "building-materials-product-card";


            card.dataset.id =
                product.id;


            card.dataset.name =
                product.name || "";


            card.dataset.category =
                product.category || "";


            card.dataset.price =
                product.price || 0;


            card.dataset.availability =
                getAvailability(product);


            card.innerHTML = `

                <div class="building-materials-product-image">

                    <img
                        src="${product.image || "/images/product-placeholder.jpg"}"
                        alt="${product.name || "Product"}">

                    <span class="building-materials-stock-badge">
                        ${getAvailability(product)}
                    </span>

                </div>


                <div class="building-materials-product-info">

                    <span class="building-materials-product-category">
                        ${(product.category || "").toUpperCase()}
                    </span>

                    <h3>
                        ${product.name || "Unnamed Product"}
                    </h3>

                    <p>
                        ${product.description || "No description available."}
                    </p>


                    <div class="building-materials-product-bottom">

                        <strong>
                            ₹${product.price} / ${product.unit || ""}
                        </strong>

                        <button
                            type="button"
                            class="building-materials-view-button"
                            data-product-id="${product.id}">

                            View Details

                        </button>

                    </div>

                </div>

            `;


            productGrid.appendChild(card);

        });


        productCount.textContent =
            productList.length;


        attachViewDetailsEvents();

    }


    // =================================================
    // AVAILABILITY
    // =================================================

    function getAvailability(product) {

        if (
            product.status &&
            product.status.toLowerCase() === "available"
        ) {

            return "In Stock";
        }


        if (
            product.status &&
            product.status.toLowerCase() === "out of stock"
        ) {

            return "Out of Stock";
        }


        if (product.quantity > 0) {

            return "In Stock";
        }


        return "Out of Stock";
    }


    // =================================================
    // FILTER PRODUCTS
    // =================================================

    function filterProducts() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedCategory =
            categoryFilter
                ? categoryFilter.value
                    .toLowerCase()
                    .trim()
                : "all";


        const selectedPrice =
            priceFilter
                ? priceFilter.value
                    .toLowerCase()
                : "all";


        const selectedAvailability =
            availabilityFilter
                ? availabilityFilter.value
                    .toLowerCase()
                : "all";


        const filteredProducts =
            products.filter(function (product) {


                const productName =
                    (product.name || "")
                        .toLowerCase();


                const productCategory =
                    (product.category || "")
                        .toLowerCase()
                        .trim();


                const productPrice =
                    Number(product.price || 0);


                const productAvailability =
                    getAvailability(product)
                        .toLowerCase();


                // SEARCH
                const matchesSearch =
                    productName.includes(searchText);


                // CATEGORY
                const matchesCategory =
                    selectedCategory === "all" ||
                    productCategory === selectedCategory;


                // PRICE
                let matchesPrice = true;


                if (selectedPrice === "low") {

                    matchesPrice =
                        productPrice < 1000;

                }

                else if (selectedPrice === "medium") {

                    matchesPrice =
                        productPrice >= 1000 &&
                        productPrice <= 2500;

                }

                else if (selectedPrice === "high") {

                    matchesPrice =
                        productPrice > 2500;

                }


                // AVAILABILITY
                const matchesAvailability =
                    selectedAvailability === "all" ||
                    productAvailability ===
                    selectedAvailability;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesPrice &&
                    matchesAvailability
                );

            });


        renderProducts(filteredProducts);

    }


    // =================================================
    // VIEW DETAILS
    // =================================================

    function attachViewDetailsEvents() {

        const buttons =
            productGrid.querySelectorAll(
                ".building-materials-view-button"
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {


                    const productId =
                        button.dataset.productId;


                    if (!productId) {

                        console.error(
                            "Product ID not found"
                        );

                        return;
                    }


                    window.location.href =
                        "/product-details?productId="
                        + encodeURIComponent(productId);

                }
            );

        });

    }


    // =================================================
    // SEARCH
    // =================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    // =================================================
    // CATEGORY
    // =================================================

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // =================================================
    // PRICE
    // =================================================

    if (priceFilter) {

        priceFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // =================================================
    // AVAILABILITY
    // =================================================

    if (availabilityFilter) {

        availabilityFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // =================================================
    // CLEAR FILTERS
    // =================================================

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                if (searchInput) {
                    searchInput.value = "";
                }

                if (categoryFilter) {
                    categoryFilter.value = "all";
                }

                if (priceFilter) {
                    priceFilter.value = "all";
                }

                if (availabilityFilter) {
                    availabilityFilter.value = "all";
                }

                filterProducts();

            }
        );

    }


    // =================================================
    // INITIAL LOAD
    // =================================================

    loadProducts();


    console.log(
        "Building Materials loaded dynamically from database."
    );

});