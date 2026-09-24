
/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   ALL PRODUCTS PAGE
   DATABASE CONNECTED JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const searchInput =
        document.getElementById("productSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const priceFilter =
        document.getElementById("priceFilter");

    const availabilityFilter =
        document.getElementById("availabilityFilter");

    const clearButton =
        document.getElementById("clearAllFilters");

    const productGrid =
        document.getElementById("allProductGrid");

    const productCount =
        document.getElementById("allProductCount");

    const noProductsMessage =
        document.getElementById("noProductsMessage");


    /* =====================================================
       PRODUCT DATA
       ===================================================== */

    let products = [];


    /* =====================================================
       CHECK PRODUCT GRID
       ===================================================== */

    if (!productGrid) {

        console.error(
            "Product grid not found."
        );

        return;
    }


    /* =====================================================
       LOAD PRODUCTS FROM DATABASE
       ===================================================== */

    async function loadProducts() {

        try {

            const response =
                await fetch(
                    "/api/products",
                    {
                        method: "GET",
                        credentials: "same-origin"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to load products. Status: "
                    + response.status
                );
            }


            products =
                await response.json();


            console.log(
                "Products loaded from database:",
                products
            );


            displayProducts(products);


        } catch (error) {

            console.error(
                "Error loading products:",
                error
            );


            products = [];


            productGrid.innerHTML = "";


            if (productCount) {

                productCount.textContent = "0";

            }


            if (noProductsMessage) {

                noProductsMessage.style.display =
                    "block";

            }

        }

    }


    /* =====================================================
       CREATE PRODUCT CARD
       ===================================================== */

    function createProductCard(product) {

        const card =
            document.createElement("article");


        card.className =
            "all-product-card";


        /* =================================================
           PRODUCT VALUES
           ================================================= */

        const productName =
            product.name || "Unnamed Product";


        const category =
            product.category || "";


        const categoryText =
            category.replace(
                /-/g,
                " "
            ).toUpperCase();


        const price =
            Number(product.price || 0);


        const quantity =
            Number(product.quantity || 0);


        const unit =
            product.unit || "";


        const description =
            product.description ||
            "Premium quality building material.";


        const image =
            product.image &&
            product.image.trim() !== ""
                ? product.image
                : "/images/sulaiha-logo.jpeg";


        /* =================================================
           PRODUCT DIMENSION
           ================================================= */

        const pricingType =
            String(
                product.pricingType || ""
            ).toUpperCase();


        let sizeText = "";


        if (
            pricingType === "DIMENSION" &&
            Number(product.length) > 0 &&
            Number(product.width) > 0
        ) {

            sizeText =
                `${product.length} × ${product.width} ${product.dimensionUnit || "ft"}`;

        }


        /* =================================================
           AVAILABILITY
           ================================================= */

        const status =
            String(
                product.status || ""
            ).toLowerCase();


        const isAvailable =
            quantity > 0 &&
            status === "available";


        const availability =
            isAvailable
                ? "available"
                : "unavailable";


        const availabilityText =
            isAvailable
                ? "In Stock"
                : "Out of Stock";


        const stockClass =
            isAvailable
                ? ""
                : "out-of-stock";


        /* =================================================
           DATA ATTRIBUTES
           ================================================= */

        card.dataset.id =
            product.id;

        card.dataset.name =
            productName;

        card.dataset.category =
            category.toLowerCase();

        card.dataset.price =
            price;

        card.dataset.availability =
            availability;


        /* =================================================
           PRODUCT CARD HTML
           ================================================= */

        card.innerHTML = `

            <div class="all-product-image">

                <img
                    src="${image}"
                    alt="${productName}"
                    onerror="this.src='/images/sulaiha-logo.jpeg';">

                <span class="all-stock-badge ${stockClass}">
                    ${availabilityText}
                </span>

            </div>


            <div class="all-product-info">

                <span class="all-product-category">
                    ${categoryText}
                </span>


                <h3>
                    ${productName}
                </h3>


                ${
                    sizeText
                        ? `
                            <span class="all-product-size">
                                Size: ${sizeText}
                            </span>
                          `
                        : ""
                }


                <p>
                    ${description}
                </p>


                <div class="all-product-bottom">

                    <strong>

                        ₹${price.toFixed(2)}

                        ${
                            unit
                                ? " / " + unit
                                : ""
                        }

                    </strong>


                    <button
                        type="button"
                        class="all-view-button"
                        data-product-id="${product.id}">

                        View Details

                    </button>

                </div>

            </div>

        `;


        return card;

    }


    /* =====================================================
       DISPLAY PRODUCTS
       ===================================================== */

    function displayProducts(productList) {

        productGrid.innerHTML = "";


        if (
            !productList ||
            productList.length === 0
        ) {

            if (productCount) {

                productCount.textContent =
                    "0";

            }


            if (noProductsMessage) {

                noProductsMessage.style.display =
                    "block";

            }

            return;
        }


        if (noProductsMessage) {

            noProductsMessage.style.display =
                "none";

        }


        productList.forEach(
            function (product) {

                const card =
                    createProductCard(
                        product
                    );


                productGrid.appendChild(
                    card
                );

            }
        );


        if (productCount) {

            productCount.textContent =
                productList.length;

        }

    }


    /* =====================================================
       FILTER PRODUCTS
       ===================================================== */

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
            products.filter(
                function (product) {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const category =
                        String(
                            product.category || ""
                        ).toLowerCase();


                    const price =
                        Number(
                            product.price || 0
                        );


                    const quantity =
                        Number(
                            product.quantity || 0
                        );


                    const status =
                        String(
                            product.status || ""
                        ).toLowerCase();


                    /* =====================================
                       SEARCH
                       ===================================== */

                    const matchesSearch =
                        name.includes(
                            searchText
                        ) ||
                        category.includes(
                            searchText
                        );


                    /* =====================================
                       CATEGORY
                       ===================================== */

                    const matchesCategory =
                        selectedCategory === "all" ||
                        category === selectedCategory;


                    /* =====================================
                       PRICE
                       ===================================== */

                    let matchesPrice = true;


                    if (
                        selectedPrice ===
                        "low"
                    ) {

                        matchesPrice =
                            price < 1000;

                    }

                    else if (
                        selectedPrice ===
                        "medium"
                    ) {

                        matchesPrice =
                            price >= 1000 &&
                            price <= 2500;

                    }

                    else if (
                        selectedPrice ===
                        "high"
                    ) {

                        matchesPrice =
                            price > 2500;

                    }


                    /* =====================================
                       AVAILABILITY
                       ===================================== */

                    const isAvailable =
                        quantity > 0 &&
                        status === "available";


                    const productAvailability =
                        isAvailable
                            ? "available"
                            : "unavailable";


                    const matchesAvailability =
                        selectedAvailability ===
                            "all" ||
                        productAvailability ===
                            selectedAvailability;


                    /* =====================================
                       FINAL RESULT
                       ===================================== */

                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesPrice &&
                        matchesAvailability
                    );

                }
            );


        displayProducts(
            filteredProducts
        );

    }


    /* =====================================================
       SEARCH EVENT
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    /* =====================================================
       CATEGORY EVENT
       ===================================================== */

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =====================================================
       PRICE EVENT
       ===================================================== */

    if (priceFilter) {

        priceFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =====================================================
       AVAILABILITY EVENT
       ===================================================== */

    if (availabilityFilter) {

        availabilityFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value = "";

                }


                if (categoryFilter) {

                    categoryFilter.value =
                        "all";

                }


                if (priceFilter) {

                    priceFilter.value =
                        "all";

                }


                if (availabilityFilter) {

                    availabilityFilter.value =
                        "all";

                }


                filterProducts();

            }
        );

    }


    /* =====================================================
       VIEW PRODUCT DETAILS
       ===================================================== */

    productGrid.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".all-view-button"
                );


            if (!button) {

                return;

            }


            const productId =
                button.dataset.productId;


            if (!productId) {

                console.error(
                    "Product ID not found."
                );

                return;

            }


            console.log(
                "Opening product:",
                productId
            );


            /*
             * Product Details page.
             *
             * Product ID is passed through URL.
             */

            window.location.href =
                "/product-details?productId="
                + encodeURIComponent(
                    productId
                );

        }
    );


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadProducts();


    /* =====================================================
       SUCCESS MESSAGE
       ===================================================== */

    console.log(
        "All Products JavaScript Loaded Successfully"
    );

});
