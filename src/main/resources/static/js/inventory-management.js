// =====================================================
// SULAIHA SMART MANAGEMENT SYSTEM
// INVENTORY MANAGEMENT JAVASCRIPT
// FINAL VERSION - PART 1
// =====================================================


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let inventoryData = [];

let selectedInventoryId = null;


// =====================================================
// DOM ELEMENTS
// =====================================================

const table =
    document.getElementById("inventoryTableBody");

const empty =
    document.getElementById("inventoryEmptyState");

const total =
    document.getElementById("totalInventoryProducts");

const inStock =
    document.getElementById("inStockProducts");

const lowStock =
    document.getElementById("lowStockProducts");

const outStock =
    document.getElementById("outOfStockProducts");


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Inventory Management JS Loaded"
        );


        loadInventory();

        setupSearch();

        setupFilter();

        setupEditForm();

        setupModalEvents();
setupAdminLogoutConfirm()
    }
);


// =====================================================
// LOAD INVENTORY
// =====================================================

async function loadInventory() {

    try {

        const response =
            await fetch(
                "/api/admin/products"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load inventory data"
            );

        }


        const products =
            await response.json();


        console.log(
            "Products loaded:",
            products
        );


        /*
         * IMPORTANT:
         *
         * Database ID is stored exactly.
         * We never change the ID.
         *
         * The display serial number will be
         * generated separately inside displayInventory().
         */


        inventoryData =
            products.map(
                function (product) {

                    return {

                        id:
                            product.id,

                        product:
                            product.name ??
                            "",

                        category:
                            product.category ??
                            "",

                        quantity:
                            Number(
                                product.quantity
                            ) || 0,

                        reorderLevel:
                            Number(
                                product.reorderLevel
                            ) || 0,

                        /*
                         * Keep original values too.
                         * These help us preserve product
                         * information during UPDATE.
                         */

                        name:
                            product.name ??
                            "",

                        price:
                            product.price ??
                            0,

                        description:
                            product.description ??
                            "",

                        image:
                            product.image ??
                            "",

                        status:
                            product.status ??
                            "ACTIVE",

                        unit:
                            product.unit ??
                            ""

                    };

                }
            );


        updateSummary();

        displayInventory(
            inventoryData
        );

    }

    catch (error) {

        console.error(
            "Error loading inventory:",
            error
        );


        inventoryData = [];


        updateSummary();

        showEmptyState();

    }

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummary() {

    const totalCount =
        inventoryData.length;


    const inStockCount =
        inventoryData.filter(
            function (item) {

                return (
                    getStatus(item) ===
                    "IN_STOCK"
                );

            }
        ).length;


    const lowStockCount =
        inventoryData.filter(
            function (item) {

                return (
                    getStatus(item) ===
                    "LOW_STOCK"
                );

            }
        ).length;


    const outOfStockCount =
        inventoryData.filter(
            function (item) {

                return (
                    getStatus(item) ===
                    "OUT_OF_STOCK"
                );

            }
        ).length;


    if (total) {

        total.textContent =
            totalCount;

    }


    if (inStock) {

        inStock.textContent =
            inStockCount;

    }


    if (lowStock) {

        lowStock.textContent =
            lowStockCount;

    }


    if (outStock) {

        outStock.textContent =
            outOfStockCount;

    }

}


// =====================================================
// GET STATUS
// =====================================================

function getStatus(item) {

    const quantity =
        Number(item.quantity) || 0;


    const reorderLevel =
        Number(item.reorderLevel) || 0;


    if (quantity <= 0) {

        return "OUT_OF_STOCK";

    }


    if (
        quantity <=
        reorderLevel
    ) {

        return "LOW_STOCK";

    }


    return "IN_STOCK";

}


// =====================================================
// SHOW EMPTY STATE
// =====================================================

