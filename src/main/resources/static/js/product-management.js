// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// PRODUCT MANAGEMENT PAGE JAVASCRIPT
// FINAL VERSION
// =====================================================


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let products = [];

let editingProductId = null;


// =====================================================
// DOM ELEMENTS
// =====================================================

const productTableBody =
    document.getElementById("productTableBody");

const productSearch =
    document.getElementById("productSearch");


// =====================================================
// SUMMARY ELEMENTS
// =====================================================

const totalProductsElement =
    document.getElementById("totalProducts");

const activeProductsElement =
    document.getElementById("activeProducts");

const inactiveProductsElement =
    document.getElementById("inactiveProducts");

const lowStockProductsElement =
    document.getElementById("lowStockProducts");


// =====================================================
// ADD PRODUCT MODAL
// =====================================================

const addProductModal =
    document.getElementById("addProductModal");

const addProductForm =
    document.getElementById("addProductForm");

const openAddProductModalButton =
    document.getElementById("openAddProductModal");

const closeAddProductModalButton =
    document.getElementById("closeAddProductModal");

const cancelAddProductButton =
    document.getElementById("cancelAddProduct");


// =====================================================
// ADD PRODUCT FIELDS
// =====================================================

const addProductName =
    document.getElementById("addProductName");

const addProductCategory =
    document.getElementById("addProductCategory");

const addProductPricingType =
    document.getElementById("addProductPricingType");

const addDimensionSection =
    document.getElementById("addDimensionSection");

const addProductLength =
    document.getElementById("addProductLength");

const addProductWidth =
    document.getElementById("addProductWidth");

const addProductDimensionUnit =
    document.getElementById("addProductDimensionUnit");

const addProductPrice =
    document.getElementById("addProductPrice");

const addProductUnit =
    document.getElementById("addProductUnit");

const addProductQuantity =
    document.getElementById("addProductQuantity");
if (addProductQuantity) {
    addProductQuantity.addEventListener("input", function () {
        // Keep the value empty while the user is typing.
        // Do not automatically convert it to 0.
        if (this.value !== "") {
            this.value = this.value.replace(/[^0-9]/g, "");
        }
    });
}
const addProductStatus =
    document.getElementById("addProductStatus");

const addProductImage =
    document.getElementById("addProductImage");

const addProductDescription =
    document.getElementById("addProductDescription");


// =====================================================
// EDIT PRODUCT MODAL
// =====================================================

const editProductModal =
    document.getElementById("editProductModal");

const editProductForm =
    document.getElementById("editProductForm");

const closeEditProductModalButton =
    document.getElementById("closeEditProductModal");

const cancelEditProductButton =
    document.getElementById("cancelEditProduct");


// =====================================================
// EDIT PRODUCT FIELDS
// =====================================================

const editProductId =
    document.getElementById("editProductId");

const editProductName =
    document.getElementById("editProductName");

const editProductCategory =
    document.getElementById("editProductCategory");

const editProductPricingType =
    document.getElementById("editProductPricingType");

const editDimensionSection =
    document.getElementById("editDimensionSection");

const editProductLength =
    document.getElementById("editProductLength");

const editProductWidth =
    document.getElementById("editProductWidth");

const editProductDimensionUnit =
    document.getElementById("editProductDimensionUnit");

const editProductPrice =
    document.getElementById("editProductPrice");

const editProductUnit =
    document.getElementById("editProductUnit");

const editProductQuantity =
    document.getElementById("editProductQuantity");

const editProductStatus =
    document.getElementById("editProductStatus");

const editProductImage =
    document.getElementById("editProductImage");

const editProductDescription =
    document.getElementById("editProductDescription");


// =====================================================
// VIEW PRODUCT MODAL
// =====================================================

const viewProductModal =
    document.getElementById("viewProductModal");

const closeViewProductModalButton =
    document.getElementById("closeViewProductModal");

const closeViewProductButton =
    document.getElementById("closeViewProductButton");

const productDetails =
    document.getElementById("productDetails");


