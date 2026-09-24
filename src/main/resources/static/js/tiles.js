/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   TILES PRODUCTS PAGE - DATABASE DYNAMIC JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       GET ELEMENTS
       ================================================= */

    const searchInput =
        document.getElementById("tilesSearch");

    const categoryFilter =
        document.getElementById("tilesCategoryFilter");

    const priceFilter =
        document.getElementById("tilesPriceFilter");

    const availabilityFilter =
        document.getElementById("tilesAvailabilityFilter");

    const clearButton =
        document.getElementById("clearTilesFilters");

    const productGrid =
        document.getElementById("tilesProductGrid");

    const productCount =
        document.getElementById("tilesProductCount");

    const noProducts =
        document.getElementById("tilesNoProducts");


    /* =================================================
       CHECK PRODUCT GRID
       ================================================= */

    if (!productGrid) {

        console.log("Tiles Product Grid not found.");

        return;
    }


    /* =================================================
       STORE ALL TILES PRODUCTS
       ================================================= */

    let allProducts = [];


    /* =================================================
       LOAD PRODUCTS FROM DATABASE
       ================================================= */

    async function loadProducts() {

        try {

            const response =
                await fetch("/api/products");


            if (!response.ok) {

                throw new Error(
                    "Failed to load products"
                );

            }


            const products =
                await response.json();


            /* =================================================
               FILTER ONLY TILES PRODUCTS
               ================================================= */

            allProducts =
                products.filter(function (product) {

                    return product.category &&
                           product.category
                               .toLowerCase()
                               .trim() === "tiles";

                });


            /* =================================================
               DISPLAY PRODUCTS
               ================================================= */

            filterProducts();


        }

        catch (error) {

            console.error(
                "Error loading Tiles products:",
                error
            );


            allProducts = [];


            renderProducts([]);


            if (productCount) {

                productCount.textContent = "0";

            }


            if (noProducts) {

                noProducts.style.display = "block";

            }

        }

    }


    /* =================================================
       RENDER PRODUCTS
       ================================================= */

    function renderProducts(products) {

        /* Clear existing static/dynamic cards */

        productGrid.innerHTML = "";


        /* =================================================
           CREATE PRODUCT CARD FOR EACH PRODUCT
           ================================================= */

        products.forEach(function (product) {


            const card =
                document.createElement("article");


            card.className =
                "tiles-product-card";


            /* =================================================
               DATA ATTRIBUTES
               ================================================= */

            card.dataset.name =
                product.name || "";


            card.dataset.category =
                (product.category || "").toLowerCase();


            card.dataset.price =
                product.price || 0;


            card.dataset.availability =
                Number(product.quantity || 0) > 0
                    ? "available"
                    : "unavailable";


            /* =================================================
               PRODUCT IMAGE
               ================================================= */

            const productImage =
                product.image
                    ? product.image
                    : "/images/sulaiha-logo.jpeg";


            /* =================================================
               PRODUCT AVAILABILITY
               ================================================= */

            const availabilityText =
                Number(product.quantity || 0) > 0
                    ? "In Stock"
                    : "Out of Stock";


            /* =================================================
               PRODUCT CARD HTML
               ================================================= */

            card.innerHTML = `

                <div class="tiles-product-image">

                    <img
                        src="${productImage}"
                        alt="${product.name || "Tile Product"}">

                    <span class="tiles-stock-badge">
                        ${availabilityText}
                    </span>

                </div>


                <div class="tiles-product-info">

                    <span class="tiles-product-category">
                        ${(product.category || "TILES").toUpperCase()}
                    </span>


                    <h3>
                        ${product.name || ""}
                    </h3>


                    <p>
                        ${product.description || "No description available."}
                    </p>


                    <div class="tiles-product-bottom">

                        <strong>
                            ₹${product.price || 0}
                            ${product.unit
                                ? " / " + product.unit
                                : ""}
                        </strong>


                        <button
                            type="button"
                            class="tiles-view-button"
                            data-product-id="${product.id}">

                            View Details

                        </button>

                    </div>

                </div>

            `;


            /* =================================================
               ADD CARD TO PRODUCT GRID
               ================================================= */

            productGrid.appendChild(card);

        });

    }


    /* =================================================
       FILTER PRODUCTS
       ================================================= */

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
                    .trim()
                : "all";


        const selectedAvailability =
            availabilityFilter
                ? availabilityFilter.value
                    .toLowerCase()
                    .trim()
                : "all";


        /* =================================================
           FILTER DATABASE PRODUCTS
           ================================================= */

        const filteredProducts =
            allProducts.filter(function (product) {


                /* =================================================
                   PRODUCT NAME
                   ================================================= */

                const productName =
                    (product.name || "")
                        .toLowerCase()
                        .trim();


                /* =================================================
                   PRODUCT CATEGORY
                   ================================================= */

                const productCategory =
                    (product.category || "")
                        .toLowerCase()
                        .trim();


                /* =================================================
                   PRODUCT PRICE
                   ================================================= */

                const productPrice =
                    Number(product.price || 0);


                /* =================================================
                   PRODUCT AVAILABILITY
                   ================================================= */

                const productAvailability =
                    Number(product.quantity || 0) > 0
                        ? "available"
                        : "unavailable";


                /* =================================================
                   SEARCH MATCH
                   ================================================= */

                const matchesSearch =
                    productName.includes(searchText);


                /* =================================================
                   CATEGORY MATCH
                   ================================================= */

                const matchesCategory =
                    selectedCategory === "all" ||
                    productCategory === selectedCategory;


                /* =================================================
                   PRICE MATCH
                   ================================================= */

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


                /* =================================================
                   AVAILABILITY MATCH
                   ================================================= */

                const matchesAvailability =
                    selectedAvailability === "all" ||
                    productAvailability ===
                        selectedAvailability;


                /* =================================================
                   FINAL RESULT
                   ================================================= */

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesPrice &&
                    matchesAvailability
                );

            });


        /* =================================================
           RENDER FILTERED PRODUCTS
           ================================================= */

        renderProducts(filteredProducts);


        /* =================================================
           UPDATE PRODUCT COUNT
           ================================================= */

        if (productCount) {

            productCount.textContent =
                filteredProducts.length;

        }


        /* =================================================
           SHOW / HIDE NO PRODUCTS MESSAGE
           ================================================= */

        if (noProducts) {

            if (filteredProducts.length === 0) {

                noProducts.style.display =
                    "block";

            }

            else {

                noProducts.style.display =
                    "none";

            }

        }

    }


    /* =================================================
       SEARCH EVENT
       ================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    /* =================================================
       CATEGORY FILTER EVENT
       ================================================= */

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =================================================
       PRICE FILTER EVENT
       ================================================= */

    if (priceFilter) {

        priceFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =================================================
       AVAILABILITY FILTER EVENT
       ================================================= */

    if (availabilityFilter) {

        availabilityFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =================================================
       CLEAR FILTERS
       ================================================= */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {


                /* Clear Search */

                if (searchInput) {

                    searchInput.value = "";

                }


                /* Reset Category */

                if (categoryFilter) {

                    categoryFilter.value = "all";

                }


                /* Reset Price */

                if (priceFilter) {

                    priceFilter.value = "all";

                }


                /* Reset Availability */

                if (availabilityFilter) {

                    availabilityFilter.value = "all";

                }


                /* Apply Filters Again */

                filterProducts();

            }
        );

    }


    /* =================================================
       VIEW DETAILS
       ================================================= */

    productGrid.addEventListener(
        "click",
        function (event) {


            const button =
                event.target.closest(
                    ".tiles-view-button"
                );


            /* Ignore clicks outside View Details */

            if (!button) {

                return;

            }


            /* =================================================
               GET PRODUCT ID
               ================================================= */

            const productId =
                button.dataset.productId;


            if (!productId) {

                console.error(
                    "Product ID not found."
                );

                return;

            }


            /* =================================================
               OPEN PRODUCT DETAILS PAGE
               ================================================= */

            window.location.href =
                "/product-details?id=" + productId;

        }
    );


    /* =================================================
       INITIAL LOAD
       ================================================= */

    loadProducts();


    /* =================================================
       CONSOLE MESSAGE
       ================================================= */

    console.log(
        "Tiles Products JavaScript Loaded Successfully"
    );

});