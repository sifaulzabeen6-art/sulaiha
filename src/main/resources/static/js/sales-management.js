/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   SALES MANAGEMENT
   FINAL JAVASCRIPT - PART 1
   ===================================================== */

"use strict";


/* =====================================================
   GLOBAL SALES DATA
   ===================================================== */

let allSales = [];

let filteredSales = [];

let selectedSaleId = null;


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const salesTableBody =
    document.getElementById("salesTableBody");

const salesEmptyState =
    document.getElementById("salesEmptyState");

const totalSalesElement =
    document.getElementById("totalSales");

const todaySalesElement =
    document.getElementById("todaySales");

const monthlySalesElement =
    document.getElementById("monthlySales");

const totalSalesOrdersElement =
    document.getElementById("totalSalesOrders");

const salesSearch =
    document.getElementById("salesSearch");

const paymentStatusFilter =
    document.getElementById("paymentStatusFilter");

const salesDateFilter =
    document.getElementById("salesDateFilter");

const clearSalesFilters =
    document.getElementById("clearSalesFilters");


/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeSalesPage();
setupAdminLogoutConfirm();
});


/* =====================================================
   INITIALIZE SALES PAGE
   ===================================================== */

function initializeSalesPage() {

    initializeSidebar();

    initializeFilters();

    initializeSalesForms();

    loadSales();

}


/* =====================================================
   LOAD SALES FROM BACKEND
   ===================================================== */

async function loadSales() {

    try {

        const response =
            await fetch("/api/admin/sales", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });


        if (!response.ok) {

            throw new Error(
                "Failed to load sales."
            );

        }


        const sales =
            await response.json();


        /*
         * Store real backend data.
         */

        allSales =
            Array.isArray(sales)
                ? sales
                : [];


        /*
         * Initially show all sales.
         */

        filteredSales =
            [...allSales];


        /*
         * Update summary cards.
         */

        updateSalesSummary();


        /*
         * Render sales table.
         */

        renderSalesTable();


    } catch (error) {

        console.error(
            "Sales loading error:",
            error
        );


        allSales = [];

        filteredSales = [];


        updateSalesSummary();

        renderSalesTable();


        showSalesMessage(
            "Unable to load sales data. Please try again."
        );

    }

}


/* =====================================================
   UPDATE SALES SUMMARY
   ===================================================== */

function updateSalesSummary() {

    let totalSales = 0;

    let todaySales = 0;

    let monthlySales = 0;


    const now = new Date();


    const today =
        formatDateForComparison(now);


    const currentYear =
        now.getFullYear();

    const currentMonth =
        now.getMonth();


    allSales.forEach(function (sale) {

        const amount =
            Number(sale.totalAmount) || 0;


        totalSales += amount;


        if (!sale.orderDate) {

            return;

        }


        const saleDate =
            new Date(sale.orderDate);


        if (isNaN(saleDate.getTime())) {

            return;

        }


        const saleDateOnly =
            formatDateForComparison(saleDate);


        /*
         * Today's Sales
         */

        if (saleDateOnly === today) {

            todaySales += amount;

        }


        /*
         * Monthly Sales
         */

        if (
            saleDate.getFullYear() === currentYear &&
            saleDate.getMonth() === currentMonth
        ) {

            monthlySales += amount;

        }

    });


    /*
     * Update cards.
     */

    totalSalesElement.textContent =
        formatCurrency(totalSales);


    todaySalesElement.textContent =
        formatCurrency(todaySales);


    monthlySalesElement.textContent =
        formatCurrency(monthlySales);


    totalSalesOrdersElement.textContent =
        allSales.length;

}


/* =====================================================
   FORMAT CURRENCY
   ===================================================== */

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =====================================================
   FORMAT DATE FOR COMPARISON
   ===================================================== */

