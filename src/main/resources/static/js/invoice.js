/* =====================================================
   INVOICE MANAGEMENT
   SULAIHA SMART MANAGEMENT SYSTEM
   ===================================================== */


/* =====================================================
   GLOBAL DATA
   ===================================================== */

let invoiceRecords = [];

let filteredInvoiceRecords = [];

let selectedInvoiceId = null;


/* =====================================================
   DOM READY
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupInvoicePage();
    setupAdminLogoutConfirm()

});


/* =====================================================
   PAGE SETUP
   ===================================================== */

function setupInvoicePage() {

    setupAdminSidebar();

    setupAdminLogout();

    setupInvoiceSearch();

    setupInvoiceFilters();

    setupInvoiceEditForm();

    setupInvoiceDelete();

    setupInvoiceModalEvents();

    loadInvoiceRecords();

}


/* =====================================================
   ADMIN SIDEBAR
   ===================================================== */

function setupAdminSidebar() {

    const sidebar =
        document.getElementById("adminSidebar");

    const toggle =
        document.getElementById("sidebarToggle");

    if (!sidebar || !toggle) {
        return;
    }

    toggle.addEventListener("click", function () {

        sidebar.classList.toggle("active");

    });

}


/* =====================================================
   ADMIN LOGOUT
   ===================================================== */

function setupAdminLogout() {

    const logoutButton =
        document.getElementById("adminLogoutButton");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", function () {

        const confirmed =
            confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmed) {
            return;
        }

        window.location.href = "/login";

    });

}


/* =====================================================
   LOAD INVOICE RECORDS
   ===================================================== */

async function loadInvoiceRecords() {

    try {

        showInvoiceLoading();

        const response =
            await fetch("/api/admin/invoice");

        if (!response.ok) {

            throw new Error(
                "Unable to load invoice records."
            );

        }

        const data =
            await response.json();

        invoiceRecords =
            Array.isArray(data) ? data : [];

        filteredInvoiceRecords =
            [...invoiceRecords];

        updateInvoiceSummary();

        renderInvoiceTable();

    } catch (error) {

        console.error(
            "Invoice loading error:",
            error
        );

        showInvoiceError(
            "Unable to load invoice records."
        );

    }

}


/* =====================================================
   INVOICE SEARCH
   ===================================================== */

function setupInvoiceSearch() {

    const searchInput =
        document.getElementById("invoiceSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        function () {

            applyInvoiceFilters();

        }
    );

}


/* =====================================================
   FILTER SETUP
   ===================================================== */

function setupInvoiceFilters() {

    const applyButton =
        document.getElementById(
            "applyInvoiceFilter"
        );

    const resetButton =
        document.getElementById(
            "resetInvoiceFilter"
        );

    if (applyButton) {

        applyButton.addEventListener(
            "click",
            function () {

                applyInvoiceFilters();

            }
        );

    }

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                resetInvoiceFilters();

            }
        );

    }

}


/* =====================================================
   APPLY FILTERS
   ===================================================== */

function applyInvoiceFilters() {

    const searchInput =
        document.getElementById("invoiceSearch");

    const fromDate =
        document.getElementById("invoiceDateFrom");

    const toDate =
        document.getElementById("invoiceDateTo");

    const statusFilter =
        document.getElementById(
            "invoiceStatusFilter"
        );

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const from =
        fromDate
            ? fromDate.value
            : "";

    const to =
        toDate
            ? toDate.value
            : "";

    const status =
        statusFilter
            ? statusFilter.value
            : "ALL";


    filteredInvoiceRecords =
        invoiceRecords.filter(function (invoice) {

            const billId =
                String(
                    invoice.id ?? ""
                ).toLowerCase();

            const orderId =
                String(
                    invoice.orderId ?? ""
                ).toLowerCase();

            const customerName =
                String(
                    invoice.customerName ?? ""
                ).toLowerCase();

            const matchesSearch =
                !search ||
                billId.includes(search) ||
                orderId.includes(search) ||
                customerName.includes(search);


            const invoiceDate =
                getInvoiceDateValue(invoice);

            const matchesFrom =
                !from ||
                invoiceDate >= from;

            const matchesTo =
                !to ||
                invoiceDate <= to;


            const invoiceStatus =
                String(
                    invoice.paymentStatus ?? ""
                ).toUpperCase();

            const matchesStatus =
                status === "ALL" ||
                invoiceStatus === status;


            return (
                matchesSearch &&
                matchesFrom &&
                matchesTo &&
                matchesStatus
            );

        });


    renderInvoiceTable();

}


