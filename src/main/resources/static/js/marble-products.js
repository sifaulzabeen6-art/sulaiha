/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   MARBLE PRODUCTS PAGE - DATABASE DYNAMIC JAVASCRIPT
   ===================================================== */


/* =====================================================
   WAIT FOR PAGE TO LOAD
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       GET HTML ELEMENTS
       ================================================= */

    const searchInput =
        document.getElementById("marbleSearch");


    const typeFilter =
        document.getElementById("marbleType");


    const priceFilter =
        document.getElementById("marblePrice");


    const availabilityFilter =
        document.getElementById("marbleAvailability");


    const clearButton =
        document.getElementById("clearMarbleFilters");


    const productGrid =
        document.getElementById("marbleProductGrid");


    const productCount =
        document.getElementById("marbleProductCount");


    const noProductsMessage =
        document.getElementById("noMarbleProducts");


    /* =================================================
       CHECK PRODUCT GRID
       ================================================= */

    if (!productGrid) {

        console.log(
            "Marble Product Grid not found."
        );

        return;
    }


    /* =================================================
       STORE ALL MARBLE PRODUCTS
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
               FILTER ONLY MARBLE PRODUCTS
               ================================================= */

            allProducts =
                products.filter(function (product) {

                    return product.category &&
                           product.category
                               .toLowerCase()
                               .trim() === "marble";

                });


            /* =================================================
               APPLY FILTERS
               ================================================= */

            filterProducts();

        }


        catch (error) {

            console.error(
                "Error loading Marble products:",
                error
            );


            allProducts = [];


            renderProducts([]);


            if (productCount) {

                productCount.textContent = "0";

            }


            if (noProductsMessage) {

                noProductsMessage.style.display =
                    "block";

            }


            if (productGrid) {

                productGrid.style.display =
                    "none";

            }

        }

    }


    /* =================================================
       RENDER MARBLE PRODUCTS
       ================================================= */

    function renderProducts(products) {


        /* Clear existing static/dynamic products */

        productGrid.innerHTML = "";


        /* =================================================
           CREATE PRODUCT CARD
           ================================================= */

        products.forEach(function (product) {


            const card =
                document.createElement("article");


            card.className =
                "marble-product-card";


            /* =================================================
               DATA ATTRIBUTES
               ================================================= */

            card.dataset.name =
                product.name || "";


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
               AVAILABILITY
               ================================================= */

            const isAvailable =
                Number(product.quantity || 0) > 0;


            const availabilityText =
                isAvailable
                    ? "In Stock"
                    : "Out of Stock";


            const availabilityClass =
                isAvailable
                    ? ""
                    : "out-of-stock";


            /* =================================================
               PRODUCT TYPE
               ================================================= */

            const productName =
                product.name || "Marble Product";


            /* =================================================
               PRODUCT CARD HTML
               ================================================= */

            card.innerHTML = `

                <div class="marble-product-image">

                    <img
                        src="${productImage}"
                        alt="${productName}">

                    <span class="stock-badge ${availabilityClass}">
                        ${availabilityText}
                    </span>

                </div>


                <div class="marble-product-info">

                    <span class="product-category">
                        MARBLE
                    </span>


                    <h3>
                        ${productName}
                    </h3>


                    <p>
                        ${product.description ||
                        "No description available."}
                    </p>


                    <div class="product-bottom">

                        <strong>
                            ₹${product.price || 0}
                            ${product.unit
                                ? " / " + product.unit
                                : ""}
                        </strong>


                        <button
                            type="button"
                            class="product-view-button"
                            data-product-id="${product.id}">

                            View Details

                        </button>

                    </div>

                </div>

            `;


            /* =================================================
               ADD CARD TO GRID
               ================================================= */

            productGrid.appendChild(card);

        });

    }


    /* =================================================
       FILTER PRODUCTS
       ================================================= */

    function filterProducts() {


        /* =================================================
           GET CURRENT FILTER VALUES
           ================================================= */

        const searchValue =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedType =
            typeFilter
                ? typeFilter.value
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
           FILTER PRODUCTS
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
                    productName.includes(
                        searchValue
                    );


                /* =================================================
                   TYPE MATCH
                   ================================================= */

                let matchesType = true;


                if (selectedType !== "all") {

                    matchesType =
                        productName.includes(
                            selectedType
                        );

                }


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
                   FINAL MATCH
                   ================================================= */

                return (
                    matchesSearch &&
                    matchesType &&
                    matchesPrice &&
                    matchesAvailability
                );

            });


        /* =================================================
           RENDER FILTERED PRODUCTS
           ================================================= */

        renderProducts(
            filteredProducts
        );


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

        if (noProductsMessage) {

            if (filteredProducts.length === 0) {

                noProductsMessage.style.display =
                    "block";


                productGrid.style.display =
                    "none";

            }

            else {

                noProductsMessage.style.display =
                    "none";


                productGrid.style.display =
                    "grid";

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
       TYPE FILTER EVENT
       ================================================= */

    if (typeFilter) {

        typeFilter.addEventListener(
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


                /* Reset Search */

                if (searchInput) {

                    searchInput.value = "";

                }


                /* Reset Type */

                if (typeFilter) {

                    typeFilter.value = "all";

                }


                /* Reset Price */

                if (priceFilter) {

                    priceFilter.value = "all";

                }


                /* Reset Availability */

                if (availabilityFilter) {

                    availabilityFilter.value = "all";

                }


                /* Apply Filters */

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
                    ".product-view-button"
                );


            /* Ignore other clicks */

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
       PAGE LOADED MESSAGE
       ================================================= */

    console.log(
        "Marble Products JavaScript Loaded Successfully"
    );

});