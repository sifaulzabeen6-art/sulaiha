/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   GRANITE PRODUCTS PAGE - DATABASE DYNAMIC JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       GET HTML ELEMENTS
       ================================================= */

    const searchInput =
        document.getElementById("graniteSearch");

    const categoryFilter =
        document.getElementById("graniteCategoryFilter");

    const priceFilter =
        document.getElementById("granitePriceFilter");

    const availabilityFilter =
        document.getElementById("graniteAvailabilityFilter");

    const clearButton =
        document.getElementById("clearGraniteFilters");

    const productGrid =
        document.getElementById("graniteProductGrid");

    const productCount =
        document.getElementById("graniteProductCount");

    const noProducts =
        document.getElementById("graniteNoProducts");


    /* =================================================
       CHECK PRODUCT GRID
       ================================================= */

    if (!productGrid) {

        console.log("Granite Product Grid not found.");

        return;
    }


    /* =================================================
       STORE DATABASE PRODUCTS
       ================================================= */

    let graniteProducts = [];


    /* =================================================
       LOAD GRANITE PRODUCTS FROM DATABASE
       ================================================= */

    async function loadGraniteProducts() {

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


            /* -----------------------------------------
               GET ONLY GRANITE PRODUCTS
               ----------------------------------------- */

            graniteProducts =
                products.filter(function (product) {

                    return String(
                        product.category || ""
                    ).toLowerCase() === "granite";

                });


            /* -----------------------------------------
               DISPLAY PRODUCTS
               ----------------------------------------- */

            renderProducts(graniteProducts);


            console.log(
                "Granite products loaded:",
                graniteProducts.length
            );

        }

        catch (error) {

            console.error(
                "Error loading Granite products:",
                error
            );


            graniteProducts = [];

            renderProducts([]);

        }

    }


    /* =================================================
       CREATE PRODUCT CARD
       ================================================= */

    function renderProducts(products) {

        /* Clear old/static cards */

        productGrid.innerHTML = "";


        /* ---------------------------------------------
           CHECK PRODUCTS
           --------------------------------------------- */

        if (products.length === 0) {

            if (productCount) {

                productCount.textContent = "0";

            }


            if (noProducts) {

                noProducts.style.display = "block";

            }


            return;

        }


        /* ---------------------------------------------
           CREATE EACH PRODUCT CARD
           --------------------------------------------- */

        products.forEach(function (product) {

            const card =
                document.createElement("article");


            card.className =
                "granite-product-card";


            /* -----------------------------------------
               PRODUCT DATA
               ----------------------------------------- */

            const productId =
                product.id;


            const productName =
                product.name || "Unnamed Product";


            const category =
                product.category || "Granite";


            const price =
                Number(product.price || 0);


            const quantity =
                Number(product.quantity || 0);


            const unit =
                product.unit || "sq.ft";


            const description =
                product.description ||
                "Premium granite product.";


            const image =
                product.image ||
                "/images/sulaiha-logo.jpeg";


            const status =
                product.status || "";


            /* -----------------------------------------
               AVAILABILITY
               ----------------------------------------- */

            let isAvailable =
                quantity > 0;


            if (
                status.toLowerCase() === "inactive" ||
                status.toLowerCase() === "out of stock"
            ) {

                isAvailable = false;

            }


            const availability =
                isAvailable
                    ? "available"
                    : "unavailable";


            /* -----------------------------------------
               CARD DATA ATTRIBUTES
               ----------------------------------------- */

            card.dataset.id =
                productId;

            card.dataset.name =
                productName;

            card.dataset.category =
                String(category).toLowerCase();

            card.dataset.price =
                price;

            card.dataset.availability =
                availability;


            /* -----------------------------------------
               STOCK TEXT
               ----------------------------------------- */

            const stockText =
                isAvailable
                    ? "In Stock"
                    : "Out of Stock";


            const stockClass =
                isAvailable
                    ? ""
                    : "out-of-stock";


            /* -----------------------------------------
               PRODUCT CARD HTML
               ----------------------------------------- */

            card.innerHTML = `

                <div class="granite-product-image">

                    <img
                        src="${image}"
                        alt="${productName}"
                        onerror="this.src='/images/sulaiha-logo.jpeg';">

                    <span class="granite-stock-badge ${stockClass}">
                        ${stockText}
                    </span>

                </div>


                <div class="granite-product-info">

                    <span class="granite-product-category">
                        ${String(category).toUpperCase()}
                    </span>


                    <h3>
                        ${productName}
                    </h3>


                    <p>
                        ${description}
                    </p>


                    <div class="granite-product-bottom">

                        <strong>
                            ₹${price.toLocaleString("en-IN")} / ${unit}
                        </strong>


                        <button
                            type="button"
                            class="granite-view-button"
                            data-id="${productId}">

                            View Details

                        </button>

                    </div>

                </div>

            `;


            /* -----------------------------------------
               ADD CARD TO GRID
               ----------------------------------------- */

            productGrid.appendChild(card);

        });


        /* ---------------------------------------------
           APPLY FILTERS
           --------------------------------------------- */

        filterProducts();

    }


    /* =================================================
       FILTER PRODUCTS
       ================================================= */

    function filterProducts() {

        const searchText =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";


        const selectedCategory =
            categoryFilter
                ? categoryFilter.value.toLowerCase()
                : "all";


        const selectedPrice =
            priceFilter
                ? priceFilter.value.toLowerCase()
                : "all";


        const selectedAvailability =
            availabilityFilter
                ? availabilityFilter.value.toLowerCase()
                : "all";


        const productCards =
            productGrid.querySelectorAll(
                ".granite-product-card"
            );


        let visibleCount = 0;


        /* =================================================
           CHECK EVERY PRODUCT
           ================================================= */

        productCards.forEach(function (card) {

            const productName =
                (card.dataset.name || "").toLowerCase();


            const productCategory =
                (card.dataset.category || "").toLowerCase();


            const productPrice =
                Number(card.dataset.price || 0);


            const productAvailability =
                (card.dataset.availability || "").toLowerCase();


            /* -----------------------------------------
               SEARCH MATCH
               ----------------------------------------- */

            const matchesSearch =
                productName.includes(searchText);


            /* -----------------------------------------
               CATEGORY MATCH
               ----------------------------------------- */

            const matchesCategory =
                selectedCategory === "all" ||
                productCategory === selectedCategory;


            /* -----------------------------------------
               PRICE MATCH
               ----------------------------------------- */

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


            /* -----------------------------------------
               AVAILABILITY MATCH
               ----------------------------------------- */

            const matchesAvailability =
                selectedAvailability === "all" ||
                productAvailability === selectedAvailability;


            /* -----------------------------------------
               FINAL RESULT
               ----------------------------------------- */

            const shouldShow =
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesAvailability;


            /* -----------------------------------------
               SHOW / HIDE CARD
               ----------------------------------------- */

            if (shouldShow) {

                card.style.display = "";

                visibleCount++;

            }

            else {

                card.style.display = "none";

            }

        });


        /* =================================================
           UPDATE PRODUCT COUNT
           ================================================= */

        if (productCount) {

            productCount.textContent =
                visibleCount;

        }


        /* =================================================
           SHOW / HIDE NO PRODUCTS MESSAGE
           ================================================= */

        if (noProducts) {

            if (visibleCount === 0) {

                noProducts.style.display = "block";

            }

            else {

                noProducts.style.display = "none";

            }

        }

    }


    /* =================================================
       SEARCH
       ================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    /* =================================================
       CATEGORY FILTER
       ================================================= */

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =================================================
       PRICE FILTER
       ================================================= */

    if (priceFilter) {

        priceFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =================================================
       AVAILABILITY FILTER
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


    /* =================================================
       VIEW DETAILS
       ================================================= */

    productGrid.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".granite-view-button"
                );


            if (!button) {

                return;

            }


            const productId =
                button.dataset.id;


            if (!productId) {

                console.error(
                    "Product ID not found."
                );

                return;

            }


            /* -----------------------------------------
               Open common Product Details page
               ----------------------------------------- */

            window.location.href =
                "/product-details?id=" +
                encodeURIComponent(productId);

        }
    );


    /* =================================================
       INITIAL LOAD
       ================================================= */

    loadGraniteProducts();


    /* =================================================
       PAGE LOADED
       ================================================= */

    console.log(
        "Granite Products JavaScript Loaded Successfully"
    );

});