/* =====================================================
   RESET FILTERS
   ===================================================== */

function resetInvoiceFilters() {

    const searchInput =
        document.getElementById("invoiceSearch");

    const fromDate =
        document.getElementById("invoiceDateFrom");

    const toDate =
        document.getElementById("invoiceDateTo");

    const statusFilter =
        document.getElementById(
            "invoiceStatusFilter"
        );


    if (searchInput) {
        searchInput.value = "";
    }

    if (fromDate) {
        fromDate.value = "";
    }

    if (toDate) {
        toDate.value = "";
    }

    if (statusFilter) {
        statusFilter.value = "ALL";
    }


    filteredInvoiceRecords =
        [...invoiceRecords];

    renderInvoiceTable();

}


/* =====================================================
   GET INVOICE DATE
   ===================================================== */

function getInvoiceDateValue(invoice) {

    const date =
        invoice.invoiceDate ||
        invoice.billingDate ||
        invoice.orderDate ||
        "";

    if (!date) {
        return "";
    }

    return String(date).substring(0, 10);

}
/* =====================================================
   UPDATE INVOICE SUMMARY
   ===================================================== */

function updateInvoiceSummary() {

    const totalInvoices =
        invoiceRecords.length;

    let totalAmount = 0;
    let paidInvoices = 0;
    let pendingInvoices = 0;


    invoiceRecords.forEach(function (invoice) {

        const amount =
            Number(invoice.totalAmount ?? 0);

        const status =
            String(
                invoice.paymentStatus ?? ""
            )
            .trim()
            .toUpperCase();


        // ---------------------------------------------
        // TOTAL INVOICE AMOUNT
        // ---------------------------------------------

        totalAmount += amount;


        // ---------------------------------------------
        // PAID INVOICES COUNT
        // ---------------------------------------------

        if (status === "PAID") {

            paidInvoices++;

        }


        // ---------------------------------------------
        // PENDING INVOICES COUNT
        // ---------------------------------------------

        else if (status === "PENDING") {

            pendingInvoices++;

        }

    });


    // ---------------------------------------------
    // UPDATE TOTAL INVOICES
    // ---------------------------------------------

    setElementText(
        "totalInvoices",
        totalInvoices
    );


    // ---------------------------------------------
    // UPDATE TOTAL INVOICE AMOUNT
    // ---------------------------------------------

    setElementText(
        "totalInvoiceAmount",
        formatCurrency(totalAmount)
    );


    // ---------------------------------------------
    // UPDATE PAID INVOICES
    // ---------------------------------------------

    setElementText(
        "totalPaidInvoices",
        paidInvoices
    );


    // ---------------------------------------------
    // UPDATE PENDING INVOICES
    // ---------------------------------------------

    setElementText(
        "totalPendingInvoices",
        pendingInvoices
    );

}


/* =====================================================
   RENDER INVOICE TABLE
   ===================================================== */