function showEmptyState() {

    if (table) {

        table.innerHTML = "";

    }


    if (empty) {

        empty.style.display =
            "block";

    }

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

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
// =====================================================
// PART 2
// SEARCH + FILTER + DISPLAY INVENTORY
// =====================================================


// =====================================================
// DISPLAY INVENTORY
// =====================================================

function displayInventory(data) {

    if (!table) {

        console.error(
            "Inventory table body not found."
        );

        return;

    }


    table.innerHTML = "";


    // =================================================
    // EMPTY DATA
    // =================================================

    if (
        !data ||
        data.length === 0
    ) {

        if (empty) {

            empty.style.display =
                "block";

        }


        updateSummary();

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    // =================================================
    // UPDATE SUMMARY
    // =================================================

    updateSummary();


    // =================================================
    // DISPLAY TABLE
    // =================================================

    data.forEach(
        function (item, index) {

            const row =
                document.createElement("tr");


            const status =
                getStatus(item);


            const statusClass =
                status
                    .toLowerCase()
                    .replace(
                        /_/g,
                        "-"
                    );


            const statusText =
                status.replace(
                    /_/g,
                    " "
                );


            // =================================================
            // SERIAL NUMBER
            // =================================================
            //
            // IMPORTANT:
            // This is ONLY for display.
            //
            // Database ID is NOT changed.
            //
            // Actual ID remains:
            // item.id
            //
            // Display becomes:
            // 1, 2, 3, 4...
            // =================================================

            const serialNumber =
                index + 1;


            row.innerHTML = `

                <td>
                    ${serialNumber}
                </td>


                <td>

                    <span class="inventory-product-name">

                        ${escapeHtml(
                            item.product
                        )}

                    </span>

                </td>


                <td>

                    <span class="inventory-category">

                        ${escapeHtml(
                            item.category
                        )}

                    </span>

                </td>


                <td>

                    <span class="inventory-quantity">

                        ${item.quantity}

                    </span>

                </td>


                <td>

                    ${item.reorderLevel}

                </td>


                <td>

                    <span
                        class="inventory-status ${statusClass}"
                    >

                        ${statusText}

                    </span>

                </td>


                <td>

                    <div class="inventory-actions">


                        <!-- VIEW -->

                        <button
                            type="button"
                            class="
                                inventory-action-button
                                inventory-view-button
                            "
                            onclick="
                                viewInventory(${item.id})
                            "
                        >

                            View

                        </button>


                        <!-- UPDATE -->

                        <button
                            type="button"
                            class="
                                inventory-action-button
                                inventory-edit-button
                            "
                            onclick="
                                editInventory(${item.id})
                            "
                        >

                            Update

                        </button>


                        <!-- DELETE -->

                        <button
                            type="button"
                            class="
                                inventory-action-button
                                inventory-delete-button
                            "
                            onclick="
                                deleteInventory(${item.id})
                            "
                        >

                            Delete

                        </button>


                    </div>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// =====================================================
// SEARCH SETUP
// =====================================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "inventorySearch"
        );


    if (!searchInput) {

        console.error(
            "Inventory search input not found."
        );

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            applySearchAndFilter();

        }
    );

}


// =====================================================
// FILTER SETUP
// =====================================================

function setupFilter() {

    const filter =
        document.getElementById(
            "inventoryStatusFilter"
        );


    if (!filter) {

        console.error(
            "Inventory status filter not found."
        );

        return;

    }


    filter.addEventListener(
        "change",
        function () {

            applySearchAndFilter();

        }
    );

}


// =====================================================
// SEARCH + FILTER
// =====================================================

function applySearchAndFilter() {

    const searchInput =
        document.getElementById(
            "inventorySearch"
        );


    const filter =
        document.getElementById(
            "inventoryStatusFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        filter
            ? filter.value
            : "ALL";


    // =================================================
    // FILTER INVENTORY
    // =================================================

    const filteredData =
        inventoryData.filter(
            function (item) {


                // =====================================
                // PRODUCT NAME
                // =====================================

                const product =
                    String(
                        item.product || ""
                    )
                    .toLowerCase();


                // =====================================
                // CATEGORY
                // =====================================

                const category =
                    String(
                        item.category || ""
                    )
                    .toLowerCase();


                // =====================================
                // DATABASE ID
                // =====================================

                const id =
                    String(
                        item.id || ""
                    )
                    .toLowerCase();


                // =====================================
                // SEARCH MATCH
                // =====================================

                const searchMatch =
                    searchText === "" ||

                    product.includes(
                        searchText
                    ) ||

                    category.includes(
                        searchText
                    ) ||

                    id.includes(
                        searchText
                    );


                // =====================================
                // STATUS MATCH
                // =====================================

                const status =
                    getStatus(item);


                const statusMatch =
                    selectedStatus === "ALL" ||

                    status ===
                        selectedStatus;


                // =====================================
                // FINAL MATCH
                // =====================================

                return (
                    searchMatch &&
                    statusMatch
                );

            }
        );


    // =================================================
    // DISPLAY FILTERED DATA
    // =================================================

    displayInventory(
        filteredData
    );

}


// =====================================================
// SEARCH RESET HELPER
// =====================================================

function resetInventorySearch() {

    const searchInput =
        document.getElementById(
            "inventorySearch"
        );


    const filter =
        document.getElementById(
            "inventoryStatusFilter"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    if (filter) {

        filter.value = "ALL";

    }


    displayInventory(
        inventoryData
    );

}
// =====================================================
// PART 3
// VIEW + UPDATE + DELETE
// =====================================================


// =====================================================
// VIEW INVENTORY
// =====================================================

function viewInventory(id) {

    const item =
        inventoryData.find(
            function (inventory) {

                return Number(inventory.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Inventory item not found."
        );

        return;

    }


    const details =
        document.getElementById(
            "inventoryDetails"
        );


    if (!details) {

        console.error(
            "Inventory details container not found."
        );

        return;

    }


    const status =
        getStatus(item);


    details.innerHTML = `

        <div class="inventory-detail-row">

            <span>
                Product
            </span>

            <strong>
                ${escapeHtml(item.product)}
            </strong>

        </div>


        <div class="inventory-detail-row">

            <span>
                Category
            </span>

            <strong>
                ${escapeHtml(item.category)}
            </strong>

        </div>


        <div class="inventory-detail-row">

            <span>
                Quantity
            </span>

            <strong>
                ${item.quantity}
            </strong>

        </div>


        <div class="inventory-detail-row">

            <span>
                Reorder Level
            </span>

            <strong>
                ${item.reorderLevel}
            </strong>

        </div>


        <div class="inventory-detail-row">

            <span>
                Status
            </span>

            <strong>
                ${status.replace(
                    /_/g,
                    " "
                )}

            </strong>

        </div>

    `;


    openInventoryModal(
        "viewInventoryModal"
    );

}


// =====================================================
// EDIT / UPDATE MODAL
// =====================================================

function editInventory(id) {

    const item =
        inventoryData.find(
            function (inventory) {

                return Number(inventory.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Inventory item not found."
        );

        return;

    }


    selectedInventoryId =
        Number(item.id);


    const idInput =
        document.getElementById(
            "editInventoryId"
        );


    const productInput =
        document.getElementById(
            "editInventoryProduct"
        );


    const quantityInput =
        document.getElementById(
            "editInventoryQuantity"
        );


    const reorderInput =
        document.getElementById(
            "editInventoryReorderLevel"
        );


    /*
     * IMPORTANT:
     *
     * Database ID is only placed in the hidden
     * field so that we know which product to update.
     *
     * We NEVER change the database ID.
     */


    if (idInput) {

        idInput.value =
            item.id;

    }


    /*
     * Preserve the original product name.
     */

    if (productInput) {

        productInput.value =
            item.name ||
            item.product ||
            "";

    }


    /*
     * Preserve the existing quantity.
     */

    if (quantityInput) {

        quantityInput.value =
            Number(
                item.quantity
            ) || 0;

    }


    /*
     * Preserve the existing reorder level.
     */

    if (reorderInput) {

        reorderInput.value =
            Number(
                item.reorderLevel
            ) || 0;

    }


    openInventoryModal(
        "editStockModal"
    );

}


// =====================================================
// UPDATE INVENTORY
// =====================================================

function setupEditForm() {

    const form =
        document.getElementById(
            "editStockForm"
        );


    if (!form) {

        console.error(
            "Edit inventory form not found."
        );

        return;

    }


    /*
     * Prevent duplicate event listeners.
     */

    if (
        form.dataset.inventoryUpdateReady ===
        "true"
    ) {

        return;

    }


    form.dataset.inventoryUpdateReady =
        "true";


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =========================================
            // GET ID
            // =========================================

            const id =
                document.getElementById(
                    "editInventoryId"
                ).value;


            // =========================================
            // GET FORM VALUES
            // =========================================

            const productInput =
                document.getElementById(
                    "editInventoryProduct"
                );


            const quantityInput =
                document.getElementById(
                    "editInventoryQuantity"
                );


            const reorderInput =
                document.getElementById(
                    "editInventoryReorderLevel"
                );


            const productName =
                productInput
                    ? productInput.value.trim()
                    : "";


            const quantity =
                quantityInput
                    ? Number(
                        quantityInput.value
                    )
                    : NaN;


            const reorderLevel =
                reorderInput
                    ? Number(
                        reorderInput.value
                    )
                    : NaN;


            // =========================================
            // VALIDATION
            // =========================================

            if (!id) {

                alert(
                    "Inventory ID is missing."
                );

                return;

            }


            if (!productName) {

                alert(
                    "Product name is required."
                );

                return;

            }


            if (
                !Number.isFinite(quantity) ||
                quantity < 0
            ) {

                alert(
                    "Please enter a valid quantity."
                );

                return;

            }


            if (
                !Number.isFinite(reorderLevel) ||
                reorderLevel < 0
            ) {

                alert(
                    "Please enter a valid reorder level."
                );

                return;

            }


            // =========================================
            // FIND ORIGINAL ITEM
            // =========================================

            const currentItem =
                inventoryData.find(
                    function (item) {

                        return Number(item.id) ===
                            Number(id);

                    }
                );


            if (!currentItem) {

                alert(
                    "Inventory item not found."
                );

                return;

            }


            // =========================================
            // PRESERVE ORIGINAL DATA
            // =========================================
            //
            // We keep all existing product fields.
            // Only editable values are changed.
            //
            // MOST IMPORTANT:
            // ID remains exactly the same.
            // =========================================

            const updatedProduct = {

                id:
                    currentItem.id,

                name:
                    productName,

                category:
                    currentItem.category === "-"
                        ? ""
                        : currentItem.category,

                description:
                    currentItem.description || "",

                price:
                    Number(
                        currentItem.price
                    ) || 0,

                image:
                    currentItem.image || "",

                quantity:
                    quantity,

                reorderLevel:
                    reorderLevel,

                status:
                    currentItem.status ||
                    "ACTIVE",

                unit:
                    currentItem.unit || ""

            };


            console.log(
                "Updating product:",
                updatedProduct
            );


            // =========================================
            // DISABLE SAVE BUTTON
            // =========================================

            const saveButton =
                form.querySelector(
                    ".inventory-save-button"
                );


            if (saveButton) {

                saveButton.disabled =
                    true;

                saveButton.textContent =
                    "Updating...";

            }


            // =========================================
            // SEND UPDATE REQUEST
            // =========================================

            try {

                const response =
                    await fetch(
                        "/api/admin/products/" +
                        id,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    updatedProduct
                                )

                        }
                    );


                // =====================================
                // HANDLE SERVER ERROR
                // =====================================

                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Update failed:",
                        response.status,
                        errorText
                    );


                    throw new Error(
                        "Update failed"
                    );

                }


                // =====================================
                // CLOSE MODAL
                // =====================================

                closeInventoryModal(
                    "editStockModal"
                );


                selectedInventoryId =
                    null;


                // =====================================
                // RELOAD FROM DATABASE
                // =====================================

                await loadInventory();


                // =====================================
                // SUCCESS MESSAGE
                // =====================================

                alert(
                    "Inventory updated successfully."
                );

            }

            catch (error) {

                console.error(
                    "Error updating inventory:",
                    error
                );


                alert(
                    "Unable to update inventory."
                );

            }

            finally {

                // =====================================
                // ENABLE SAVE BUTTON
                // =====================================

                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Save Changes";

                }

            }

        }
    );

}


// =====================================================
// DELETE INVENTORY
// =====================================================

async function deleteInventory(id) {

    const item =
        inventoryData.find(
            function (inventory) {

                return Number(inventory.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Inventory item not found."
        );

        return;

    }


    const productName =
        item.name ||
        item.product ||
        "this product";


    const confirmed =
        window.confirm(
            "Are you sure you want to delete " +
            productName +
            "?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/admin/products/" +
                id,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Delete failed:",
                response.status,
                errorText
            );


            throw new Error(
                "Delete failed"
            );

        }


        // =========================================
        // RELOAD DATA FROM DATABASE
        // =========================================

        await loadInventory();


        alert(
            "Inventory item deleted successfully."
        );

    }

    catch (error) {

        console.error(
            "Error deleting inventory:",
            error
        );


        alert(
            "Unable to delete inventory item."
        );

    }

}
// =====================================================
// PART 4
// MODAL EVENTS + ESCAPE KEY
// =====================================================


// =====================================================
// OPEN INVENTORY MODAL
// =====================================================

function openInventoryModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        console.error(
            "Modal not found:",
            id
        );

        return;

    }


    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    // Prevent background scrolling
    document.body.style.overflow =
        "hidden";

}


// =====================================================
// CLOSE INVENTORY MODAL
// =====================================================

function closeInventoryModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {

        return;

    }


    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    // Clear selected inventory item
    if (
        id === "editStockModal"
    ) {

        selectedInventoryId =
            null;

    }


    // Restore background scrolling
    const openModals =
        document.querySelectorAll(
            ".inventory-modal.show"
        );


    if (
        openModals.length === 0
    ) {

        document.body.style.overflow =
            "";

    }

}


// =====================================================
// SETUP MODAL EVENTS
// =====================================================

function setupModalEvents() {

    const modals =
        document.querySelectorAll(
            ".inventory-modal"
        );


    if (!modals.length) {

        console.warn(
            "No inventory modals found."
        );

        return;

    }


    modals.forEach(
        function (modal) {

            /*
             * Prevent duplicate listeners
             */

            if (
                modal.dataset.eventsReady ===
                "true"
            ) {

                return;

            }


            modal.dataset.eventsReady =
                "true";


            // =========================================
            // CLICK OUTSIDE MODAL CONTENT
            // =========================================

            modal.addEventListener(
                "click",
                function (event) {

                    /*
                     * Close only when the user clicks
                     * the dark background.
                     *
                     * Clicking inside the modal content
                     * will NOT close it.
                     */

                    if (
                        event.target === modal
                    ) {

                        closeInventoryModal(
                            modal.id
                        );

                    }

                }
            );

        }
    );

}


// =====================================================
// ESCAPE KEY
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        const openModals =
            document.querySelectorAll(
                ".inventory-modal.show"
            );


        if (
            openModals.length === 0
        ) {

            return;

        }


        /*
         * Close every currently open
         * inventory modal.
         */

        openModals.forEach(
            function (modal) {

                closeInventoryModal(
                    modal.id
                );

            }
        );

    }
);
/* =====================================================
   CONFIRM LOGOUT
   ===================================================== */

function setupAdminLogoutConfirm() {

    const confirmButton =
        getAdminLogoutElement(
            "adminLogoutConfirmButton"
        );

    if (!confirmButton) {
        return;
    }

    confirmButton.addEventListener(
        "click",
        function () {

            hideAdminLogoutMessage();

            showAdminLogoutMessage(
                "Logging out..."
            );

            confirmButton.disabled = true;

            /*
             * Spring Security logout
             *
             * Logout must be sent using POST.
             * GET /logout causes 404.
             */

            const logoutForm =
                document.createElement("form");

            logoutForm.method = "POST";

            logoutForm.action = "/logout";

            logoutForm.style.display = "none";

            document.body.appendChild(
                logoutForm
            );

            logoutForm.submit();

        }
    );

}


// =====================================================
// FINAL INITIALIZATION MESSAGE
// =====================================================

console.log(
    "Inventory Management JS initialized successfully."
);