// =====================================================
// DOM CONTENT LOADED
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupPricingTypeEvents();

        setupModalEvents();

        setupSearch();

        loadProducts();

        console.log(
            "Product Management initialized successfully."
        );

    }
);


// =====================================================
// CSRF TOKEN
// =====================================================

function getCsrfToken() {

    const csrfMeta =
        document.querySelector(
            'meta[name="_csrf"]'
        );

    if (!csrfMeta) {

        return null;

    }

    return csrfMeta.getAttribute("content");

}


// =====================================================
// CSRF HEADER
// =====================================================

function getCsrfHeader() {

    const csrfHeaderMeta =
        document.querySelector(
            'meta[name="_csrf_header"]'
        );

    if (!csrfHeaderMeta) {

        return "X-CSRF-TOKEN";

    }

    return csrfHeaderMeta.getAttribute("content");

}


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

    try {

        const response =
            await fetch("/api/admin/products");

        if (!response.ok) {

            throw new Error(
                "Failed to load products."
            );

        }


        products =
            await response.json();


        console.log(
            "Products loaded:",
            products
        );


        displayProducts(products);

        updateSummary();

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        if (productTableBody) {

            productTableBody.innerHTML = `

                <tr>

                    <td colspan="7"
                        style="text-align:center; padding:30px;">

                        Unable to load products.

                    </td>

                </tr>

            `;

        }

    }

}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts(productList) {

    if (!productTableBody) {

        console.error(
            "Product table body not found."
        );

        return;

    }


    productTableBody.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        productTableBody.innerHTML = `

            <tr>

                <td colspan="7"
                    style="text-align:center; padding:30px;">

                    No products found.

                </td>

            </tr>

        `;

        return;

    }


    productList.forEach(
        function (product, index) {


            const row =
                document.createElement("tr");


            const status =
                product.status || "unavailable";


            const statusText =
                formatStatus(status);


            const statusClass =
                status.toLowerCase() === "available"
                    ? "status-active"
                    : "status-inactive";


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    <strong>
                        ${escapeHtml(product.name || "-")}
                    </strong>
                </td>


                <td>
                    ${escapeHtml(product.category || "-")}
                </td>


                <td>
                    ₹${formatNumber(product.price)}
                    / ${escapeHtml(product.unit || "-")}
                </td>


                <td>
                    ${formatNumber(product.quantity)}
                </td>


                <td>

                    <span class="${statusClass}">
                        ${escapeHtml(statusText)}
                    </span>

                </td>


                <td>

                    <div class="product-action-buttons">


                        <button type="button"
                                class="view-product-action"
                                data-id="${product.id}">

                            View

                        </button>


                        <button type="button"
                                class="edit-product-action"
                                data-id="${product.id}">

                            Edit

                        </button>


                        <button type="button"
                                class="delete-product-action"
                                data-id="${product.id}">

                            Delete

                        </button>


                    </div>

                </td>

            `;


            productTableBody.appendChild(row);

        }
    );


    setupProductActionButtons();

}


// =====================================================
// PRODUCT ACTION BUTTONS
// =====================================================

function setupProductActionButtons() {


    const viewButtons =
        document.querySelectorAll(
            ".view-product-action"
        );


    viewButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        button.dataset.id;

                    viewProduct(id);

                }
            );

        }
    );


    const editButtons =
        document.querySelectorAll(
            ".edit-product-action"
        );


    editButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        button.dataset.id;

                    openEditProduct(id);

                }
            );

        }
    );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-product-action"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        button.dataset.id;

                    deleteProduct(id);

                }
            );

        }
    );

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummary() {


    if (!products) {

        return;

    }


    let total =
        products.length;


    let active =
        0;


    let inactive =
        0;


    let lowStock =
        0;


    products.forEach(
        function (product) {


            const status =
                String(
                    product.status || ""
                ).toLowerCase();


            if (status === "available") {

                active++;

            }

            else {

                inactive++;

            }


            const quantity =
                Number(
                    product.quantity
                ) || 0;


            const reorderLevel =
                Number(
                    product.reorderLevel
                ) || 0;


            if (
                quantity <= reorderLevel
            ) {

                lowStock++;

            }

        }
    );


    if (totalProductsElement) {

        totalProductsElement.textContent =
            total;

    }


    if (activeProductsElement) {

        activeProductsElement.textContent =
            active;

    }


    if (inactiveProductsElement) {

        inactiveProductsElement.textContent =
            inactive;

    }


    if (lowStockProductsElement) {

        lowStockProductsElement.textContent =
            lowStock;

    }

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    if (!productSearch) {

        return;

    }


    productSearch.addEventListener(
        "input",
        function () {

            const searchValue =
                productSearch.value
                    .trim()
                    .toLowerCase();


            if (!searchValue) {

                displayProducts(products);

                return;

            }


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


                        return (
                            name.includes(searchValue) ||
                            category.includes(searchValue)
                        );

                    }
                );


            displayProducts(
                filteredProducts
            );

        }
    );

}


// =====================================================
// PRICING TYPE EVENTS
// =====================================================

function setupPricingTypeEvents() {


    if (addProductPricingType) {

        addProductPricingType.addEventListener(
            "change",
            function () {

                toggleDimensionSection(
                    addProductPricingType,
                    addDimensionSection,
                    addProductLength,
                    addProductWidth,
                    addProductDimensionUnit
                );

            }
        );

    }


    if (editProductPricingType) {

        editProductPricingType.addEventListener(
            "change",
            function () {

                toggleDimensionSection(
                    editProductPricingType,
                    editDimensionSection,
                    editProductLength,
                    editProductWidth,
                    editProductDimensionUnit
                );

            }
        );

    }

}


// =====================================================
// TOGGLE DIMENSION SECTION
// =====================================================

function toggleDimensionSection(
    pricingTypeElement,
    dimensionSection,
    lengthElement,
    widthElement,
    dimensionUnitElement
) {


    if (!pricingTypeElement ||
        !dimensionSection) {

        return;

    }


    const pricingType =
        pricingTypeElement.value;


    if (
        pricingType === "DIMENSION"
    ) {

        dimensionSection.style.display =
            "block";


        if (lengthElement) {

            lengthElement.required =
                true;

        }


        if (widthElement) {

            widthElement.required =
                true;

        }


        if (dimensionUnitElement) {

            dimensionUnitElement.required =
                true;

        }

    }

    else {

        dimensionSection.style.display =
            "none";


        if (lengthElement) {

            lengthElement.required =
                false;

            lengthElement.value =
                "";

        }


        if (widthElement) {

            widthElement.required =
                false;

            widthElement.value =
                "";

        }


        if (dimensionUnitElement) {

            dimensionUnitElement.required =
                false;

            dimensionUnitElement.value =
                "";

        }

    }

}


// =====================================================
// MODAL EVENTS
// =====================================================

function setupModalEvents() {


    // -------------------------------------------------
    // ADD MODAL
    // -------------------------------------------------

    if (openAddProductModalButton) {

        openAddProductModalButton.addEventListener(
            "click",
            function () {

                openAddProduct();

            }
        );

    }


    if (closeAddProductModalButton) {

        closeAddProductModalButton.addEventListener(
            "click",
            function () {

                closeAddProduct();

            }
        );

    }


    if (cancelAddProductButton) {

        cancelAddProductButton.addEventListener(
            "click",
            function () {

                closeAddProduct();

            }
        );

    }


    // -------------------------------------------------
    // EDIT MODAL
    // -------------------------------------------------

    if (closeEditProductModalButton) {

        closeEditProductModalButton.addEventListener(
            "click",
            function () {

                closeEditProduct();

            }
        );

    }


    if (cancelEditProductButton) {

        cancelEditProductButton.addEventListener(
            "click",
            function () {

                closeEditProduct();

            }
        );

    }


    // -------------------------------------------------
    // VIEW MODAL
    // -------------------------------------------------

    if (closeViewProductModalButton) {

        closeViewProductModalButton.addEventListener(
            "click",
            function () {

                closeViewProduct();

            }
        );

    }


    if (closeViewProductButton) {

        closeViewProductButton.addEventListener(
            "click",
            function () {

                closeViewProduct();

            }
        );

    }


    // -------------------------------------------------
    // CLOSE WHEN CLICKING OUTSIDE MODAL
    // -------------------------------------------------

    window.addEventListener(
        "click",
        function (event) {


            if (
                event.target === addProductModal
            ) {

                closeAddProduct();

            }


            if (
                event.target === editProductModal
            ) {

                closeEditProduct();

            }


            if (
                event.target === viewProductModal
            ) {

                closeViewProduct();

            }

        }
    );


    // -------------------------------------------------
    // ESCAPE KEY
    // -------------------------------------------------

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeAddProduct();

                closeEditProduct();

                closeViewProduct();

            }

        }
    );

}


// =====================================================
// OPEN ADD PRODUCT
// =====================================================

function openAddProduct() {


    if (!addProductModal) {

        return;

    }


    if (addProductForm) {

        addProductForm.reset();

    }


    if (addDimensionSection) {

        addDimensionSection.style.display =
            "none";

    }


    if (addProductLength) {

        addProductLength.required =
            false;

    }


    if (addProductWidth) {

        addProductWidth.required =
            false;

    }


    if (addProductDimensionUnit) {

        addProductDimensionUnit.required =
            false;

    }


    addProductModal.style.display =
        "flex";

}


// =====================================================
// CLOSE ADD PRODUCT
// =====================================================

function closeAddProduct() {


    if (!addProductModal) {

        return;

    }


    addProductModal.style.display =
        "none";


    if (addProductForm) {

        addProductForm.reset();

    }


    if (addDimensionSection) {

        addDimensionSection.style.display =
            "none";

    }

}


// =====================================================
// OPEN EDIT PRODUCT
// =====================================================

async function openEditProduct(id) {


    try {


        const response =
            await fetch(
                `/api/admin/products/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Product not found."
            );

        }


        const product =
            await response.json();


        editingProductId =
            product.id;


        if (editProductId) {

            editProductId.value =
                product.id;

        }


        if (editProductName) {

            editProductName.value =
                product.name || "";

        }


        if (editProductCategory) {

            editProductCategory.value =
                product.category || "";

        }


        // -------------------------------------------------
        // PRICING TYPE
        // -------------------------------------------------

        if (editProductPricingType) {

            editProductPricingType.value =
                product.pricingType || "UNIT";

        }


        // -------------------------------------------------
        // DIMENSIONS
        // -------------------------------------------------

        if (editProductLength) {

            editProductLength.value =
                product.length || "";

        }


        if (editProductWidth) {

            editProductWidth.value =
                product.width || "";

        }


        if (editProductDimensionUnit) {

            editProductDimensionUnit.value =
                product.dimensionUnit || "";

        }


        toggleDimensionSection(
            editProductPricingType,
            editDimensionSection,
            editProductLength,
            editProductWidth,
            editProductDimensionUnit
        );


        // -------------------------------------------------
        // PRICE
        // -------------------------------------------------

        if (editProductPrice) {

            editProductPrice.value =
                product.price ?? "";

        }


        // -------------------------------------------------
        // UNIT
        // -------------------------------------------------

        if (editProductUnit) {

            editProductUnit.value =
                product.unit || "";

        }


        // -------------------------------------------------
        // QUANTITY
        // -------------------------------------------------

        if (editProductQuantity) {

            editProductQuantity.value =
                product.quantity ?? "";

        }


        // -------------------------------------------------
        // STATUS
        // -------------------------------------------------

        if (editProductStatus) {

            editProductStatus.value =
                product.status || "available";

        }


        // -------------------------------------------------
        // IMAGE
        // -------------------------------------------------

        if (editProductImage) {

            editProductImage.value =
                product.image || "";

        }


        // -------------------------------------------------
        // DESCRIPTION
        // -------------------------------------------------

        if (editProductDescription) {

            editProductDescription.value =
                product.description || "";

        }


        if (editProductModal) {

            editProductModal.style.display =
                "flex";

        }

    }

    catch (error) {

        console.error(
            "Error opening product:",
            error
        );


        alert(
            "Unable to load product details."
        );

    }

}