function renderInvoiceTable() {

    const tableBody =
        document.getElementById(
            "invoiceTableBody"
        );

    const emptyState =
        document.getElementById(
            "invoiceEmptyState"
        );

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !filteredInvoiceRecords ||
        filteredInvoiceRecords.length === 0
    ) {

        if (emptyState) {
            emptyState.classList.add("show");
        }

        return;

    }


    if (emptyState) {
        emptyState.classList.remove("show");
    }


    filteredInvoiceRecords.forEach(
        function (invoice) {

            const row =
                document.createElement("tr");


            /* -----------------------------------------
               BILLING / INVOICE ID
               ----------------------------------------- */

            const idCell =
                document.createElement("td");

            idCell.textContent =
                invoice.id ?? "-";


            /* -----------------------------------------
               ORDER ID
               ----------------------------------------- */

            const orderCell =
                document.createElement("td");

            orderCell.textContent =
                invoice.orderId ?? "-";


            /* -----------------------------------------
               CUSTOMER NAME
               ----------------------------------------- */

            const customerCell =
                document.createElement("td");

            customerCell.textContent =
                invoice.customerName ?? "-";


            /* -----------------------------------------
               AMOUNT
               ----------------------------------------- */

            const amountCell =
                document.createElement("td");

            amountCell.textContent =
                formatCurrency(
                    invoice.totalAmount
                );


            /* -----------------------------------------
               PAYMENT STATUS
               ----------------------------------------- */

            const statusCell =
                document.createElement("td");

            const statusBadge =
                document.createElement("span");

            const status =
                String(
                    invoice.paymentStatus ??
                    "PENDING"
                ).toUpperCase();


            statusBadge.className =
                "invoice-status " +
                getInvoiceStatusClass(status);

            statusBadge.textContent =
                status;


            statusCell.appendChild(
                statusBadge
            );


            /* -----------------------------------------
               BILLING DATE
               ----------------------------------------- */

            const dateCell =
                document.createElement("td");

            dateCell.textContent =
                formatInvoiceDate(
                    invoice.invoiceDate ||
                    invoice.billingDate ||
                    invoice.orderDate
                );


            /* -----------------------------------------
               ACTIONS
               ----------------------------------------- */

            const actionCell =
                document.createElement("td");

            const actions =
                document.createElement("div");

            actions.className =
                "invoice-actions";


            /* VIEW */

            const viewButton =
                createInvoiceActionButton(
                    "👁 View",
                    "invoice-view-button"
                );

            viewButton.addEventListener(
                "click",
                function () {

                    openViewInvoice(
                        invoice.id
                    );

                }
            );


            /* EDIT */

            const editButton =
                createInvoiceActionButton(
                    "✏️ Edit",
                    "invoice-edit-button"
                );

            editButton.addEventListener(
                "click",
                function () {

                    openEditInvoice(
                        invoice.id
                    );

                }
            );


            /* DELETE */

            const deleteButton =
                createInvoiceActionButton(
                    "🗑 Delete",
                    "invoice-delete-button"
                );

            deleteButton.addEventListener(
                "click",
                function () {

                    openDeleteInvoice(
                        invoice.id
                    );

                }
            );


            /* PRINT */

            const printButton =
                createInvoiceActionButton(
                    "🖨 Print",
                    "invoice-print-button"
                );

            printButton.addEventListener(
                "click",
                function () {

                    openPrintInvoice(
                        invoice.id
                    );

                }
            );


            actions.appendChild(viewButton);
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            actions.appendChild(printButton);

            actionCell.appendChild(actions);


            /* -----------------------------------------
               ADD CELLS TO ROW
               ----------------------------------------- */

            row.appendChild(idCell);
            row.appendChild(orderCell);
            row.appendChild(customerCell);
            row.appendChild(amountCell);
            row.appendChild(statusCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);

        }
    );

}


/* =====================================================
   CREATE ACTION BUTTON
   ===================================================== */

function createInvoiceActionButton(
    text,
    className
) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "invoice-action-button " +
        className;

    button.textContent = text;

    return button;

}


/* =====================================================
   STATUS CLASS
   ===================================================== */

function getInvoiceStatusClass(status) {

    return String(
        status || "PENDING"
    )
        .toLowerCase()
        .replace(/\s+/g, "-");

}


/* =====================================================
   FORMAT CURRENCY
   ===================================================== */

function formatCurrency(amount) {

    const value =
        Number(amount ?? 0);

    if (Number.isNaN(value)) {
        return "₹0.00";
    }

    return "₹" +
        value.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =====================================================
   FORMAT DATE
   ===================================================== */

function formatInvoiceDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
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
   SET ELEMENT TEXT
   ===================================================== */

function setElementText(
    elementId,
    value
) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = value;

}
/* =====================================================
   VIEW INVOICE
   ===================================================== */