function formatDateForComparison(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =====================================================
   FORMAT SALES DATE
   ===================================================== */

function formatSalesDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return "-";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showSalesMessage(message) {

    console.warn(message);

}
/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   SALES MANAGEMENT
   FINAL JAVASCRIPT - PART 2
   ===================================================== */


/* =====================================================
   RENDER SALES TABLE
   ===================================================== */

function renderSalesTable() {

    if (!salesTableBody) {
        return;
    }


    /*
     * Clear existing table rows.
     */

    salesTableBody.innerHTML = "";


    /*
     * No sales available.
     */

    if (
        !filteredSales ||
        filteredSales.length === 0
    ) {

        if (salesEmptyState) {
            salesEmptyState.style.display = "block";
        }

        return;
    }


    /*
     * Sales available.
     */

    if (salesEmptyState) {
        salesEmptyState.style.display = "none";
    }


    /*
     * Create table rows.
     */

    filteredSales.forEach(function (sale) {

        const row =
            document.createElement("tr");


        /* =================================================
           SALE ID
           ================================================= */

        const salesIdCell =
            document.createElement("td");

        salesIdCell.innerHTML = `
            <span class="sales-id">
                ${escapeHtml(sale.id ?? "-")}
            </span>
        `;


        /* =================================================
           ORDER ID
           ================================================= */

        const orderIdCell =
            document.createElement("td");

        orderIdCell.innerHTML = `
            <span class="order-id">
                ${escapeHtml(sale.orderId ?? "-")}
            </span>
        `;


        /* =================================================
           CUSTOMER
           ================================================= */

        const customerCell =
            document.createElement("td");

        customerCell.innerHTML = `
            <span class="sales-customer-name">
                ${escapeHtml(sale.customerName ?? "-")}
            </span>
        `;


        /* =================================================
           TOTAL AMOUNT
           ================================================= */

        const amountCell =
            document.createElement("td");

        amountCell.innerHTML = `
            <span class="sales-amount">
                ${formatCurrency(sale.totalAmount)}
            </span>
        `;


        /* =================================================
           PAYMENT STATUS
           ================================================= */

        const paymentStatusCell =
            document.createElement("td");

        const paymentStatus =
            String(
                sale.paymentStatus ?? "PENDING"
            ).toUpperCase();


        let paymentClass = "pending";

        if (paymentStatus === "PAID") {

            paymentClass = "paid";

        } else if (paymentStatus === "FAILED") {

            paymentClass = "failed";

        }


        paymentStatusCell.innerHTML = `
            <span class="sales-payment-status ${paymentClass}">
                ${formatPaymentStatus(paymentStatus)}
            </span>
        `;


        /* =================================================
           SALES DATE
           ================================================= */

        const dateCell =
            document.createElement("td");

        dateCell.textContent =
            formatSalesDate(sale.orderDate);


        /* =================================================
           ACTIONS
           ================================================= */

        const actionsCell =
            document.createElement("td");


        const actionsWrapper =
            document.createElement("div");

        actionsWrapper.className =
            "sales-actions";


        /*
         * VIEW BUTTON
         */

        const viewButton =
            document.createElement("button");

        viewButton.type = "button";

        viewButton.className =
            "sales-action-button view-sale-button";

        viewButton.textContent = "View";


        viewButton.addEventListener(
            "click",
            function () {

                viewSale(sale.id);

            }
        );


        /*
         * UPDATE BUTTON
         */

        const updateButton =
            document.createElement("button");

        updateButton.type = "button";

        updateButton.className =
            "sales-action-button update-sale-button";

        updateButton.textContent = "Update";


        updateButton.addEventListener(
            "click",
            function () {

                openUpdateSaleModal(sale.id);

            }
        );


        /*
         * DELETE / CANCEL BUTTON
         */

        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className =
            "sales-action-button delete-sale-button";

        deleteButton.textContent = "Delete";


        deleteButton.addEventListener(
            "click",
            function () {

                openDeleteSaleModal(sale.id);

            }
        );


        /*
         * Add buttons.
         */

        actionsWrapper.appendChild(viewButton);

        actionsWrapper.appendChild(updateButton);

        actionsWrapper.appendChild(deleteButton);


        actionsCell.appendChild(actionsWrapper);


        /* =================================================
           ADD CELLS TO ROW
           ================================================= */

        row.appendChild(salesIdCell);

        row.appendChild(orderIdCell);

        row.appendChild(customerCell);

        row.appendChild(amountCell);

        row.appendChild(paymentStatusCell);

        row.appendChild(dateCell);

        row.appendChild(actionsCell);


        /*
         * Add row to table.
         */

        salesTableBody.appendChild(row);

    });

}


/* =====================================================
   PAYMENT STATUS TEXT
   ===================================================== */

function formatPaymentStatus(status) {

    switch (status) {

        case "PAID":
            return "Paid";

        case "FAILED":
            return "Failed";

        case "PENDING":
            return "Pending";

        default:
            return status || "Pending";

    }

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   FIND SALE BY ID
   ===================================================== */

function findSaleById(id) {

    return allSales.find(function (sale) {

        return Number(sale.id) === Number(id);

    });

}


/* =====================================================
   VIEW SALE
   ===================================================== */

async function viewSale(id) {

    try {

        const response =
            await fetch(
                `/api/admin/sales/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load sale details."
            );

        }


        const sale =
            await response.json();


        displaySaleDetails(sale);

        openSalesModal("viewSaleModal");


    } catch (error) {

        console.error(
            "View sale error:",
            error
        );


        /*
         * Fallback to already loaded sale.
         */

        const sale =
            findSaleById(id);


        if (sale) {

            displaySaleDetails(sale);

            openSalesModal("viewSaleModal");

        } else {

            showSalesMessage(
                "Unable to load sale details."
            );

        }

    }

}


/* =====================================================
   DISPLAY SALE DETAILS
   ===================================================== */

function displaySaleDetails(sale) {

    const saleDetails =
        document.getElementById("saleDetails");


    if (!saleDetails) {
        return;
    }


    saleDetails.innerHTML = `

        <div class="sale-detail-row">
            <span>Sales ID</span>
            <strong>
                ${escapeHtml(sale.id ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Order ID</span>
            <strong>
                ${escapeHtml(sale.orderId ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Customer</span>
            <strong>
                ${escapeHtml(sale.customerName ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Mobile Number</span>
            <strong>
                ${escapeHtml(sale.mobileNumber ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Email</span>
            <strong>
                ${escapeHtml(sale.email ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Delivery Address</span>
            <strong>
                ${escapeHtml(sale.deliveryAddress ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>City</span>
            <strong>
                ${escapeHtml(sale.city ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Pincode</span>
            <strong>
                ${escapeHtml(sale.pincode ?? "-")}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Total Amount</span>
            <strong>
                ${formatCurrency(sale.totalAmount)}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Payment Status</span>
            <strong>
                ${formatPaymentStatus(
                    String(
                        sale.paymentStatus ?? "PENDING"
                    ).toUpperCase()
                )}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Order Status</span>
            <strong>
                ${formatOrderStatus(
                    String(
                        sale.orderStatus ?? "-"
                    ).toUpperCase()
                )}
            </strong>
        </div>

        <div class="sale-detail-row">
            <span>Sales Date</span>
            <strong>
                ${formatSalesDate(sale.orderDate)}
            </strong>
        </div>

    `;

}


/* =====================================================
   ORDER STATUS TEXT
   ===================================================== */

function formatOrderStatus(status) {

    switch (status) {

        case "PENDING":
            return "Pending";

        case "CONFIRMED":
            return "Confirmed";

        case "SHIPPED":
            return "Shipped";

        case "DELIVERED":
            return "Delivered";

        case "CANCELLED":
            return "Cancelled";

        default:
            return status || "-";

    }

}


/* =====================================================
   OPEN MODAL
   ===================================================== */

function openSalesModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (!modal) {
        return;
    }


    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow = "hidden";

}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeSalesModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (!modal) {
        return;
    }


    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Restore page scrolling.
     */

    document.body.style.overflow = "";

}


/* =====================================================
   MAKE CLOSE FUNCTION AVAILABLE TO HTML
   ===================================================== */

window.closeSalesModal =
    closeSalesModal;
    /* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   SALES MANAGEMENT
   FINAL JAVASCRIPT - PART 3
   ===================================================== */


/* =====================================================
   INITIALIZE FILTERS
   ===================================================== */

function initializeFilters() {

    if (salesSearch) {

        salesSearch.addEventListener(
            "input",
            applySalesFilters
        );

    }


    if (paymentStatusFilter) {

        paymentStatusFilter.addEventListener(
            "change",
            applySalesFilters
        );

    }


    if (salesDateFilter) {

        salesDateFilter.addEventListener(
            "change",
            applySalesFilters
        );

    }


    if (clearSalesFilters) {

        clearSalesFilters.addEventListener(
            "click",
            clearAllSalesFilters
        );

    }

}


/* =====================================================
   APPLY SALES FILTERS
   ===================================================== */

function applySalesFilters() {

    const searchText =
        salesSearch
            ? salesSearch.value.trim().toLowerCase()
            : "";


    const selectedPaymentStatus =
        paymentStatusFilter
            ? paymentStatusFilter.value.toUpperCase()
            : "ALL";


    const selectedDate =
        salesDateFilter
            ? salesDateFilter.value
            : "";


    filteredSales =
        allSales.filter(function (sale) {


            /* =============================================
               SEARCH FILTER
               ============================================= */

            const orderId =
                String(
                    sale.orderId ?? ""
                ).toLowerCase();


            const customerName =
                String(
                    sale.customerName ?? ""
                ).toLowerCase();


            const matchesSearch =
                searchText === "" ||
                orderId.includes(searchText) ||
                customerName.includes(searchText);


            if (!matchesSearch) {

                return false;

            }


            /* =============================================
               PAYMENT STATUS FILTER
               ============================================= */

            const paymentStatus =
                String(
                    sale.paymentStatus ?? ""
                ).toUpperCase();


            const matchesPayment =
                selectedPaymentStatus === "ALL" ||
                paymentStatus === selectedPaymentStatus;


            if (!matchesPayment) {

                return false;

            }


            /* =============================================
               SALES DATE FILTER
               ============================================= */

            if (selectedDate !== "") {

                if (!sale.orderDate) {

                    return false;

                }


                const saleDate =
                    new Date(sale.orderDate);


                if (isNaN(saleDate.getTime())) {

                    return false;

                }


                const saleDateOnly =
                    formatDateForComparison(saleDate);


                if (saleDateOnly !== selectedDate) {

                    return false;

                }

            }


            return true;

        });


    /*
     * Render filtered results.
     */

    renderSalesTable();

}


/* =====================================================
   CLEAR ALL SALES FILTERS
   ===================================================== */

function clearAllSalesFilters() {

    if (salesSearch) {

        salesSearch.value = "";

    }


    if (paymentStatusFilter) {

        paymentStatusFilter.value = "ALL";

    }


    if (salesDateFilter) {

        salesDateFilter.value = "";

    }


    filteredSales =
        [...allSales];


    renderSalesTable();

}


/* =====================================================
   INITIALIZE SALES FORMS
   ===================================================== */

function initializeSalesForms() {

    const updateSaleForm =
        document.getElementById("updateSaleForm");


    if (updateSaleForm) {

        updateSaleForm.addEventListener(
            "submit",
            handleUpdateSale
        );

    }


    const confirmDeleteSale =
        document.getElementById(
            "confirmDeleteSale"
        );


    if (confirmDeleteSale) {

        confirmDeleteSale.addEventListener(
            "click",
            handleDeleteSale
        );

    }


    /*
     * Close modal when clicking outside
     * the modal content.
     */

    document
        .querySelectorAll(".sales-modal")
        .forEach(function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        closeSalesModal(
                            modal.id
                        );

                    }

                }
            );

        });


    /*
     * Close modal with Escape key.
     */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            document
                .querySelectorAll(
                    ".sales-modal.show"
                )
                .forEach(function (modal) {

                    closeSalesModal(
                        modal.id
                    );

                });

        }
    );

}


/* =====================================================
   OPEN UPDATE SALE MODAL
   ===================================================== */

function openUpdateSaleModal(id) {

    const sale =
        findSaleById(id);


    if (!sale) {

        showSalesMessage(
            "Sale not found."
        );

        return;

    }


    selectedSaleId =
        Number(id);


    const updateSaleId =
        document.getElementById(
            "updateSaleId"
        );


    const updatePaymentStatus =
        document.getElementById(
            "updatePaymentStatus"
        );


    if (updateSaleId) {

        updateSaleId.value =
            sale.id;

    }


    if (updatePaymentStatus) {

        updatePaymentStatus.value =
            String(
                sale.paymentStatus ?? "PENDING"
            ).toUpperCase();

    }


    openSalesModal(
        "updateSaleModal"
    );

}


/* =====================================================
   HANDLE UPDATE SALE
   ===================================================== */

async function handleUpdateSale(event) {

    event.preventDefault();


    const updateSaleId =
        document.getElementById(
            "updateSaleId"
        );


    const updatePaymentStatus =
        document.getElementById(
            "updatePaymentStatus"
        );


    if (
        !updateSaleId ||
        !updatePaymentStatus
    ) {

        return;

    }


    const id =
        updateSaleId.value;


    const paymentStatus =
        updatePaymentStatus.value;


    if (!id) {

        showSalesMessage(
            "Invalid sale ID."
        );

        return;

    }


    if (!paymentStatus) {

        showSalesMessage(
            "Please select payment status."
        );

        return;

    }


    const saveButton =
        document.querySelector(
            ".save-sale-button"
        );


    try {

        if (saveButton) {

            saveButton.disabled = true;

            saveButton.textContent =
                "Updating...";

        }


        /*
         * Existing backend endpoint.
         *
         * PUT
         * /api/admin/orders/{id}/payment-status
         */

        const response =
            await fetch(
                `/api/admin/orders/${encodeURIComponent(id)}/payment-status?status=${encodeURIComponent(paymentStatus)}`,
                {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to update payment status."
            );

        }


        /*
         * Close update modal.
         */

        closeSalesModal(
            "updateSaleModal"
        );


        /*
         * Reload real backend data.
         *
         * This automatically updates:
         * - Summary cards
         * - Table
         * - Payment status
         */

        await loadSales();


        showSalesMessage(
            "Sale payment status updated successfully."
        );


    } catch (error) {

        console.error(
            "Update sale error:",
            error
        );


        showSalesMessage(
            "Unable to update sale. Please try again."
        );


    } finally {

        if (saveButton) {

            saveButton.disabled = false;

            saveButton.textContent =
                "Update Sale";

        }

    }

}


/* =====================================================
   OPEN DELETE / CANCEL SALE MODAL
   ===================================================== */

function openDeleteSaleModal(id) {

    const sale =
        findSaleById(id);


    if (!sale) {

        showSalesMessage(
            "Sale not found."
        );

        return;

    }


    selectedSaleId =
        Number(id);


    const deleteSaleId =
        document.getElementById(
            "deleteSaleId"
        );


    if (deleteSaleId) {

        deleteSaleId.textContent =
            `Sale ID: ${sale.id}`;

    }


    openSalesModal(
        "deleteSaleModal"
    );

}
/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   SALES MANAGEMENT
   FINAL JAVASCRIPT - PART 4
   ===================================================== */


/* =====================================================
   HANDLE DELETE / CANCEL SALE
   ===================================================== */

async function handleDeleteSale() {

    if (!selectedSaleId) {

        showSalesMessage(
            "Invalid sale ID."
        );

        return;

    }


    const confirmButton =
        document.getElementById(
            "confirmDeleteSale"
        );


    try {

        if (confirmButton) {

            confirmButton.disabled = true;

            confirmButton.textContent =
                "Cancelling...";

        }


        /*
         * IMPORTANT:
         *
         * Existing backend does NOT physically
         * delete the order.
         *
         * DELETE endpoint changes:
         *
         * orderStatus = CANCELLED
         */

        const response =
            await fetch(
                `/api/admin/orders/${encodeURIComponent(selectedSaleId)}`,
                {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to cancel sale."
            );

        }


        /*
         * Close delete modal.
         */

        closeSalesModal(
            "deleteSaleModal"
        );


        /*
         * Reset selected sale.
         */

        selectedSaleId = null;


        /*
         * Reload sales from backend.
         *
         * Since cancelled orders are excluded
         * by SalesService, the cancelled sale
         * will disappear from the sales table.
         */

        await loadSales();


        showSalesMessage(
            "Sale cancelled successfully."
        );


    } catch (error) {

        console.error(
            "Delete / cancel sale error:",
            error
        );


        showSalesMessage(
            "Unable to cancel sale. Please try again."
        );


    } finally {

        if (confirmButton) {

            confirmButton.disabled = false;

            confirmButton.textContent =
                "Yes, Cancel";

        }

    }

}


/* =====================================================
   SIDEBAR INITIALIZATION
   ===================================================== */

function initializeSidebar() {

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );


    const sidebarToggle =
        document.getElementById(
            "sidebarToggle"
        );


    if (!sidebar || !sidebarToggle) {

        return;

    }


    /*
     * Mobile sidebar toggle.
     */

    sidebarToggle.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "active"
            );

        }
    );


    /*
     * Close sidebar when clicking
     * outside it on mobile.
     */

    document.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth > 768
            ) {

                return;

            }


            const clickedInsideSidebar =
                sidebar.contains(event.target);


            const clickedToggle =
                sidebarToggle.contains(event.target);


            if (
                !clickedInsideSidebar &&
                !clickedToggle
            ) {

                sidebar.classList.remove(
                    "active"
                );

            }

        }
    );


    /*
     * Close sidebar after selecting
     * a navigation item on mobile.
     */

    const navigationItems =
        sidebar.querySelectorAll(
            ".admin-nav-item"
        );


    navigationItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 768
                    ) {

                        sidebar.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }
    );


    /*
     * Keep sidebar state clean when
     * switching back to desktop.
     */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 768
            ) {

                sidebar.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =====================================================
   LOGOUT INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const logoutButton =
            document.getElementById(
                "adminLogoutButton"
            );


        if (!logoutButton) {

            return;

        }


        logoutButton.addEventListener(
            "click",
            async function () {

                /*
                 * Use the existing Spring Security
                 * logout endpoint.
                 */

                try {

                    const response =
                        await fetch(
                            "/logout",
                            {
                                method: "POST",
                                headers: {
                                    "Accept":
                                        "application/json"
                                }
                            }
                        );


                    /*
                     * Redirect to login regardless
                     * of whether Spring Security
                     * returns a redirect response.
                     */

                    if (
                        response.ok ||
                        response.redirected
                    ) {

                        window.location.href =
                            "/login";

                        return;

                    }


                    window.location.href =
                        "/login";


                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    /*
                     * Fallback redirect.
                     */

                    window.location.href =
                        "/login";

                }

            }
        );

    }
);


/* =====================================================
   RESET SELECTED SALE
   ===================================================== */

function resetSelectedSale() {

    selectedSaleId = null;


    const updateSaleId =
        document.getElementById(
            "updateSaleId"
        );


    if (updateSaleId) {

        updateSaleId.value = "";

    }

}


/* =====================================================
   CLOSE MODAL AND RESET STATE
   ===================================================== */

const originalCloseSalesModal =
    closeSalesModal;


window.closeSalesModal =
    function (modalId) {

        originalCloseSalesModal(
            modalId
        );


        /*
         * Reset selected sale when
         * update/delete modal closes.
         */

        if (
            modalId === "updateSaleModal" ||
            modalId === "deleteSaleModal"
        ) {

            resetSelectedSale();

        }

    };


/* =====================================================
   FINAL PAGE SAFETY
   ===================================================== */

window.addEventListener(
    "beforeunload",
    function () {

        document.body.style.overflow = "";

    }
);
/* =====================================================
   SULAIHA SMART MANAGEMENT SYSTEM
   SALES MANAGEMENT
   FINAL JAVASCRIPT - PART 5
   ===================================================== */


/* =====================================================
   SALES NOTIFICATION
   ===================================================== */

function showSalesNotification(message, type = "success") {

    /*
     * Remove existing notification.
     */

    const existingNotification =
        document.getElementById(
            "salesNotification"
        );

    if (existingNotification) {
        existingNotification.remove();
    }


    /*
     * Create notification.
     */

    const notification =
        document.createElement("div");

    notification.id =
        "salesNotification";

    notification.className =
        `sales-notification ${type}`;


    /*
     * Notification icon.
     */

    const icon =
        type === "success"
            ? "✓"
            : "⚠";


    notification.innerHTML = `
        <span class="sales-notification-icon">
            ${icon}
        </span>

        <span class="sales-notification-message">
            ${escapeHtml(message)}
        </span>
    `;


    document.body.appendChild(
        notification
    );


    /*
     * Automatically remove after 3 seconds.
     */

    setTimeout(function () {

        notification.classList.add(
            "hide"
        );


        setTimeout(function () {

            notification.remove();

        }, 300);

    }, 3000);

}


/* =====================================================
   UPDATE MESSAGE FUNCTION
   ===================================================== */

function showSalesMessage(message) {

    console.log(
        "Sales Management:",
        message
    );


    /*
     * Detect success/error messages.
     */

    const lowerMessage =
        String(message).toLowerCase();


    const isError =
        lowerMessage.includes("unable") ||
        lowerMessage.includes("failed") ||
        lowerMessage.includes("error") ||
        lowerMessage.includes("invalid");


    showSalesNotification(
        message,
        isError ? "error" : "success"
    );

}


/* =====================================================
   FILTER RESULT MESSAGE
   ===================================================== */

function getFilteredSalesCount() {

    return Array.isArray(filteredSales)
        ? filteredSales.length
        : 0;

}


/* =====================================================
   UPDATE EMPTY STATE MESSAGE
   ===================================================== */

function updateSalesEmptyState() {

    if (!salesEmptyState) {
        return;
    }


    const count =
        getFilteredSalesCount();


    if (count > 0) {

        salesEmptyState.style.display =
            "none";

        return;

    }


    salesEmptyState.style.display =
        "block";


    const heading =
        salesEmptyState.querySelector("h3");


    const paragraph =
        salesEmptyState.querySelector("p");


    /*
     * If filters are active,
     * show a different message.
     */

    const hasSearch =
        salesSearch &&
        salesSearch.value.trim() !== "";


    const hasPaymentFilter =
        paymentStatusFilter &&
        paymentStatusFilter.value !== "ALL";


    const hasDateFilter =
        salesDateFilter &&
        salesDateFilter.value !== "";


    if (
        hasSearch ||
        hasPaymentFilter ||
        hasDateFilter
    ) {

        if (heading) {

            heading.textContent =
                "No Matching Sales";

        }


        if (paragraph) {

            paragraph.textContent =
                "No sales match the selected search or filters.";

        }

    } else {

        if (heading) {

            heading.textContent =
                "No Sales Available";

        }


        if (paragraph) {

            paragraph.textContent =
                "Successful sales will appear here when completed customer orders are available.";

        }

    }

}


/* =====================================================
   KEEP EMPTY STATE IN SYNC
   ===================================================== */

const originalRenderSalesTable =
    renderSalesTable;


renderSalesTable =
    function () {

        originalRenderSalesTable();

        updateSalesEmptyState();

    };


/* =====================================================
   PREVENT MODAL SCROLL ISSUES
   ===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            event.target.closest(
                ".sales-modal"
            );


        if (!modal) {
            return;
        }


        /*
         * Prevent background page
         * scrolling while modal is open.
         */

        if (
            modal.classList.contains("show")
        ) {

            document.body.style.overflow =
                "hidden";

        }

    }
);


/* =====================================================
   RELOAD SALES WHEN PAGE RETURNS
   ===================================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        /*
         * Reload only when user returns
         * to the Sales page.
         */

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadSales();

        }

    }
);


/* =====================================================
   FINAL SALES PAGE CHECK
   ===================================================== */

function validateSalesPage() {

    const requiredElements = [

        "salesTableBody",
        "salesEmptyState",
        "totalSales",
        "todaySales",
        "monthlySales",
        "totalSalesOrders",
        "salesSearch",
        "paymentStatusFilter",
        "salesDateFilter",
        "clearSalesFilters",
        "viewSaleModal",
        "updateSaleModal",
        "deleteSaleModal",
        "updateSaleForm",
        "updateSaleId",
        "updatePaymentStatus",
        "confirmDeleteSale"

    ];


    const missingElements = [];


    requiredElements.forEach(
        function (elementId) {

            if (
                !document.getElementById(
                    elementId
                )
            ) {

                missingElements.push(
                    elementId
                );

            }

        }
    );


    if (
        missingElements.length > 0
    ) {

        console.warn(
            "Missing Sales Management elements:",
            missingElements
        );

        return false;

    }


    return true;

}


/* =====================================================
   FINAL INITIALIZATION CHECK
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const pageIsValid =
            validateSalesPage();


        if (pageIsValid) {

            console.log(
                "Sales Management initialized successfully."
            );

        }

    }
);