// =====================================================
// CLOSE EDIT PRODUCT
// =====================================================

function closeEditProduct() {


    if (!editProductModal) {

        return;

    }


    editProductModal.style.display =
        "none";


    editingProductId =
        null;


    if (editProductForm) {

        editProductForm.reset();

    }


    if (editDimensionSection) {

        editDimensionSection.style.display =
            "none";

    }

}


// =====================================================
// ADD PRODUCT SUBMIT
// =====================================================

if (addProductForm) {

    addProductForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // -------------------------------------------------
            // PRICING TYPE
            // -------------------------------------------------

            const pricingType =
                addProductPricingType
                    ? addProductPricingType.value
                    : "UNIT";


            // -------------------------------------------------
            // VALIDATE DIMENSION
            // -------------------------------------------------

            if (
                pricingType === "DIMENSION"
            ) {


                const length =
                    Number(
                        addProductLength?.value
                    );


                const width =
                    Number(
                        addProductWidth?.value
                    );


                const dimensionUnit =
                    addProductDimensionUnit
                        ? addProductDimensionUnit.value
                        : "";


                if (
                    !length ||
                    length <= 0 ||
                    !width ||
                    width <= 0 ||
                    !dimensionUnit
                ) {

                    alert(
                        "Please enter valid product dimensions."
                    );

                    return;

                }

            }


            // -------------------------------------------------
            // CREATE PRODUCT DATA
            // -------------------------------------------------

            const productData = {

                name:
                    addProductName.value.trim(),

                category:
                    addProductCategory.value,

                price:
                    Number(addProductPrice.value) || 0,

                quantity: addProductQuantity.value === ""
    ? 0
    : Number(addProductQuantity.value),


                status:
                    addProductStatus.value,

                unit:
                    addProductUnit.value,

                image:
                    addProductImage.value.trim(),

                description:
                    addProductDescription.value.trim(),


                // NEW MEASUREMENT FIELDS

                pricingType:
                    pricingType,

                length:
                    pricingType === "DIMENSION"
                        ? Number(addProductLength.value)
                        : 0,

                width:
                    pricingType === "DIMENSION"
                        ? Number(addProductWidth.value)
                        : 0,

                dimensionUnit:
                    pricingType === "DIMENSION"
                        ? addProductDimensionUnit.value
                        : null

            };


            try {


                const csrfToken =
                    getCsrfToken();


                const headers = {

                    "Content-Type":
                        "application/json"

                };


                if (csrfToken) {

                    headers[
                        getCsrfHeader()
                    ] =
                        csrfToken;

                }


                const response =
                    await fetch(
                        "/api/admin/products",
                        {
                            method: "POST",
                            headers: headers,
                            body:
                                JSON.stringify(
                                    productData
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Add product error:",
                        errorText
                    );


                    throw new Error(
                        "Failed to add product."
                    );

                }


                const savedProduct =
                    await response.json();


                console.log(
                    "Product added:",
                    savedProduct
                );


                alert(
                    "Product added successfully."
                );


                closeAddProduct();


                await loadProducts();

            }

            catch (error) {

                console.error(
                    "Error adding product:",
                    error
                );


                alert(
                    "Unable to add product. Please try again."
                );

            }

        }
    );

}