async function openViewInvoice(invoiceId) {

    try {

        const response =
            await fetch(
                `/api/admin/invoice/${invoiceId}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load invoice details."
            );

        }

        const invoice =
            await response.json();

        selectedInvoiceId =
            invoice.id;


        const details =
            document.getElementById(
                "invoiceDetails"
            );

        if (!details) {
            return;
        }


        details.innerHTML = `

            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Invoice ID
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(invoice.id ?? "-")}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Order ID
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(invoice.orderId ?? "-")}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Customer Name
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(invoice.customerName ?? "-")}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Mobile Number
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(invoice.mobileNumber ?? "-")}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Email
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(invoice.email ?? "-")}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Amount
                </span>

                <span class="invoice-detail-value">
                    ${formatCurrency(invoice.totalAmount)}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Payment Status
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(
                        invoice.paymentStatus ?? "-"
                    )}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Order Status
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(
                        invoice.orderStatus ?? "-"
                    )}
                </span>
            </div>


            <div class="invoice-detail-item">
                <span class="invoice-detail-label">
                    Billing Date
                </span>

                <span class="invoice-detail-value">
                    ${formatInvoiceDate(
                        invoice.invoiceDate ||
                        invoice.billingDate ||
                        invoice.orderDate
                    )}
                </span>
            </div>


            <div class="invoice-detail-item full-width">
                <span class="invoice-detail-label">
                    Delivery Address
                </span>

                <span class="invoice-detail-value">
                    ${escapeHtml(
                        invoice.deliveryAddress ?? "-"
                    )}
                </span>
            </div>

        `;


        openInvoiceModal(
            "viewInvoiceModal"
        );


    } catch (error) {

        console.error(
            "View invoice error:",
            error
        );

        alert(
            "Unable to load invoice details."
        );

    }

}


/* =====================================================
   OPEN EDIT INVOICE
   ===================================================== */

async function openEditInvoice(invoiceId) {

    try {

        const response =
            await fetch(
                `/api/admin/invoice/${invoiceId}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load invoice."
            );

        }

        const invoice =
            await response.json();

        selectedInvoiceId =
            invoice.id;


        setInputValue(
            "editInvoiceId",
            invoice.id
        );

        setInputValue(
            "editInvoiceCustomer",
            invoice.customerName
        );

        setInputValue(
            "editInvoiceOrderId",
            invoice.orderId
        );

        setInputValue(
            "editInvoiceAmount",
            invoice.totalAmount
        );

        setInputValue(
            "editInvoiceStatus",
            invoice.paymentStatus
        );

        setInputValue(
            "editInvoiceDate",
            getInvoiceDateValue(invoice)
        );


        openInvoiceModal(
            "editInvoiceModal"
        );


    } catch (error) {

        console.error(
            "Edit invoice loading error:",
            error
        );

        alert(
            "Unable to load invoice for editing."
        );

    }

}


/* =====================================================
   EDIT FORM SETUP
   ===================================================== */

function setupInvoiceEditForm() {

    const form =
        document.getElementById(
            "editInvoiceForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await updateInvoice();

        }
    );

}


/* =====================================================
   UPDATE INVOICE
   ===================================================== */

async function updateInvoice() {

    const invoiceId =
        getInputValue(
            "editInvoiceId"
        );

    if (!invoiceId) {

        alert(
            "Invoice ID is missing."
        );

        return;

    }


    const customerName =
        getInputValue(
            "editInvoiceCustomer"
        );

    const orderId =
        getInputValue(
            "editInvoiceOrderId"
        );

    const amount =
        getInputValue(
            "editInvoiceAmount"
        );

    const status =
        getInputValue(
            "editInvoiceStatus"
        );

    const invoiceDate =
        getInputValue(
            "editInvoiceDate"
        );


    const params =
        new URLSearchParams();


    if (customerName) {
        params.append(
            "customerName",
            customerName
        );
    }

    if (orderId) {
        params.append(
            "orderId",
            orderId
        );
    }

    if (amount !== "") {
        params.append(
            "amount",
            amount
        );
    }

    if (status) {
        params.append(
            "status",
            status
        );
    }

    if (invoiceDate) {
        params.append(
            "invoiceDate",
            invoiceDate
        );
    }


    try {

        const response =
            await fetch(
                `/api/admin/invoice/${invoiceId}?${params.toString()}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Unable to update invoice."
            );

        }


        const updatedInvoice =
            await response.json();


        /* ---------------------------------------------
           UPDATE LOCAL DATA
           --------------------------------------------- */

        invoiceRecords =
            invoiceRecords.map(
                function (invoice) {

                    return invoice.id ===
                        updatedInvoice.id
                        ? updatedInvoice
                        : invoice;

                }
            );


        filteredInvoiceRecords =
            filteredInvoiceRecords.map(
                function (invoice) {

                    return invoice.id ===
                        updatedInvoice.id
                        ? updatedInvoice
                        : invoice;

                }
            );


        updateInvoiceSummary();

        renderInvoiceTable();

        closeInvoiceModal(
            "editInvoiceModal"
        );


        alert(
            "Invoice updated successfully."
        );


    } catch (error) {

        console.error(
            "Update invoice error:",
            error
        );

        alert(
            error.message ||
            "Unable to update invoice."
        );

    }

}


/* =====================================================
   SET INPUT VALUE
   ===================================================== */

function setInputValue(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    element.value =
        value ?? "";

}


/* =====================================================
   GET INPUT VALUE
   ===================================================== */

function getInputValue(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return "";
    }

    return element.value.trim();

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

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
   DELETE INVOICE SETUP
   ===================================================== */

function setupInvoiceDelete() {

    const confirmButton =
        document.getElementById(
            "invoiceConfirmDelete"
        );

    if (!confirmButton) {
        return;
    }

    confirmButton.addEventListener(
        "click",
        async function () {

            await deleteInvoice();

        }
    );

}


/* =====================================================
   OPEN DELETE CONFIRMATION
   ===================================================== */

function openDeleteInvoice(invoiceId) {

    selectedInvoiceId =
        invoiceId;

    openInvoiceModal(
        "deleteInvoiceModal"
    );

}


/* =====================================================
   DELETE INVOICE
   ===================================================== */

async function deleteInvoice() {

    if (!selectedInvoiceId) {

        alert(
            "Invoice ID is missing."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this invoice?"
        );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/admin/invoice/${selectedInvoiceId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Unable to delete invoice."
            );

        }


        invoiceRecords =
            invoiceRecords.filter(
                function (invoice) {

                    return invoice.id !==
                        selectedInvoiceId;

                }
            );


        filteredInvoiceRecords =
            filteredInvoiceRecords.filter(
                function (invoice) {

                    return invoice.id !==
                        selectedInvoiceId;

                }
            );


        updateInvoiceSummary();

        renderInvoiceTable();

        closeInvoiceModal(
            "deleteInvoiceModal"
        );


        selectedInvoiceId = null;


        alert(
            "Invoice deleted successfully."
        );


    } catch (error) {

        console.error(
            "Delete invoice error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete invoice."
        );

    }

}


/* =====================================================
   PRINT INVOICE
   ===================================================== */

async function openPrintInvoice(invoiceId) {

    try {

        const response =
            await fetch(
                `/api/admin/invoice/${invoiceId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load invoice for printing."
            );

        }


        const invoice =
            await response.json();


        selectedInvoiceId =
            invoice.id;


        const printDetails =
            document.getElementById(
                "invoicePrintPreview"
            );


        if (!printDetails) {

            window.print();

            return;

        }


        printDetails.innerHTML = `

            <div class="print-invoice-header">

                <h1>
                    SULAIHA
                </h1>

                <h2>
                    INVOICE
                </h2>

            </div>


            <div class="print-invoice-info">

                <div>
                    <strong>
                        Invoice ID
                    </strong>

                    <span>
                        ${escapeHtml(
                            invoice.id ?? "-"
                        )}
                    </span>
                </div>


                <div>
                    <strong>
                        Order ID
                    </strong>

                    <span>
                        ${escapeHtml(
                            invoice.orderId ?? "-"
                        )}
                    </span>
                </div>


                <div>
                    <strong>
                        Customer
                    </strong>

                    <span>
                        ${escapeHtml(
                            invoice.customerName ?? "-"
                        )}
                    </span>
                </div>


                <div>
                    <strong>
                        Invoice Date
                    </strong>

                    <span>
                        ${formatInvoiceDate(
                            invoice.invoiceDate ||
                            invoice.billingDate ||
                            invoice.orderDate
                        )}
                    </span>
                </div>

            </div>


            <div class="print-invoice-table-wrapper">

                <table class="print-invoice-table">

                    <thead>

                        <tr>

                            <th>
                                Description
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                Customer Order
                            </td>

                            <td>
                                ${formatCurrency(
                                    invoice.totalAmount
                                )}
                            </td>

                        </tr>

                    </tbody>

                    <tfoot>

                        <tr>

                            <th>
                                Total
                            </th>

                            <th>
                                ${formatCurrency(
                                    invoice.totalAmount
                                )}
                            </th>

                        </tr>

                    </tfoot>

                </table>

            </div>


            <div class="print-invoice-payment">

                <strong>
                    Payment Status:
                </strong>

                <span>
                    ${escapeHtml(
                        invoice.paymentStatus ?? "-"
                    )}
                </span>

            </div>


            <div class="print-invoice-customer">

                <strong>
                    Delivery Address
                </strong>

                <p>
                    ${escapeHtml(
                        invoice.deliveryAddress ?? "-"
                    )}
                </p>

            </div>


            <div class="print-invoice-footer">

                <p>
                    Thank you for choosing Sulaiha.
                </p>

            </div>

        `;


        openInvoiceModal(
            "printInvoiceModal"
        );


    } catch (error) {

        console.error(
            "Print invoice error:",
            error
        );

        alert(
            "Unable to prepare invoice for printing."
        );

    }

}