// =====================================================
// EDIT PRODUCT SUBMIT
// =====================================================

if (editProductForm) {

    editProductForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!editingProductId) {

                alert(
                    "Product ID not found."
                );

                return;

            }


            // -------------------------------------------------
            // PRICING TYPE
            // -------------------------------------------------

            const pricingType =
                editProductPricingType
                    ? editProductPricingType.value
                    : "UNIT";


            // -------------------------------------------------
            // VALIDATE DIMENSION
            // -------------------------------------------------

            if (
                pricingType === "DIMENSION"
            ) {


                const length =
                    Number(
                        editProductLength?.value
                    );


                const width =
                    Number(
                        editProductWidth?.value
                    );


                const dimensionUnit =
                    editProductDimensionUnit
                        ? editProductDimensionUnit.value
                        : "";


                if (
                    !length ||
                    length <= 0 ||
                    !width ||
                    width <= 0 ||
                    !dimensionUnit
                ) {

                    alert(
                        "Please enter valid product dimensions."
                    );

                    return;

                }

            }


            // -------------------------------------------------
            // CREATE UPDATED PRODUCT DATA
            // -------------------------------------------------

            const productData = {

                name:
                    editProductName.value.trim(),

                category:
                    editProductCategory.value,

                price:
                    Number(editProductPrice.value) || 0,

               quantity: editProductQuantity.value === ""
    ? 0
    : Number(editProductQuantity.value),


                status:
                    editProductStatus.value,

                unit:
                    editProductUnit.value,

                image:
                    editProductImage.value.trim(),

                description:
                    editProductDescription.value.trim(),


                // NEW MEASUREMENT FIELDS

                pricingType:
                    pricingType,

                length:
                    pricingType === "DIMENSION"
                        ? Number(editProductLength.value)
                        : 0,

                width:
                    pricingType === "DIMENSION"
                        ? Number(editProductWidth.value)
                        : 0,

                dimensionUnit:
                    pricingType === "DIMENSION"
                        ? editProductDimensionUnit.value
                        : null

            };


            try {


                const csrfToken =
                    getCsrfToken();


                const headers = {

                    "Content-Type":
                        "application/json"

                };


                if (csrfToken) {

                    headers[
                        getCsrfHeader()
                    ] =
                        csrfToken;

                }


                const response =
                    await fetch(
                        `/api/admin/products/${editingProductId}`,
                        {
                            method: "PUT",
                            headers: headers,
                            body:
                                JSON.stringify(
                                    productData
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Update product error:",
                        errorText
                    );


                    throw new Error(
                        "Failed to update product."
                    );

                }


                const updatedProduct =
                    await response.json();


                console.log(
                    "Product updated:",
                    updatedProduct
                );


                alert(
                    "Product updated successfully."
                );


                closeEditProduct();


                await loadProducts();

            }

            catch (error) {

                console.error(
                    "Error updating product:",
                    error
                );


                alert(
                    "Unable to update product. Please try again."
                );

            }

        }
    );

}