/* =====================================================
   PRINT CONFIRMATION
   ===================================================== */

function setupInvoiceModalEvents() {

    const printButton =
        document.getElementById(
            "invoicePrintConfirm"
        );

    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                printInvoiceDocument();

            }
        );

    }


    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList.contains(
                    "invoice-modal"
                )
            ) {

                event.target.setAttribute(
                    "aria-hidden",
                    "true"
                );

                event.target.classList.remove(
                    "active"
                );

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeAllInvoiceModals();

            }

        }
    );

}


/* =====================================================
   PRINT DOCUMENT
   ===================================================== */

function printInvoiceDocument() {

    const preview =
        document.getElementById(
            "invoicePrintPreview"
        );

    if (!preview) {

        window.print();

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the invoice."
        );

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                Sulaiha Invoice
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #222;
                }

                .print-invoice-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .print-invoice-header h1 {
                    margin: 0;
                    font-size: 28px;
                }

                .print-invoice-header h2 {
                    margin: 6px 0 0;
                    font-size: 20px;
                }

                .print-invoice-info {
                    display: grid;
                    grid-template-columns:
                        repeat(2, 1fr);
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .print-invoice-info div {
                    border: 1px solid #ddd;
                    padding: 12px;
                }

                .print-invoice-info strong {
                    display: block;
                    margin-bottom: 5px;
                }

                .print-invoice-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                }

                .print-invoice-table th,
                .print-invoice-table td {
                    border: 1px solid #ccc;
                    padding: 12px;
                    text-align: left;
                }

                .print-invoice-table th:last-child,
                .print-invoice-table td:last-child {
                    text-align: right;
                }

                .print-invoice-payment,
                .print-invoice-customer {
                    margin-top: 20px;
                }

                .print-invoice-customer p {
                    margin-top: 8px;
                }

                .print-invoice-footer {
                    margin-top: 50px;
                    text-align: center;
                }

                @media print {

                    body {
                        margin: 20px;
                    }

                }

            </style>

        </head>

        <body>

            ${preview.innerHTML}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();


    setTimeout(
        function () {

            printWindow.print();

            printWindow.close();

        },
        300
    );

}


/* =====================================================
   OPEN MODAL
   ===================================================== */

function openInvoiceModal(
    modalId
) {

    const modal =
        document.getElementById(
            modalId
        );

    if (!modal) {
        return;
    }


    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeInvoiceModal(
    modalId
) {

    const modal =
        document.getElementById(
            modalId
        );

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =====================================================
   CLOSE ALL MODALS
   ===================================================== */

function closeAllInvoiceModals() {

    const modals =
        document.querySelectorAll(
            ".invoice-modal"
        );


    modals.forEach(
        function (modal) {

            modal.classList.remove(
                "active"
            );

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );

}


/* =====================================================
   LOADING STATE
   ===================================================== */

function showInvoiceLoading() {

    const tableBody =
        document.getElementById(
            "invoiceTableBody"
        );

    const emptyState =
        document.getElementById(
            "invoiceEmptyState"
        );


    if (tableBody) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    Loading invoice records...
                </td>

            </tr>

        `;

    }


    if (emptyState) {

        emptyState.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   ERROR STATE
   ===================================================== */

function showInvoiceError(
    message
) {

    const tableBody =
        document.getElementById(
            "invoiceTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                style="text-align:center;"
            >
                ${escapeHtml(message)}
            </td>

        </tr>

    `;

}
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


/* =====================================================
   CLOSE MODAL FUNCTION
   ===================================================== */

window.closeInvoiceModal =
    closeInvoiceModal;


/* =====================================================
   GLOBAL PRINT FUNCTION
   ===================================================== */

window.printInvoiceDocument =
    printInvoiceDocument;


/* =====================================================
   GLOBAL ACTION FUNCTIONS
   ===================================================== */

window.openViewInvoice =
    openViewInvoice;

window.openEditInvoice =
    openEditInvoice;

window.openDeleteInvoice =
    openDeleteInvoice;

window.openPrintInvoice =
    openPrintInvoice;