// =====================================================
// VIEW PRODUCT
// =====================================================

async function viewProduct(id) {


    try {


        const response =
            await fetch(
                `/api/admin/products/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Product not found."
            );

        }


        const product =
            await response.json();


        displayProductDetails(
            product
        );


        if (viewProductModal) {

            viewProductModal.style.display =
                "flex";

        }

    }

    catch (error) {

        console.error(
            "Error viewing product:",
            error
        );


        alert(
            "Unable to load product details."
        );

    }

}


// =====================================================
// DISPLAY PRODUCT DETAILS
// =====================================================

function displayProductDetails(product) {


    if (!productDetails) {

        return;

    }


    const pricingType =
        product.pricingType || "UNIT";


    let measurementHtml =
        "";


    if (
        pricingType === "DIMENSION"
    ) {


        const length =
            Number(product.length) || 0;


        const width =
            Number(product.width) || 0;


        const dimensionUnit =
            product.dimensionUnit || "ft";


        let area =
            length * width;


        if (
            dimensionUnit === "inch"
        ) {

            area =
                area / 144;

        }


        measurementHtml = `

            <div class="product-detail-row">

                <strong>
                    Pricing Type
                </strong>

                <span>
                    Dimension Based
                </span>

            </div>


            <div class="product-detail-row">

                <strong>
                    Size
                </strong>

                <span>
                    ${formatNumber(length)}
                    ×
                    ${formatNumber(width)}
                    ${escapeHtml(dimensionUnit)}
                </span>

            </div>


            <div class="product-detail-row">

                <strong>
                    Area Per Unit
                </strong>

                <span>
                    ${formatNumber(area)}
                    sq.ft
                </span>

            </div>


            <div class="product-detail-row">

                <strong>
                    Rate
                </strong>

                <span>
                    ₹${formatNumber(product.price)}
                    / ${escapeHtml(product.unit || "sq.ft")}
                </span>

            </div>

        `;

    }

    else {

        measurementHtml = `

            <div class="product-detail-row">

                <strong>
                    Pricing Type
                </strong>

                <span>
                    Unit Based
                </span>

            </div>


            <div class="product-detail-row">

                <strong>
                    Unit
                </strong>

                <span>
                    ${escapeHtml(product.unit || "-")}
                </span>

            </div>


            <div class="product-detail-row">

                <strong>
                    Price
                </strong>

                <span>
                    ₹${formatNumber(product.price)}
                    / ${escapeHtml(product.unit || "unit")}
                </span>

            </div>

        `;

    }


    productDetails.innerHTML = `

        <div class="product-detail-row">

            <strong>
                Product ID
            </strong>

            <span>
                ${product.id}
            </span>

        </div>


        <div class="product-detail-row">

            <strong>
                Product Name
            </strong>

            <span>
                ${escapeHtml(product.name || "-")}
            </span>

        </div>


        <div class="product-detail-row">

            <strong>
                Category
            </strong>

            <span>
                ${escapeHtml(product.category || "-")}
            </span>

        </div>


        ${measurementHtml}


        <div class="product-detail-row">

            <strong>
                Quantity
            </strong>

            <span>
                ${formatNumber(product.quantity)}
            </span>

        </div>


        <div class="product-detail-row">

            <strong>
                Status
            </strong>

            <span>
                ${escapeHtml(
                    formatStatus(
                        product.status
                    )
                )}
            </span>

        </div>


        <div class="product-detail-row">

            <strong>
                Description
            </strong>

            <span>
                ${escapeHtml(
                    product.description || "-"
                )}
            </span>

        </div>

    `;

}


// =====================================================
// CLOSE VIEW PRODUCT
// =====================================================

function closeViewProduct() {


    if (!viewProductModal) {

        return;

    }


    viewProductModal.style.display =
        "none";

}


// =====================================================
// DELETE PRODUCT
// =====================================================

async function deleteProduct(id) {


    const product =
        products.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete ${product.name}?`
        );


    if (!confirmed) {

        return;

    }


    try {


        const csrfToken =
            getCsrfToken();


        const headers = {};


        if (csrfToken) {

            headers[
                getCsrfHeader()
            ] =
                csrfToken;

        }


        const response =
            await fetch(
                `/api/admin/products/${id}`,
                {
                    method: "DELETE",
                    headers: headers
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete product."
            );

        }


        alert(
            "Product deleted successfully."
        );


        await loadProducts();

    }

    catch (error) {

        console.error(
            "Error deleting product:",
            error
        );


        alert(
            "Unable to delete product. Please try again."
        );

    }

}


// =====================================================
// FORMAT NUMBER
// =====================================================

function formatNumber(value) {

    const number =
        Number(value);


    if (isNaN(number)) {

        return "0";

    }


    return number.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

}


// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(status) {


    if (!status) {

        return "Unavailable";

    }


    const normalized =
        String(status)
            .toLowerCase();


    if (
        normalized === "available"
    ) {

        return "Available";

    }


    if (
        normalized === "unavailable"
    ) {

        return "Unavailable";

    }


    return String(status);

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {


    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// ADMIN LOGOUT CONFIRMATION
// =====================================================

function setupAdminLogoutConfirm() {


    const logoutLinks =
        document.querySelectorAll(
            'a[href="/logout"]'
        );


    logoutLinks.forEach(
        function (logoutLink) {

            logoutLink.addEventListener(
                "click",
                function (event) {

                    const confirmed =
                        confirm(
                            "Are you sure you want to logout?"
                        );


                    if (!confirmed) {

                        event.preventDefault();

                    }

                }
            );

        }
    );

}


// =====================================================
// INITIALIZE LOGOUT CONFIRMATION
// =====================================================

setupAdminLogoutConfirm();


// =====================================================
// FINAL CONSOLE MESSAGE
// =====================================================

console.log(
    "Sulaiha Product Management JavaScript Loaded Successfully"
);